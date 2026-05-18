from django.core.management.base import BaseCommand
from store.sample_data import create_sample_data


class Command(BaseCommand):
    help = 'إنشاء بيانات تجريبية للاختبار'

    def handle(self, *args, **options):
        create_sample_data()
