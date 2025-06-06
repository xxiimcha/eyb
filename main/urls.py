from django.urls import path
from .views import (
    login_view, dashboard_view, configure_view,
    accounts_view, add_account_view, import_accounts_view, gts
)

urlpatterns = [
    path('', login_view, name='login'),
    path('gts/', gts, name='gts'),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('configure/', configure_view, name='configure'),

    path('accounts/', accounts_view, name='account_list'),
    path('accounts/import/', import_accounts_view, name='import_accounts'),
    path('accounts/add/', add_account_view, name='add_account'),
]