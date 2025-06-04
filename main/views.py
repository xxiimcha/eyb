from django.shortcuts import render

def login_view(request):
    return render(request, 'login.html')

def dashboard_view(request):
    return render(request, 'dashboard.html')

def configure_view(request):
    return render(request, 'configure.html')

def accounts_view(request):
    return render(request, 'accounts.html')

def add_account_view(request):
    # Fetch batches to pass to template if needed
    batches = [
        {"id": 1, "from_year": 2020, "to_year": 2024, "batch_type": "Regular"},
        {"id": 2, "from_year": 2021, "to_year": 2025, "batch_type": "Special"},
    ]
    return render(request, 'accounts/add_account.html', {'batches': batches})
