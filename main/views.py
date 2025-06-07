from django.shortcuts import render
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
import csv, io
from .models import Graduate, Account, Batch
from Crypto.PublicKey import RSA
import qrcode
import base64
from io import BytesIO

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')  # Changed from 'email' to 'username'
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('dashboard')
        else:
            messages.error(request, 'Invalid username or password.')

    return render(request, 'login.html')

@login_required
def dashboard_view(request):
    return render(request, 'dashboard.html')

def configure_view(request):
    if request.method == 'POST':
        from_year = request.POST.get('from_year')
        to_year = request.POST.get('to_year')
        batch_type = request.POST.get('batch_type')
        if from_year and to_year and batch_type:
            Batch.objects.create(
                from_year=from_year,
                to_year=to_year,
                batch_type=batch_type
            )
            return redirect('configure')  # make sure this matches your URL name
    batches = Batch.objects.all()
    return render(request, 'configure.html', {'batches': batches})


def accounts_view(request):
    accounts = Account.objects.select_related('graduate').all()

    for account in accounts:
        qr = qrcode.make(account.public_key)  # or use any string like graduate full name
        buffer = BytesIO()
        qr.save(buffer, format="PNG")
        qr_base64 = base64.b64encode(buffer.getvalue()).decode()
        account.qr_image = f"data:image/png;base64,{qr_base64}"

    return render(request, 'accounts.html', {'accounts': accounts})

def import_accounts_view(request):
    if request.method == 'POST' and request.FILES.get('csv_file'):
        csv_file = request.FILES['csv_file']
        if not csv_file.name.endswith('.csv'):
            messages.error(request, 'Please upload a valid CSV file.')
            return redirect('accounts')

        data_set = csv_file.read().decode('UTF-8')
        io_string = io.StringIO(data_set)
        next(io_string)  # Skip header row

        for row in csv.reader(io_string, delimiter=','):
            try:
                first, middle, last, email, contact, address, course, ambition, batch_id = row
                batch = Batch.objects.get(id=batch_id)

                graduate = Graduate.objects.create(
                    first_name=first.strip(),
                    middle_name=middle.strip(),
                    last_name=last.strip(),
                    email=email.strip(),
                    contact=contact.strip(),
                    address=address.strip(),
                    course=course.strip(),
                    ambition=ambition.strip(),
                    batch=batch
                )

                key = RSA.generate(2048)
                private_key = key.export_key().decode()
                public_key = key.publickey().export_key().decode()

                Account.objects.create(
                    graduate=graduate,
                    public_key=public_key,
                    private_key=private_key
                )

            except Exception as e:
                messages.error(request, f"Error importing row: {row} – {e}")
                continue

        messages.success(request, "CSV file imported successfully.")
        return redirect('account_list')

def add_account_view(request):
    # Fetch batches to pass to template if needed
    batches = [
        {"id": 1, "from_year": 2020, "to_year": 2024, "batch_type": "Regular"},
        {"id": 2, "from_year": 2021, "to_year": 2025, "batch_type": "Special"},
    ]
    return render(request, 'accounts/add_account.html', {'batches': batches})
