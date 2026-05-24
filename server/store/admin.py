from django.contrib import admin
from .models import Category, Product, ProductSize, Favorite, CartItem, Order, OrderItem, Review


admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductSize)
admin.site.register(Favorite)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Review)
