from django.contrib.auth.models import User
from rest_framework import serializers
from .models import (
    Category,
    Product,
    ProductSize,
    Favorite,
    CartItem,
    Order,
    OrderItem,
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
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source='category', queryset=Category.objects.all(), write_only=True
    )
    isDiscounted = serializers.BooleanField(source='is_discounted')
    oldProductPrice = serializers.DecimalField(
        source='old_product_price', max_digits=10, decimal_places=2, allow_null=True, required=False
    )
    isArchived = serializers.BooleanField(source='is_archived')

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'oldProductPrice', 'isDiscounted',
            'gender', 'image', 'is_active', 'isArchived', 'category', 'category_id', 'sizes'
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = Favorite
        fields = ['id', 'product', 'product_id', 'created_at']


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


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_size = ProductSizeSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_size', 'quantity', 'price']


class OrderItemCreateSerializer(serializers.ModelSerializer):
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True
    )
    product_size_id = serializers.PrimaryKeyRelatedField(
        source='product_size', queryset=ProductSize.objects.all(), write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['product_id', 'product_size_id', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'full_name', 'email', 'phone', 'message', 'latitude', 'longitude',
            'status', 'created_at', 'updated_at', 'return_requested', 'return_deadline',
            'items', 'total_price',
        ]

    def get_total_price(self, obj):
        return float(sum(item.price * item.quantity for item in obj.items.all()))


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'full_name', 'email', 'phone', 'message', 'latitude', 'longitude',
            'items',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        user = validated_data.pop('user', self.context['request'].user)
        order = Order.objects.create(**validated_data, user=user)
        for item_data in items_data:
            product = item_data['product']
            product_size = item_data['product_size']
            quantity = item_data['quantity']
            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                product_size=product_size,
                quantity=quantity,
                price=product.price,
            )
            product_size.stock = max(product_size.stock - quantity, 0)
            product_size.save()
        return order


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        source='product', queryset=Product.objects.all(), write_only=True
    )

    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'product_id', 'rating', 'comment', 'created_at']

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value
