from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Batch

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
    return render(request, 'accounts.html')

def add_account_view(request):
    # Fetch batches to pass to template if needed
    batches = [
        {"id": 1, "from_year": 2020, "to_year": 2024, "batch_type": "Regular"},
        {"id": 2, "from_year": 2021, "to_year": 2025, "batch_type": "Special"},
    ]
    return render(request, 'accounts/add_account.html', {'batches': batches})
