from django.core.management.base import BaseCommand
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMessage
from django.conf import settings

import qrcode
import base64
from io import BytesIO

from main.models import Graduate, Account

class Command(BaseCommand):
    help = 'Send monthly reminder emails to graduates who have not submitted the tracer form'

    def handle(self, *args, **kwargs):
        graduates = Graduate.objects.filter(tracer_forms__isnull=True)

        for graduate in graduates:
            try:
                account = Account.objects.get(graduate=graduate)
                url = f"https://eyb.onrender.com/gts/{graduate.id}"
                qr = qrcode.make(url)
                buffer = BytesIO()
                qr.save(buffer, format="PNG")
                buffer.seek(0)
                qr_base64 = base64.b64encode(buffer.read()).decode().strip()

                subject = 'Reminder: Complete Your Graduate Tracer Form'
                html_message = render_to_string('emails/account_credentials.html', {
                    'graduate': graduate,
                    'public_key': account.public_key,
                    'private_key': account.private_key,
                    'qr_code': qr_base64,
                    'access_url': url
                })
                plain_message = strip_tags(html_message)

                email = EmailMessage(
                    subject=subject,
                    body=html_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[graduate.email]
                )
                email.content_subtype = "html"
                email.send()

                self.stdout.write(self.style.SUCCESS(f"✅ Sent reminder to {graduate.email}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed for {graduate.email}: {str(e)}"))
