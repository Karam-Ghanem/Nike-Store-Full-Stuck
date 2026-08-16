from decimal import Decimal

from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Coupon, Order, Product, ProductSize, ReturnPolicy, Review


class CommerceApiTests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(username='customer', password='customer-pass-123')
        self.admin = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='admin-pass-123'
        )
        self.category = Category.objects.create(name='Lifestyle')
        self.product = Product.objects.create(
            category=self.category,
            name='Nike Test Shoe',
            slug='nike-test-shoe',
            description='Test product',
            price=Decimal('100.00'),
            gender='unisex',
        )
        self.size = ProductSize.objects.create(product=self.product, size='42', stock=5)
        self.coupon = Coupon.objects.create(code='NIKE50', amount=Decimal('50.00'))

    def authenticate_customer(self):
        self.client.force_authenticate(user=self.customer)

    def test_coupon_validation_and_order_creation(self):
        self.authenticate_customer()
        validation = self.client.post(
            reverse('coupon-validate'),
            {'code': 'nike50', 'subtotal': '200.00'},
            format='json',
        )
        self.assertEqual(validation.status_code, status.HTTP_200_OK)
        self.assertTrue(validation.data['valid'])
        self.assertEqual(Decimal(validation.data['discount_amount']), Decimal('100.00'))

        order_response = self.client.post(
            reverse('order-list'),
            {
                'full_name': 'Nike Customer',
                'email': 'customer@example.com',
                'phone': '0912345678',
                'message': 'Leave at door',
                'coupon_code': 'NIKE50',
                'items': [
                    {
                        'product_id': self.product.id,
                        'product_size_id': self.size.id,
                        'quantity': 2,
                    }
                ],
            },
            format='json',
        )
        self.assertEqual(order_response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get()
        self.assertEqual(order.coupon, self.coupon)
        self.assertEqual(order.subtotal, Decimal('200.00'))
        self.assertEqual(order.discount_amount, Decimal('100.00'))
        self.assertEqual(order.total_amount, Decimal('100.00'))
        self.size.refresh_from_db()
        self.assertEqual(self.size.stock, 3)

    def test_return_policy_and_return_request(self):
        self.client.force_authenticate(user=self.admin)
        policy_response = self.client.patch(
            reverse('return_policy'),
            {'return_period_days': 14},
            format='json',
        )
        self.assertEqual(policy_response.status_code, status.HTTP_200_OK)
        self.assertEqual(ReturnPolicy.current().return_period_days, 14)

        self.client.force_authenticate(user=self.customer)
        order_response = self.client.post(
            reverse('order-list'),
            {
                'full_name': 'Nike Customer',
                'email': 'customer@example.com',
                'phone': '0912345678',
                'items': [
                    {
                        'product_id': self.product.id,
                        'product_size_id': self.size.id,
                        'quantity': 1,
                    }
                ],
            },
            format='json',
        )
        self.assertEqual(order_response.status_code, status.HTTP_201_CREATED)
        order_item_id = order_response.data['items'][0]['id']
        return_response = self.client.post(
            reverse('return-request-list'),
            {'order_item_id': order_item_id, 'reason': 'Size does not fit'},
            format='json',
        )
        self.assertEqual(return_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(return_response.data['status'], 'requested')

    def test_review_create_and_admin_delete(self):
        self.client.force_authenticate(user=self.customer)
        review_response = self.client.post(
            reverse('review-list'),
            {'rating': 5, 'comment': 'Excellent quality and fast delivery.'},
            format='json',
        )
        self.assertEqual(review_response.status_code, status.HTTP_201_CREATED)
        review = Review.objects.get()
        self.assertEqual(review.user, self.customer)
        self.client.force_authenticate(user=self.admin)
        delete_response = self.client.delete(reverse('review-detail', args=[review.id]))
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_product_creation_and_discount(self):
        self.client.force_authenticate(user=self.admin)
        create_response = self.client.post(
            reverse('product-list'),
            {
                'name': 'Admin Shoe',
                'description': 'Created from dashboard',
                'price': '80.00',
                'gender': 'female',
                'category_name': 'Running',
                'sizes_data': [{'size': '38', 'stock': 10}],
            },
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        product = Product.objects.get(name='Admin Shoe')
        discount_response = self.client.post(
            reverse('product-set-discount', args=[product.id]),
            {'discount_percent': 25},
            format='json',
        )
        self.assertEqual(discount_response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.price, Decimal('60.00'))
        self.assertTrue(product.is_discounted)

    def test_admin_created_product_is_public(self):
        self.client.force_authenticate(user=self.admin)
        create_response = self.client.post(
            reverse('product-list'),
            {
                'name': 'Public Admin Shoe',
                'description': 'Visible to shoppers',
                'price': '120.00',
                'gender': 'unisex',
                'category_name': 'Training',
                'is_active': False,
                'sizes_data': [{'size': '41', 'stock': 8}],
            },
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        created_id = create_response.data['id']
        created_product = Product.objects.get(id=created_id)
        self.assertTrue(created_product.is_active)
        self.assertFalse(created_product.is_archived)
        self.client.force_authenticate(user=None)
        public_response = self.client.get(reverse('product-list'))
        self.assertEqual(public_response.status_code, status.HTTP_200_OK)
        self.assertIn(created_id, [product['id'] for product in public_response.data])

    def test_admin_archive_bulk_discount_and_dashboard(self):
        self.client.force_authenticate(user=self.admin)
        archive_response = self.client.post(reverse('product-archive', args=[self.product.id]), {}, format='json')
        self.assertEqual(archive_response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertTrue(self.product.is_archived)
        unarchive_response = self.client.post(reverse('product-unarchive', args=[self.product.id]), {}, format='json')
        self.assertEqual(unarchive_response.status_code, status.HTTP_200_OK)
        bulk_response = self.client.post(
            reverse('product-bulk-discount'), {'type': 'unisex', 'discount_percent': 10}, format='json'
        )
        self.assertEqual(bulk_response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.price, Decimal('90.00'))
        dashboard_response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(dashboard_response.status_code, status.HTTP_200_OK)
        self.assertIn('total_users', dashboard_response.data)
        self.assertIn('active_products', dashboard_response.data)

    def test_admin_can_create_staff_account(self):
        self.client.force_authenticate(user=self.admin)
        create_response = self.client.post(
            reverse('admin_register'),
            {'username': 'secondadmin', 'email': 'secondadmin@example.com', 'password': 'admin-pass-456'},
            format='json',
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(create_response.data['is_staff'])
        second_admin = User.objects.get(username='secondadmin')
        self.assertTrue(second_admin.is_staff)
        self.assertFalse(second_admin.is_superuser)

        self.client.force_authenticate(user=self.customer)
        forbidden_response = self.client.post(
            reverse('admin_register'),
            {'username': 'blockedadmin', 'email': 'blocked@example.com', 'password': 'admin-pass-456'},
            format='json',
        )
        self.assertEqual(forbidden_response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=None)
        login_response = self.client.post(
            reverse('login'),
            {'username': 'secondadmin', 'password': 'admin-pass-456'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertTrue(login_response.data['is_staff'])

    def test_authentication_endpoints(self):
        register_response = self.client.post(
            reverse('register'),
            {'username': 'newcustomer', 'email': 'new@example.com', 'password': 'new-pass-123'},
            format='json',
        )
        self.assertEqual(register_response.status_code, status.HTTP_201_CREATED)
        login_response = self.client.post(
            reverse('login'),
            {'username': 'newcustomer', 'password': 'new-pass-123'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)
        self.assertFalse(login_response.data['is_staff'])
