# توثيق الباك إند الكامل - متجر Nike

## جدول المحتويات
1. [البيئة والتثبيت](#البيئة-والتثبيت)
2. [هيكل المشروع](#هيكل-المشروع)
3. [النماذج (Models)](#النماذج-models)
4. [المسلسلات (Serializers)](#المسلسلات-serializers)
5. [العروض (Views & ViewSets)](#العروض-views--viewsets)
6. [المسارات (URLs)](#المسارات-urls)
7. [الإعدادات (Settings)](#الإعدادات-settings)
8. [نقاط النهاية (Endpoints)](#نقاط-النهاية-endpoints)
9. [الأخطاء والحلول](#الأخطاء-والحلول)
10. [خطوات التشغيل](#خطوات-التشغيل)

---

## البيئة والتثبيت

### المتطلبات
```
Python 3.10+
Django 6.0.5
Django REST Framework 3.14.0
django-cors-headers 4.9.0
python-decouple (اختياري للمتغيرات البيئية)
```

### خطوات التثبيت

#### 1. إنشاء البيئة الافتراضية
```bash
# على Windows
python -m venv .venv
.venv\Scripts\activate

# على macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

#### 2. تثبيت المكتبات
```bash
pip install django==6.0.5
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.9.0
pip install pillow  # لمعالجة الصور
```

#### 3. إنشاء ملف المتطلبات
```bash
pip freeze > requirements.txt
```

#### 4. تنفيذ الترحيلات
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 5. إنشاء مستخدم إداري
```bash
python manage.py createsuperuser
```

---

## هيكل المشروع

```
Nike-Store-Full-Stuck/server/
├── NikeStore/                    # مجلد المشروع الرئيسي
│   ├── __init__.py
│   ├── settings.py               # إعدادات Django
│   ├── urls.py                   # المسارات الرئيسية
│   ├── asgi.py                   # معالج ASGI
│   └── wsgi.py                   # معالج WSGI
├── store/                        # تطبيق المتجر
│   ├── migrations/               # ملفات الترحيلات
│   ├── admin.py                  # لوحة الإدارة
│   ├── models.py                 # النماذج
│   ├── serializers.py            # المسلسلات
│   ├── views.py                  # العروض والـ ViewSets
│   ├── urls.py                   # مسارات المتجر
│   ├── permissions.py            # الصلاحيات المخصصة
│   └── smoke_test.py             # اختبار دخاني
├── db.sqlite3                    # قاعدة البيانات
├── manage.py                     # أداة إدارة Django
└── requirements.txt              # المكتبات المثبتة
```

---

## النماذج (Models)

### 1. نموذج الفئة (Category)
```python
class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name
```
**الشرح:**
- `name`: اسم الفئة مثل "Running" أو "Basketball"
- `description`: وصف الفئة اختياري
- `__str__`: يظهر اسم الفئة عند عرض الكائن

---

### 2. نموذج المنتج (Product)
```python
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
```

**الشرح التفصيلي:**
- `category` (FK): ربط مع الفئة، إذا حُذفت الفئة تُحذف المنتجات المرتبطة
- `name`: اسم المنتج
- `slug`: نسخة صديقة للـ URL من الاسم مثل "nike-air-max"
- `price`: السعر الحالي
- `old_product_price`: السعر القديم قبل الخصم (للعرض)
- `is_discounted`: هل المنتج على خصم
- `gender`: موجه للذكور أم الإناث أم للكل
- `image`: صورة المنتج
- `is_active`: هل المنتج نشط (يعرض في المتجر)
- `is_archived`: هل المنتج مؤرشف (مخفي دون حذف)
- `created_at`: تاريخ الإنشاء (تلقائي)
- `updated_at`: تاريخ آخر تحديث (تلقائي)

---

### 3. نموذج حجم المنتج (ProductSize)
```python
class ProductSize(models.Model):
    product = models.ForeignKey(Product, related_name='sizes', on_delete=models.CASCADE)
    size = models.CharField(max_length=20)
    stock = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ('product', 'size')

    def __str__(self):
        return f'{self.product.name} - {self.size}'
```

**الشرح:**
- `product` (FK): ربط مع المنتج
- `size`: حجم الحذاء (38، 39، 40... إلخ)
- `stock`: عدد القطع المتاحة
- `unique_together`: يضمن عدم تكرار نفس الحجم لنفس المنتج

---

### 4. نموذج الكوبون (Coupon)
```python
class Coupon(models.Model):
    DISCOUNT_TYPE_PERCENT = 'percent'
    DISCOUNT_TYPE_FIXED = 'fixed'
    DISCOUNT_TYPE_CHOICES = [
        (DISCOUNT_TYPE_PERCENT, 'Percentage'),
        (DISCOUNT_TYPE_FIXED, 'Fixed amount'),
    ]

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def is_valid_for_total(self, total):
        if not self.active:
            return False
        today = timezone.now().date()
        if self.start_date and today < self.start_date:
            return False
        if self.end_date and today > self.end_date:
            return False
        return total >= self.min_order_total

    def calculate_discount(self, total):
        if self.discount_type == self.DISCOUNT_TYPE_PERCENT:
            return min(total, (total * self.amount) / 100)
        return min(total, self.amount)
```

**الشرح:**
- `code`: كود الكوبون (مثل "SUMMER20")
- `discount_type`: نوع الخصم (نسبة مئوية أو مبلغ ثابت)
- `amount`: قيمة الخصم
- `min_order_total`: أقل مبلغ للطلب لتطبيق الكوبون
- `is_valid_for_total()`: دالة تتحقق من صلاحية الكوبون
- `calculate_discount()`: دالة تحسب قيمة الخصم

---

### 5. نموذج المفضلات (Favorite)
```python
class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='favorites', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f'{self.user.username} favorites {self.product.name}'
```

**الشرح:**
- يسمح لكل مستخدم بإضافة منتج واحد مرة واحدة فقط إلى قائمة المفضلات

---

### 6. نموذج عنصر السلة (CartItem)
```python
class CartItem(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='cart_items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='cart_items', on_delete=models.CASCADE)
    product_size = models.ForeignKey(ProductSize, related_name='cart_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product', 'product_size')
```

**الشرح:**
- تمثل عنصر واحد في سلة التسوق
- الـ `unique_together` يمنع إضافة نفس المنتج بنفس الحجم مرتين

---

### 7. نموذج الطلب (Order)
```python
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
    coupon = models.ForeignKey(Coupon, null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    return_requested = models.BooleanField(default=False)
    return_deadline = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new and self.return_deadline is None:
            self.return_deadline = self.created_at + timedelta(days=self.RETURN_PERIOD_DAYS)
            super().save(update_fields=['return_deadline'])
```

**الشرح:**
- `user`: صاحب الطلب
- `full_name`, `email`, `phone`: معلومات التسليم
- `latitude`, `longitude`: إحداثيات الموقع
- `coupon`: الكوبون المطبق (اختياري)
- `status`: حالة الطلب
- `return_deadline`: آخر موعد لإرجاع الطلب (7 أيام من الإنشاء)
- `save()`: دالة مخصصة تحسب `return_deadline` تلقائياً عند إنشاء الطلب

---

### 8. نموذج عنصر الطلب (OrderItem)
```python
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.CASCADE)
    product_size = models.ForeignKey(ProductSize, related_name='order_items', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.quantity} x {self.product.name} ({self.product_size.size})'
```

**الشرح:**
- تمثل عنصر واحد في الطلب (منتج معين بحجم معين وكمية معينة)

---

### 9. نموذج المراجعة (Review)
```python
class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review {self.rating} by {self.user.username} for {self.product.name}'
```

**الشرح:**
- تمثل تقييم وتعليق من مستخدم حول منتج معين

---

## المسلسلات (Serializers)

المسلسلات تحول نماذج Django إلى JSON والعكس. تُستخدم لتحقق البيانات وتحويلها.

### 1. ProductSizeSerializer
```python
class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'stock']
```
**الشرح:** يعرض معرف الحجم والحجم وعدد القطع المتاحة.

---

### 2. CategorySerializer
```python
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']
```

---

### 3. ProductSerializer (مهم جداً)
```python
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
```

**الشرح التفصيلي:**
- `sizes`: عرض جميع الأحجام المتاحة للمنتج (read_only)
- `category`: عرض تفاصيل الفئة (read_only)
- `category_id`: إدخال معرف الفئة عند الإنشاء/التعديل (write_only)
- `isDiscounted`: تحويل `is_discounted` إلى camelCase للـ API
- `oldProductPrice`: تحويل `old_product_price` إلى camelCase
- `isArchived`: تحويل `is_archived` إلى camelCase
- **الفائدة:** تسهيل التعامل مع الـ Frontend في React الذي يستخدم camelCase

---

### 4. OrderSerializer & OrderCreateSerializer
```python
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
        subtotal = sum(item.price * item.quantity for item in obj.items.all())
        if obj.coupon:
            try:
                discount = obj.coupon.calculate_discount(subtotal)
            except Exception:
                discount = 0
            return float(subtotal - discount)
        return float(subtotal)
```

**الشرح:**
- `get_total_price()`: دالة مخصصة تحسب السعر الكلي مع الخصم

---

### 5. OrderCreateSerializer (الأهم!)
```python
class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    coupon_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = [
            'full_name', 'email', 'phone', 'message', 'latitude', 'longitude',
            'items', 'coupon_code',
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon_code = validated_data.pop('coupon_code', None)

        # حساب الإجمالي الفرعي للتحقق من صلاحية الكوبون
        subtotal = 0
        for item in items_data:
            product = item['product']
            subtotal += float(product.price) * int(item['quantity'])

        coupon = None
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code__iexact=coupon_code, active=True)
                if not coupon.is_valid_for_total(subtotal):
                    coupon = None
            except Exception:
                coupon = None

        # الإصلاح الهام: تجنب تكرار حقل user
        user = validated_data.pop('user', self.context['request'].user)
        order = Order.objects.create(**validated_data, user=user, coupon=coupon)
        
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
            # تقليل المخزون
            product_size.stock = max(product_size.stock - quantity, 0)
            product_size.save()
        return order
```

**الشرح التفصيلي:**
- يتقبل بيانات الطلب الجديد
- يتحقق من صلاحية الكوبون
- **الإصلاح المهم:** `user = validated_data.pop('user', ...)` يمنع خطأ "multiple values for keyword argument 'user'"
- ينشئ عناصر الطلب وينقص المخزون

---

## العروض (Views & ViewSets)

### 1. Permissions المخصصة
```python
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user and request.user.is_staff

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.user == request.user or request.user.is_staff
        return obj.user == request.user or request.user.is_staff
```

**الشرح:**
- `IsAdminOrReadOnly`: الجميع يستطيعون القراءة، فقط المسؤولون يستطيعون الكتابة
- `IsOwnerOrReadOnly`: يمكن قراءة الكائن من قبل الجميع، لكن تعديله فقط المالك أو المسؤول

---

### 2. ProductViewSet (مهم جداً)
```python
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
```

**الشرح التفصيلي:**
- `get_queryset()`: المستخدمون العاديون يرون فقط المنتجات النشطة وغير المؤرشفة
- `archive()`: إجراء إداري لأرشفة المنتج
- `unarchive()`: إجراء إداري لإلغاء أرشفة المنتج
- `set_discount()`: إجراء إداري لتعديل الخصم

---

### 3. AdminDashboardView (لوحة الإدارة)
```python
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
```

**الشرح:**
- تعيد إحصائيات المبيعات والطلبات والمنتجات
- مخصصة للمسؤولين فقط

---

### 4. OrderViewSet
```python
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
```

**الشرح:**
- يستخدم `OrderCreateSerializer` عند الإنشاء
- يستخدم `OrderSerializer` عند الاسترجاع
- المستخدم العادي يرى فقط طلباته، المسؤول يرى الكل

---

### 5. LogoutView
```python
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
```

**الشرح:**
- حذف رمز المستخدم (Token) لتسجيل الخروج

---

## المسارات (URLs)

### store/urls.py
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    ProductViewSet,
    FavoriteViewSet,
    CartItemViewSet,
    OrderViewSet,
    ReviewViewSet,
    RegisterView,
    CurrentUserView,
    CustomObtainAuthToken,
    CouponViewSet,
    LogoutView,
    AdminDashboardView,
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'cart', CartItemViewSet, basename='cartitem')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'coupons', CouponViewSet, basename='coupon')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomObtainAuthToken.as_view(), name='login'),
    path('auth/user/', CurrentUserView.as_view(), name='current_user'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
]
```

---

### NikeStore/urls.py
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
]
```

---

## الإعدادات (Settings)

### NikeStore/settings.py
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # للـ CORS
    'rest_framework',
    'rest_framework.authtoken',
    'store',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # يجب أن يكون أول middleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',  # React frontend
]
```

**الشرح:**
- `corsheaders`: يسمح بطلبات من المتصفح من أصول مختلفة
- `TokenAuthentication`: المستخدمون يستخدمون tokens للمصادقة

---

## نقاط النهاية (Endpoints)

### المنتجات
```
GET    /api/products/                    # الحصول على جميع المنتجات
POST   /api/products/                    # إنشاء منتج (admin فقط)
GET    /api/products/{id}/               # الحصول على منتج محدد
PUT    /api/products/{id}/               # تعديل منتج (admin فقط)
DELETE /api/products/{id}/               # حذف منتج (admin فقط)
POST   /api/products/{id}/archive/       # أرشفة منتج (admin فقط)
POST   /api/products/{id}/unarchive/     # إلغاء أرشفة منتج (admin فقط)
POST   /api/products/{id}/set_discount/  # تعديل الخصم (admin فقط)
```

**مثال: الحصول على المنتجات مع الفلترة**
```
GET /api/products/?category=1&search=nike
```

---

### الطلبات
```
GET    /api/orders/                  # الحصول على طلباتي (user) أو الكل (admin)
POST   /api/orders/                  # إنشاء طلب جديد
GET    /api/orders/{id}/             # الحصول على تفاصيل الطلب
PUT    /api/orders/{id}/             # تعديل الطلب (owner أو admin)
DELETE /api/orders/{id}/             # حذف الطلب
```

**مثال: إنشاء طلب جديد**
```json
POST /api/orders/
{
  "full_name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "phone": "1234567890",
  "message": "Please deliver ASAP",
  "latitude": "30.0444",
  "longitude": "31.2357",
  "items": [
    {
      "product_id": 1,
      "product_size_id": 5,
      "quantity": 2
    }
  ],
  "coupon_code": "SUMMER20"
}
```

---

### المصادقة
```
POST   /api/auth/register/    # التسجيل
POST   /api/auth/login/       # تسجيل الدخول (يعيد token)
GET    /api/auth/user/        # الحصول على بيانات المستخدم الحالي
POST   /api/auth/logout/      # تسجيل الخروج
```

**مثال: تسجيل دخول**
```json
POST /api/auth/login/
{
  "username": "ahmed",
  "password": "password123"
}

الرد:
{
  "token": "abc123xyz789",
  "user_id": 1,
  "username": "ahmed"
}
```

**مثال: استخدام Token في الطلبات**
```
GET /api/auth/user/
Headers:
  Authorization: Token abc123xyz789
```

---

### لوحة الإدارة
```
GET /api/admin/dashboard/   # الحصول على إحصائيات (admin فقط)
```

**الرد:**
```json
{
  "total_orders": 15,
  "completed_orders": 10,
  "pending_orders": 5,
  "total_sales": 5000.50,
  "active_products": 25,
  "archived_products": 3,
  "total_reviews": 42
}
```

---

### المفضلات والسلة والمراجعات
```
GET    /api/favorites/              # المفضلات
POST   /api/favorites/              # إضافة إلى المفضلات
DELETE /api/favorites/{id}/         # حذف من المفضلات

GET    /api/cart/                   # السلة
POST   /api/cart/                   # إضافة إلى السلة
PUT    /api/cart/{id}/              # تعديل عنصر السلة
DELETE /api/cart/{id}/              # حذف من السلة

GET    /api/reviews/                # جميع المراجعات
POST   /api/reviews/                # إضافة مراجعة
GET    /api/reviews/{id}/           # تفاصيل المراجعة
```

---

## الأخطاء والحلول

### 1. خطأ: "multiple values for keyword argument 'user'"
**السبب:** محاولة إرسال `user` مرتين عند إنشاء الطلب.

**الحل:**
```python
# قبل الإصلاح
order = Order.objects.create(**validated_data, user=self.context['request'].user, coupon=coupon)

# بعد الإصلاح
user = validated_data.pop('user', self.context['request'].user)
order = Order.objects.create(**validated_data, user=user, coupon=coupon)
```

---

### 2. خطأ: "Invalid HTTP_HOST header: 'testserver'"
**السبب:** Django test client يستخدم `testserver` لكن `ALLOWED_HOSTS` فارغة.

**الحل:**
```python
# في settings.py
ALLOWED_HOSTS = ['localhost', 'testserver']
```

---

### 3. خطأ: "Decimal arithmetic bug"
**السبب:** خلط بين `Decimal` و `float` في الحسابات.

**الحل:**
```python
# استخدام Decimal دائماً
from decimal import Decimal
discount = Decimal('10.00')
```

---

### 4. خطأ: CORS Access-Control-Allow-Origin
**السبب:** عدم تثبيت `django-cors-headers` أو عدم تكوينه.

**الحل:**
```bash
pip install django-cors-headers
```

```python
# في settings.py
INSTALLED_APPS = ['corsheaders', ...]
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOWED_ORIGINS = ['http://localhost:5173']
```

---

## خطوات التشغيل

### 1. التثبيت
```bash
# تفعيل البيئة
.venv\Scripts\activate

# تثبيت المكتبات
pip install -r requirements.txt
```

### 2. الترحيلات
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. إنشاء مستخدم إداري
```bash
python manage.py createsuperuser
```

### 4. تشغيل السيرفر
```bash
python manage.py runserver 8000
```

### 5. تشغيل الاختبارات
```bash
python store\smoke_test.py
```

### 6. الوصول إلى الـ API
```
http://localhost:8000/api/
```

### 7. الوصول إلى لوحة الإدارة
```
http://localhost:8000/admin/
```

---

## الملفات الرئيسية والدور

| الملف | الدور |
|------|------|
| `store/models.py` | تعريف نماذج قاعدة البيانات |
| `store/serializers.py` | تحويل النماذج إلى JSON والتحقق من البيانات |
| `store/views.py` | معالجة الطلبات وإرجاع الاستجابات |
| `store/urls.py` | تعريف مسارات API |
| `NikeStore/settings.py` | إعدادات المشروع |
| `NikeStore/urls.py` | المسارات الرئيسية |
| `manage.py` | أداة إدارة Django |

---

## الخلاصة

هذا الباك إند يوفر:
- ✅ API كاملة لمتجر أحذية Nike
- ✅ مصادقة عبر Tokens
- ✅ إدارة المنتجات والكوبونات والطلبات
- ✅ نظام المفضلات والسلة والمراجعات
- ✅ صلاحيات متقدمة (admin, user, owner)
- ✅ CORS مفعّل للـ React frontend
- ✅ إحصائيات وتقارير للإدارة
- ✅ معالجة الأخطاء الشاملة

**جاهز للاستخدام والتطوير!**


---

## تنبيه انخفاض المخزون عبر n8n

تمت إضافة خدمة `store/low_stock.py` لإرسال طلب `POST` إلى Webhook الخاص بـ n8n عندما تنخفض كمية مقاس المنتج من قيمة أعلى من العتبة إلى العتبة أو أقل. العتبة الافتراضية هي 5، ويمكن تغييرها من خلال متغير البيئة `LOW_STOCK_THRESHOLD`.

يُحفظ رابط Webhook في ملف البيئة المحلي ولا يوضع في الكود مباشرة. انسخ الملف النموذجي:

```bash
cd server
cp .env.example .env
```

الرابط الذي زوّدني به المستخدم مهيأ افتراضياً داخل `settings.py` حتى يعمل التكامل مباشرة بعد Pull. ومع ذلك، يمكن تجاوزه من خلال `server/.env`، ولا ترفع هذا الملف إلى GitHub لأن رابط Webhook قد يسمح بتشغيل Workflow مباشرة:

```env
LOW_STOCK_WEBHOOK_URL=https://syruanaaiteam09.app.n8n.cloud/webhook/nike-low-stock-alert
LOW_STOCK_THRESHOLD=5
```

يتم استدعاء الخدمة بعد خصم المخزون في `OrderCreateSerializer.create()` داخل `store/serializers.py`. أُخّر الاستدعاء إلى ما بعد نجاح المعاملة باستخدام `transaction.on_commit`، حتى لا يصل إشعار إلى n8n إذا فشل إنشاء الطلب أو تراجعت المعاملة. كما يُرسل الطلب في Thread منفصل حتى لا ينتظر العميل تنفيذ Workflow n8n أثناء Checkout.

مثال على JSON المرسل إلى n8n:

```json
{
  "event": "low_stock",
  "threshold": 5,
  "stock": 5,
  "previous_stock": 6,
  "product": {
    "id": 12,
    "name": "Nike Air Max",
    "slug": "nike-air-max-a1b2c3d4"
  },
  "size": {
    "id": 31,
    "name": "42"
  },
  "sent_at": "2026-08-22T12:00:00+00:00"
}
```

يتم إرسال تنبيه عند العبور إلى 5 أو أقل، وليس مع كل طلب لاحق تكون فيه الكمية أصلاً أقل أو مساوية لـ5. فإذا انتقلت الكمية من 6 إلى 5 يصل إشعار، أما الانتقال من 5 إلى 4 فلا يعاد إرسال إشعار لنفس حالة الانخفاض. ويمكن تعديل هذه السياسة لاحقاً إذا كان Workflow يحتاج تنبيهاً عند كل انخفاض.

الملفات المتعلقة بهذه الإضافة هي:

```text
server/store/low_stock.py       # خدمة بناء وإرسال الإشعار
server/store/serializers.py     # نقطة استدعاء الخدمة بعد خصم المخزون
server/NikeStore/settings.py    # قراءة متغيرات البيئة
server/.env.example             # نموذج الإعداد المحلي
server/requirements.txt         # إضافة python-dotenv
```
