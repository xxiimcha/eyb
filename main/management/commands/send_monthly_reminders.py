from django.core.management.base import BaseCommand
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

import qrcode
from io import BytesIO
from email.mime.image import MIMEImage

from main.models import Graduate, Account

class Command(BaseCommand):
    help = 'Send monthly emails to all registered graduates'

    def handle(self, *args, **kwargs):
        graduates = Graduate.objects.exclude(email__isnull=True).exclude(email='')

        for graduate in graduates:
            try:
                account = Account.objects.get(graduate=graduate)
                url = f"https://alumnitrack.onrender.com/gts/{graduate.id}"

                # Generate QR code image bytes
                qr = qrcode.make(url)
                buffer = BytesIO()
                qr.save(buffer, format="PNG")
                buffer.seek(0)
                qr_image_data = buffer.read()

                # Render HTML email with CID placeholder for QR
                html_message = render_to_string('emails/account_credentials.html', {
                    'graduate': graduate,
                    'public_key': account.public_key,
                    'private_key': account.private_key,
                    'qr_code_cid': 'qrimage',  # matches the CID tag in the HTML
                    'access_url': url
                })
                plain_message = strip_tags(html_message)

                # Build the email
                email = EmailMultiAlternatives(
                    subject='Reminder: Complete Your Graduate Tracer Form',
                    body=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[graduate.email]
                )
                email.attach_alternative(html_message, "text/html")

                # Attach the QR image as inline content
                qr_image = MIMEImage(qr_image_data)
                qr_image.add_header('Content-ID', '<qrimage>')
                qr_image.add_header('Content-Disposition', 'inline', filename='qrimage.png')
                email.attach(qr_image)

                # Send email
                email.send()
                self.stdout.write(self.style.SUCCESS(f"✅ Sent reminder to {graduate.email}"))

            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Failed for {graduate.email}: {str(e)}"))
