from django.urls import path
from .views import login_view, dashboard_view, configure_view, accounts_view, add_account_view

urlpatterns = [
    path('', login_view, name='login'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('configure/', configure_view, name='configure'),
    path('accounts/', accounts_view, name='account_list'),
    path('accounts/add/', add_account_view, name='add_account'),
]