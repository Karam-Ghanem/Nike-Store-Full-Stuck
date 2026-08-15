from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.db.models import F, Sum
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    CartItem,
    Category,
    Coupon,
    Favorite,
    Order,
    OrderItem,
    Product,
    ReturnPolicy,
    ReturnRequest,
    Review,
)
from .serializers import (
    CartItemSerializer,
    CategorySerializer,
    CouponSerializer,
    CouponValidationSerializer,
    FavoriteSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    ReturnPolicySerializer,
    ReturnRequestSerializer,
    ReviewSerializer,
    UserSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user and (obj.user == request.user or request.user.is_staff))


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            queryset = Product.objects.all()
        else:
            queryset = Product.objects.filter(is_active=True, is_archived=False)
        category_id = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset.select_related('category').prefetch_related('sizes')

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def archive(self, request, pk=None):
        product = self.get_object()
        product.is_archived = True
        product.save(update_fields=['is_archived'])
        return Response({'status': 'archived', 'id': product.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def unarchive(self, request, pk=None):
        product = self.get_object()
        product.is_archived = False
        product.save(update_fields=['is_archived'])
        return Response({'status': 'unarchived', 'id': product.id})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def set_discount(self, request, pk=None):
        product = self.get_object()
        percent = request.data.get('discount_percent')
        is_discounted = request.data.get('isDiscounted')
        old_price = request.data.get('oldProductPrice')
        new_price = request.data.get('price')
        update_fields = ['is_discounted']
        if percent is not None:
            try:
                percent = Decimal(str(percent))
                if percent <= 0 or percent > 100:
                    raise InvalidOperation
            except (InvalidOperation, ValueError):
                return Response({'detail': 'discount_percent must be between 0 and 100.'}, status=status.HTTP_400_BAD_REQUEST)
            product.old_product_price = product.price
            product.price = (product.price * (Decimal('100') - percent) / Decimal('100')).quantize(Decimal('0.01'))
            product.is_discounted = True
            update_fields += ['old_product_price', 'price']
        else:
            if is_discounted is not None:
                product.is_discounted = str(is_discounted).lower() in ['true', '1', 'yes'] if isinstance(is_discounted, str) else bool(is_discounted)
            if old_price is not None:
                product.old_product_price = old_price
                update_fields.append('old_product_price')
            if new_price is not None:
                product.price = new_price
                update_fields.append('price')
        product.save(update_fields=list(dict.fromkeys(update_fields)))
        return Response({'status': 'discount_updated', 'id': product.id, 'price': product.price})

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def bulk_discount(self, request):
        selected_type = str(request.data.get('type', '')).strip()
        try:
            percent = Decimal(str(request.data.get('discount_percent')))
            if percent <= 0 or percent > 100:
                raise InvalidOperation
        except (InvalidOperation, TypeError, ValueError):
            return Response({'detail': 'discount_percent must be between 0 and 100.'}, status=status.HTTP_400_BAD_REQUEST)
        queryset = Product.objects.filter(is_archived=False)
        if selected_type and selected_type.lower() in {'men', 'male', 'women', 'wommen', 'female', 'kids', 'unisex'}:
            gender = {'men': 'male', 'women': 'female', 'wommen': 'female', 'kids': 'unisex'}.get(selected_type.lower(), selected_type.lower())
            queryset = queryset.filter(gender=gender)
        elif selected_type:
            queryset = queryset.filter(category__name=selected_type)
        count = queryset.update(
            is_discounted=True,
            old_product_price=F('price'),
            price=F('price') * (Decimal('100') - percent) / Decimal('100'),
        )
        return Response({'status': 'discount_updated', 'count': count})


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related('product__category').prefetch_related('product__sizes')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user).select_related(
            'product__category', 'product_size'
        ).prefetch_related('product__sizes')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        if self.request.user.is_staff:
            queryset = Order.objects.all()
        else:
            queryset = Order.objects.filter(user=self.request.user)
        return queryset.select_related('coupon').prefetch_related('items__product__category', 'items__product__sizes', 'items__product_size')

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(user=request.user)
        output = OrderSerializer(order, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_201_CREATED)


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.IsAdminUser]

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def validate(self, request):
        serializer = CouponValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code']
        subtotal = serializer.validated_data['subtotal']
        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response(
                {'valid': False, 'detail': 'This coupon code is invalid.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        if not coupon.is_valid_for(subtotal):
            return Response(
                {'valid': False, 'detail': 'This coupon is inactive, expired, or not applicable to this order.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        discount_amount = coupon.calculate_discount(subtotal)
        return Response({
            'valid': True,
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'amount': coupon.amount,
            'discount_amount': discount_amount,
            'subtotal': subtotal,
            'total_amount': subtotal - discount_amount,
        })


class ReturnPolicyView(APIView):
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get(self, request):
        return Response(ReturnPolicySerializer(ReturnPolicy.current()).data)

    def patch(self, request):
        serializer = ReturnPolicySerializer(ReturnPolicy.current(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ReturnRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        if self.request.user.is_staff:
            queryset = ReturnRequest.objects.all()
        else:
            queryset = ReturnRequest.objects.filter(user=self.request.user)
        return queryset.select_related(
            'order_item__order', 'order_item__product__category', 'order_item__product_size', 'user'
        ).prefetch_related('order_item__product__sizes')

    def perform_create(self, serializer):
        return_request = serializer.save(user=self.request.user)
        Order.objects.filter(pk=return_request.order_item.order_id).update(return_requested=True)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    @transaction.atomic
    def approve(self, request, pk=None):
        return_request = self.get_object()
        if return_request.status == ReturnRequest.STATUS_APPROVED:
            return Response({'detail': 'This return request is already approved.'}, status=status.HTTP_400_BAD_REQUEST)
        if return_request.status == ReturnRequest.STATUS_REJECTED:
            return Response({'detail': 'A rejected return request cannot be approved.'}, status=status.HTTP_400_BAD_REQUEST)

        order_item = return_request.order_item
        type(order_item.product_size).objects.filter(pk=order_item.product_size_id).update(stock=F('stock') + order_item.quantity)
        return_request.status = ReturnRequest.STATUS_APPROVED
        return_request.save(update_fields=['status', 'updated_at'])

        order = order_item.order
        if not order.items.exclude(return_request__status=ReturnRequest.STATUS_APPROVED).exists():
            order.status = Order.STATUS_RETURNED
            order.save(update_fields=['status', 'updated_at'])
        return Response(ReturnRequestSerializer(return_request, context={'request': request}).data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        return_request = self.get_object()
        if return_request.status != ReturnRequest.STATUS_REQUESTED:
            return Response({'detail': 'Only requested returns can be rejected.'}, status=status.HTTP_400_BAD_REQUEST)
        return_request.status = ReturnRequest.STATUS_REJECTED
        return_request.save(update_fields=['status', 'updated_at'])
        return Response(ReturnRequestSerializer(return_request, context={'request': request}).data)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly, permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset.select_related('user', 'product__category').prefetch_related('product__sizes')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'username': token.user.username,
            'email': token.user.email,
            'is_staff': token.user.is_staff,
        })


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        completed_orders = Order.objects.filter(status=Order.STATUS_COMPLETED).count()
        pending_orders = Order.objects.filter(status=Order.STATUS_PENDING).count()
        total_sales = Order.objects.filter(status=Order.STATUS_COMPLETED).aggregate(total=Sum('total_amount'))['total'] or 0
        active_products = Product.objects.filter(is_active=True, is_archived=False).count()
        archived_products = Product.objects.filter(is_archived=True).count()
        total_reviews = Review.objects.count()
        total_users = User.objects.count()
        total_favorites = Favorite.objects.count()
        return Response({
            'total_orders': total_orders,
            'completed_orders': completed_orders,
            'pending_orders': pending_orders,
            'total_sales': float(total_sales),
            'active_products': active_products,
            'archived_products': archived_products,
            'total_reviews': total_reviews,
            'total_users': total_users,
            'total_favorites': total_favorites,
        })
