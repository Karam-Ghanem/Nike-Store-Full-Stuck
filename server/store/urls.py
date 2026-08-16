from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminDashboardView,
    AdminRegisterView,
    CartItemViewSet,
    CategoryViewSet,
    CouponViewSet,
    CurrentUserView,
    CustomObtainAuthToken,
    FavoriteViewSet,
    LogoutView,
    OrderViewSet,
    ProductViewSet,
    RegisterView,
    ReturnPolicyView,
    ReturnRequestViewSet,
    ReviewViewSet,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'cart', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'coupons', CouponViewSet, basename='coupon')
router.register(r'returns', ReturnRequestViewSet, basename='return-request')

urlpatterns = [
    path('', include(router.urls)),
    path('return-policy/', ReturnPolicyView.as_view(), name='return_policy'),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/admin-register/', AdminRegisterView.as_view(), name='admin_register'),
    path('auth/login/', CustomObtainAuthToken.as_view(), name='login'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
]
