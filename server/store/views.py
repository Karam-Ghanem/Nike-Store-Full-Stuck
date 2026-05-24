from django.contrib.auth.models import User
from django.db.models import F, Sum
from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from .models import Category, Product, Favorite, CartItem, Order, OrderItem, Review, Coupon
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    FavoriteSerializer,
    CartItemSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    ReviewSerializer,
    UserSerializer,
    RegisterSerializer,
)

from .serializers import CouponSerializer
from rest_framework.decorators import action
from rest_framework import status


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    السماح للجميع بقراءة البيانات
    فقط المسؤولون يمكنهم الكتابة والتعديل والحذف
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user or request.user.is_staff
        return obj.user == request.user or request.user.is_staff


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
        return queryset

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
        is_discounted = request.data.get('isDiscounted')
        old_price = request.data.get('oldProductPrice')
        if is_discounted is not None:
            if isinstance(is_discounted, str):
                is_discounted = is_discounted.lower() in ['true', '1', 'yes']
            else:
                is_discounted = bool(is_discounted)
            product.is_discounted = is_discounted
        if old_price is not None:
            try:
                product.old_product_price = old_price
            except Exception:
                return Response({'detail': 'Invalid oldProductPrice value.'}, status=status.HTTP_400_BAD_REQUEST)
        product.save(update_fields=['is_discounted', 'old_product_price'])
        return Response({'status': 'discount_updated', 'id': product.id})


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CouponViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def apply(self, request):
        code = request.data.get('code')
        total = request.data.get('total')
        if not code:
            return Response({'detail': 'code is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            coupon = Coupon.objects.get(code__iexact=code)
        except Coupon.DoesNotExist:
            return Response({'valid': False, 'detail': 'Invalid code'}, status=status.HTTP_200_OK)
        if not coupon.is_valid_for_total(float(total) if total else 0):
            return Response({'valid': False, 'detail': 'Coupon not valid for this total'}, status=status.HTTP_200_OK)
        discount = coupon.calculate_discount(float(total) if total else 0)
        return Response({'valid': True, 'discount': float(discount), 'code': coupon.code}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsOwnerOrReadOnly, permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Review.objects.all()
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class CustomObtainAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key, 'user_id': token.user_id, 'username': token.user.username})


class AdminDashboardView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        completed_orders = Order.objects.filter(status='completed').count()
        pending_orders = Order.objects.filter(status='pending').count()
        total_sales = OrderItem.objects.filter(order__status='completed').aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or 0
        active_products = Product.objects.filter(is_active=True, is_archived=False).count()
        archived_products = Product.objects.filter(is_archived=True).count()
        total_reviews = Review.objects.count()

        return Response({
            'total_orders': total_orders,
            'completed_orders': completed_orders,
            'pending_orders': pending_orders,
            'total_sales': float(total_sales),
            'active_products': active_products,
            'archived_products': archived_products,
            'total_reviews': total_reviews,
        })
