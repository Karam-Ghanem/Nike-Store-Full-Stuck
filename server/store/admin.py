from django.contrib import admin

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

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductSize)
admin.site.register(Coupon)
admin.site.register(ReturnPolicy)
admin.site.register(Favorite)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ReturnRequest)
admin.site.register(Review)
