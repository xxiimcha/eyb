from django.urls import path
from .views import (
    login_view, dashboard_view, configure_view,
    accounts_view, add_account_view, import_accounts_view, gts, register_form, alumni_tracker_view, view_tracer_form, user_management_view
)
from django.shortcuts import render
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', login_view, name='login'),

    path('gts/<int:graduate_id>/', gts, name='gts'),
    path('register/<int:graduate_id>/', register_form, name='register_form'),
    path('thank-you/', lambda request: render(request, 'thank_you.html'), name='thank_you'),

    path('dashboard/', dashboard_view, name='dashboard'),
    path('configure/', configure_view, name='configure'),

    path('accounts/', accounts_view, name='account_list'),
    path('accounts/import/', import_accounts_view, name='import_accounts'),
    path('accounts/add/', add_account_view, name='add_account'),

    
    path('alumni-tracker/', alumni_tracker_view, name='alumni_tracker'),
    path('tracer/<int:graduate_id>/', view_tracer_form, name='view_tracer_form'),

    
    path('user-management/', user_management_view, name='user_management'),

    
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
]