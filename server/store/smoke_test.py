import os
import sys
import django
import json
import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NikeStore.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from store.models import Category, Product, ProductSize, Coupon
from django.utils import timezone

client = Client()
user, created = User.objects.get_or_create(username='apitestuser', defaults={'email': 'apitest@example.com'})
if created:
    user.set_password('TestPass123')
    user.save()

token, _ = Token.objects.get_or_create(user=user)
cat = Category.objects.first() or Category.objects.create(name='Test Cat', description='Test category')
prod = Product.objects.first() or Product.objects.create(
    category=cat,
    name='Test Shoe',
    slug='test-shoe',
    description='Test product',
    price='99.99',
    is_active=True,
)
ps = ProductSize.objects.filter(product=prod).first() or ProductSize.objects.create(product=prod, size='42', stock=10)

today = timezone.now().date()
coupon, _ = Coupon.objects.get_or_create(
    code='TEST10',
    defaults={
        'discount_type': 'percent',
        'amount': '10.00',
        'min_order_total': '0.00',
        'active': True,
        'start_date': today - datetime.timedelta(days=1),
        'end_date': today + datetime.timedelta(days=1),
    },
)

print('token', token.key)

resp = client.post('/api/coupons/apply/', data=json.dumps({'code': 'TEST10', 'total': 99.99}), content_type='application/json')
print('coupon apply', resp.status_code, resp.content.decode('utf-8'))

client.defaults['HTTP_AUTHORIZATION'] = f'Token {token.key}'
order_payload = {
    'full_name': 'Test User',
    'email': 'apitest@example.com',
    'phone': '1234567890',
    'message': 'Test order',
    'latitude': '0.000000',
    'longitude': '0.000000',
    'items': [
        {'product_id': prod.id, 'product_size_id': ps.id, 'quantity': 1},
    ],
    'coupon_code': 'TEST10',
}
resp2 = client.post('/api/orders/', data=json.dumps(order_payload), content_type='application/json')
print('order create', resp2.status_code, resp2.content.decode('utf-8'))

resp3 = client.post('/api/auth/logout/', content_type='application/json')
print('logout', resp3.status_code, resp3.content.decode('utf-8'))
