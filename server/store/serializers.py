from decimal import Decimal
from uuid import uuid4

from django.contrib.auth.models import User
from django.utils.text import slugify
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import (
    CartItem,
    Category,
    Coupon,
    Favorite,
    Order,
    OrderItem,
    Product,
    ProductSize,
    ReturnPolicy,
    ReturnRequest,
    Review,
)


class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'stock']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class ProductSerializer(serializers.ModelSerializer):
    sizes = ProductSizeSerializer(many=True, read_only=True)
    sizes_data = serializers.JSONField(write_only=True, required=False)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True, required=False
    )
    category_name = serializers.CharField(write_only=True, required=False, allow_blank=True)
    isDiscounted = serializers.BooleanField(source='is_discounted', required=False)
    oldProductPrice = serializers.DecimalField(
        source='old_product_price', max_digits=10, decimal_places=2, allow_null=True, required=False
    )
    isArchived = serializers.BooleanField(source='is_archived', required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'oldProductPrice', 'isDiscounted',
            'gender', 'image', 'is_active', 'isArchived', 'category', 'category_id', 'category_name',
            'sizes', 'sizes_data'
        ]
        read_only_fields = ['id', 'slug', 'sizes', 'category']

    def _resolve_sizes(self, sizes_data):
        resolved = []
        for item in sizes_data or []:
            size = str(item.get('size') or item.get('Size') or '').strip()
            stock = item.get('stock', item.get('quantity', 0))
            if not size:
                raise serializers.ValidationError({'sizes_data': 'Every size must have a name.'})
            try:
                stock = int(stock)
            except (TypeError, ValueError) as exc:
                raise serializers.ValidationError({'sizes_data': 'Stock must be a whole number.'}) from exc
            if stock < 0:
                raise serializers.ValidationError({'sizes_data': 'Stock cannot be negative.'})
            resolved.append((size, stock))
        return resolved

    def _resolve_category(self, validated_data, category_name):
        if validated_data.get('category'):
            return validated_data['category']
        name = (category_name or '').strip()
        if not name:
            raise serializers.ValidationError({'category_id': 'A category is required.'})
        return Category.objects.get_or_create(name=name)[0]

    def create(self, validated_data):
        sizes_data = validated_data.pop('sizes_data', [])
        category_name = validated_data.pop('category_name', '')
        validated_data['category'] = self._resolve_category(validated_data, category_name)
        # Products created from the admin form are published by default.
        # Archiving remains the explicit way to hide a product from shoppers.
        validated_data['is_active'] = True
        validated_data['is_archived'] = False
        name = validated_data.get('name', 'product')
        validated_data['slug'] = f'{slugify(name)}-{uuid4().hex[:8]}'
        product = Product.objects.create(**validated_data)
        for size, stock in self._resolve_sizes(sizes_data):
            ProductSize.objects.create(product=product, size=size, stock=stock)
        return product

    def update(self, instance, validated_data):
        sizes_data = validated_data.pop('sizes_data', None)
        category_name = validated_data.pop('category_name', '')
        if category_name and 'category' not in validated_data:
            validated_data['category'] = self._resolve_category(validated_data, category_name)
        product = super().update(instance, validated_data)
        if sizes_data is not None:
            resolved = self._resolve_sizes(sizes_data)
            names = {size for size, _ in resolved}
            product.sizes.exclude(size__in=names).delete()
            for size, stock in resolved:
                ProductSize.objects.update_or_create(product=product, size=size, defaults={'stock': stock})
        return product


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            'id', 'code', 'discount_type', 'amount', 'min_order_total', 'active',
            'start_date', 'end_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_code(self, value):
        return value.strip().upper()


class CouponValidationSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('0.00'))

    def validate_code(self, value):
        return value.strip().upper()


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate(self, attrs):
        user = self.context['request'].user
        product = attrs['product']
        if Favorite.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError({'product_id': 'This product is already in favorites.'})
        return attrs


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True
    )
    product_size = ProductSizeSerializer(read_only=True)
    product_size_id = serializers.PrimaryKeyRelatedField(
        source='product_size', queryset=ProductSize.objects.all(), write_only=True
    )

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'product_size', 'product_size_id', 'quantity', 'added_at']
        read_only_fields = ['id', 'added_at']

    def validate(self, attrs):
        product = attrs.get('product', getattr(self.instance, 'product', None))
        product_size = attrs.get('product_size', getattr(self.instance, 'product_size', None))
        quantity = attrs.get('quantity', getattr(self.instance, 'quantity', 1))
        if product_size and product and product_size.product_id != product.id:
            raise serializers.ValidationError({'product_size_id': 'The selected size does not belong to this product.'})
        if product_size and quantity > product_size.stock:
            raise serializers.ValidationError({'quantity': 'The requested quantity exceeds available stock.'})
        return attrs


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_size = ProductSizeSerializer(read_only=True)
    return_request_status = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_size', 'quantity', 'price', 'return_request_status']

    def get_return_request_status(self, obj):
        request = getattr(obj, 'return_request', None)
        return request.status if request else None


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.PrimaryKeyRelatedField(source='product', queryset=Product.objects.all())
    product_size_id = serializers.PrimaryKeyRelatedField(source='product_size', queryset=ProductSize.objects.all())
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    coupon_code = serializers.CharField(source='coupon.code', read_only=True, default=None)
    total_price = serializers.DecimalField(source='total_amount', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'email', 'phone', 'message', 'latitude', 'longitude',
            'coupon_code', 'subtotal', 'discount_amount', 'total_amount', 'total_price',
            'status', 'created_at', 'updated_at', 'return_requested', 'return_deadline',
            'items',
        ]
        read_only_fields = fields


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'full_name', 'email', 'phone', 'message', 'latitude', 'longitude',
            'coupon_code', 'items',
        ]

    def validate(self, attrs):
        items = attrs.get('items', [])
        if not items:
            raise serializers.ValidationError({'items': 'An order must contain at least one item.'})
        for item in items:
            if item['product_size'].product_id != item['product'].id:
                raise serializers.ValidationError({'items': 'Every selected size must belong to its product.'})
            if item['quantity'] > item['product_size'].stock:
                raise serializers.ValidationError({'items': 'One or more requested quantities exceed available stock.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon_code = validated_data.pop('coupon_code', '').strip().upper()
        user = validated_data.pop('user', self.context['request'].user)

        locked_items = []
        subtotal = Decimal('0.00')
        for item_data in items_data:
            product_size = ProductSize.objects.select_for_update().select_related('product').get(
                pk=item_data['product_size'].pk
            )
            if product_size.product_id != item_data['product'].id:
                raise serializers.ValidationError({'items': 'Every selected size must belong to its product.'})
            if item_data['quantity'] > product_size.stock:
                raise serializers.ValidationError({'items': 'One or more requested quantities exceed available stock.'})
            line_price = product_size.product.price
            subtotal += line_price * item_data['quantity']
            locked_items.append((product_size, item_data['quantity'], line_price))

        coupon = None
        discount_amount = Decimal('0.00')
        if coupon_code:
            try:
                coupon = Coupon.objects.select_for_update().get(code__iexact=coupon_code)
            except Coupon.DoesNotExist as exc:
                raise serializers.ValidationError({'coupon_code': 'This coupon code is invalid.'}) from exc
            if not coupon.is_valid_for(subtotal):
                raise serializers.ValidationError({'coupon_code': 'This coupon is inactive, expired, or not applicable to this order.'})
            discount_amount = coupon.calculate_discount(subtotal)

        order = Order.objects.create(
            user=user,
            coupon=coupon,
            subtotal=subtotal,
            discount_amount=discount_amount,
            total_amount=subtotal - discount_amount,
            **validated_data,
        )
        for product_size, quantity, line_price in locked_items:
            OrderItem.objects.create(
                order=order,
                product=product_size.product,
                product_size=product_size,
                quantity=quantity,
                price=line_price,
            )
            product_size.stock -= quantity
            product_size.save(update_fields=['stock'])
        return order


class ReturnPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnPolicy
        fields = ['return_period_days', 'updated_at']
        read_only_fields = ['updated_at']


class ReturnRequestSerializer(serializers.ModelSerializer):
    order_item_id = serializers.PrimaryKeyRelatedField(
        source='order_item', queryset=OrderItem.objects.select_related('order', 'product', 'product_size').all(), write_only=True
    )
    order_id = serializers.IntegerField(source='order_item.order_id', read_only=True)
    product = ProductSerializer(source='order_item.product', read_only=True)
    product_size = ProductSizeSerializer(source='order_item.product_size', read_only=True)
    quantity = serializers.IntegerField(source='order_item.quantity', read_only=True)
    return_deadline = serializers.DateTimeField(source='order_item.order.return_deadline', read_only=True)

    class Meta:
        model = ReturnRequest
        fields = [
            'id', 'order_item_id', 'order_id', 'product', 'product_size', 'quantity',
            'reason', 'status', 'return_deadline', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

    def validate_order_item_id(self, order_item):
        request = self.context['request']
        if not request.user.is_staff and order_item.order.user_id != request.user.id:
            raise serializers.ValidationError('You can request a return only for your own order items.')
        if order_item.order.status in [Order.STATUS_CANCELLED, Order.STATUS_RETURNED]:
            raise serializers.ValidationError('This order cannot be returned.')
        if order_item.order.return_deadline and timezone.now() > order_item.order.return_deadline:
            raise serializers.ValidationError('The return period for this item has expired.')
        if hasattr(order_item, 'return_request'):
            raise serializers.ValidationError('A return request already exists for this order item.')
        return order_item


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']
        read_only_fields = fields


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        read_only_fields = ['id']

    def validate_username(self, value):
        return value.strip()

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )


class AdminRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']
        read_only_fields = ['id', 'is_staff']

    def validate_username(self, value):
        return value.strip()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        user.is_staff = True
        user.is_active = True
        user.save(update_fields=['is_staff', 'is_active'])
        return user


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    product = ProductSerializer(read_only=True, allow_null=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'product_id', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
