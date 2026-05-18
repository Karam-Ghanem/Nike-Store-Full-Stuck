from store.models import Category, Product, ProductSize


def create_sample_data():
    """إنشاء بيانات تجريبية للاختبار"""
    
    # إنشاء فئات
    cat_running = Category.objects.get_or_create(
        name='Running',
        defaults={'description': 'أحذية الركض والجري'}
    )[0]
    
    cat_casual = Category.objects.get_or_create(
        name='Casual',
        defaults={'description': 'أحذية كاجوال عادية'}
    )[0]
    
    cat_basketball = Category.objects.get_or_create(
        name='Basketball',
        defaults={'description': 'أحذية كرة السلة'}
    )[0]
    
    # إنشاء منتجات
    product1 = Product.objects.get_or_create(
        slug='nike-air-max',
        defaults={
            'name': 'Nike Air Max',
            'category': cat_running,
            'description': 'حذاء نايك كلاسيكي للركض براحة عالية',
            'price': 250.00,
            'is_active': True
        }
    )[0]
    
    product2 = Product.objects.get_or_create(
        slug='nike-revolution',
        defaults={
            'name': 'Nike Revolution',
            'category': cat_running,
            'description': 'حذاء نايك للركض السريع',
            'price': 180.00,
            'is_active': True
        }
    )[0]
    
    product3 = Product.objects.get_or_create(
        slug='nike-lbj-witness',
        defaults={
            'name': 'Nike LeBron Witness',
            'category': cat_basketball,
            'description': 'حذاء كرة سلة احترافي',
            'price': 380.00,
            'is_active': True
        }
    )[0]
    
    # إضافة أحجام ومخزون لكل منتج
    sizes = ['38', '39', '40', '41', '42', '43', '44', '45']
    
    for product in [product1, product2, product3]:
        for size in sizes:
            ProductSize.objects.get_or_create(
                product=product,
                size=size,
                defaults={'stock': 10}
            )
    
    print("✓ تم إنشاء الفئات والمنتجات والأحجام بنجاح!")
    print(f"✓ عدد المنتجات: {Product.objects.count()}")
    print(f"✓ عدد الأحجام الكلي: {ProductSize.objects.count()}")
