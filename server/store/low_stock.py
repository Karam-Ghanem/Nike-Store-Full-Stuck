import json
import logging
from datetime import datetime, timezone

from django.conf import settings
from threading import Thread
from urllib.error import URLError
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)

LOW_STOCK_THRESHOLD = settings.LOW_STOCK_THRESHOLD
LOW_STOCK_WEBHOOK_URL = settings.LOW_STOCK_WEBHOOK_URL.strip()


def _post_low_stock_webhook(payload):
    if not LOW_STOCK_WEBHOOK_URL:
        logger.info('Low-stock webhook is not configured; skipping notification.')
        return

    request = Request(
        LOW_STOCK_WEBHOOK_URL,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'NikeStore-LowStockNotifier/1.0',
        },
        method='POST',
    )

    try:
        with urlopen(request, timeout=5) as response:
            if response.status < 200 or response.status >= 300:
                logger.warning(
                    'Low-stock webhook returned unexpected status %s.',
                    response.status,
                )
    except (OSError, URLError) as exc:
        logger.warning('Low-stock webhook request failed: %s', exc)


def notify_low_stock(product_size, previous_stock):
    """Notify n8n only when stock crosses from above the threshold to it or below it."""
    current_stock = product_size.stock
    if previous_stock <= LOW_STOCK_THRESHOLD or current_stock > LOW_STOCK_THRESHOLD:
        return

    product = product_size.product
    payload = {
        'event': 'low_stock',
        'threshold': LOW_STOCK_THRESHOLD,
        'stock': current_stock,
        'previous_stock': previous_stock,
        'product': {
            'id': product.id,
            'name': product.name,
            'slug': product.slug,
        },
        'size': {
            'id': product_size.id,
            'name': product_size.size,
        },
        'sent_at': datetime.now(timezone.utc).isoformat(),
    }

    # Do not delay checkout while n8n processes the notification.
    Thread(
        target=_post_low_stock_webhook,
        args=(payload,),
        daemon=True,
    ).start()
