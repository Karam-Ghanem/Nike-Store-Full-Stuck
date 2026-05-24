from datetime import timedelta
from decimal import Decimal
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    GENDER_MALE = 'male'
    GENDER_FEMALE = 'female'
    GENDER_UNISEX = 'unisex'
    GENDER_CHOICES = [
        (GENDER_MALE, 'Male'),
        (GENDER_FEMALE, 'Female'),
        (GENDER_UNISEX, 'Unisex'),
    ]

    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    old_product_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_discounted = models.BooleanField(default=False)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default=GENDER_UNISEX)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_archived = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    size = models.CharField(max_length=20)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('product', 'size')

    def __str__(self):
        return f'{self.product.name} - {self.size}'


# Coupon model removed — feature disabled


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='favorites', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'{self.user.username} favorites {self.product.name}'


class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='cart_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='cart_items', on_delete=models.CASCADE)
    product_size = models.ForeignKey(ProductSize, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product', 'product_size')

    def __str__(self):
        return f'{self.quantity} x {self.product.name} ({self.product_size.size})'


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('returned', 'Returned'),
    ]

    RETURN_PERIOD_DAYS = 7

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='orders', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    message = models.TextField(blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    # coupon field removed
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    return_requested = models.BooleanField(default=False)
    return_deadline = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Order {self.id} by {self.user.username}'

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.return_deadline is None:
            self.return_deadline = self.created_at + timedelta(days=self.RETURN_PERIOD_DAYS)
            super().save(update_fields=['return_deadline'])


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    product_size = models.ForeignKey(ProductSize, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.quantity} x {self.product.name} ({self.product_size.size})'


class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review {self.rating} by {self.user.username} for {self.product.name}'
