import os
import sys
import django
import json
import datetime
import traceback

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NikeStore.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from store.models import Category, Product, ProductSize
from django.utils import timezone

client = Client()

try:
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

    print('token', token.key)

    def dump_response(name, response):
        print('---', name, '---')
        print('status:', response.status_code)
        print('content:', response.content.decode('utf-8', errors='replace'))
        print('json:', end=' ')
        try:
            print(response.json())
        except Exception as exc:
            print('not-json:', exc)
        print('headers:', dict(response.headers))

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
    }
    resp2 = client.post('/api/orders/', data=json.dumps(order_payload), content_type='application/json')
    dump_response('order create', resp2)

    resp3 = client.post('/api/auth/logout/', content_type='application/json')
    dump_response('logout', resp3)
except Exception:
    traceback.print_exc()
