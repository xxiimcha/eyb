from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import (
    login_view, dashboard_view, configure_view,
    accounts_view, add_account_view, import_accounts_view, 
    gts, register_form, alumni_tracker_view, view_tracer_form, 
    user_management_view, student_login_view, student_profile_page, 
    analytics_view, update_account, edit_batch, delete_batch, delete_account_view, 
    print_yearbook_view, send_reminder_email, upload_photo_view)
from django.shortcuts import render
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('', login_view, name='login'),

    path('student-login/', student_login_view, name='student_login'),

    path('profile/', student_profile_page, name='student_profile'),
    path('print-yearbook/', print_yearbook_view, name='print_yearbook'),
    path('gts/<int:graduate_id>/', gts, name='gts'),
    path('register/<int:graduate_id>/', register_form, name='register_form'),
    path('thank-you/', lambda request: render(request, 'thank_you.html'), name='thank_you'),

    
    path('account/update/', update_account, name='update_account'),

    path('dashboard/', dashboard_view, name='dashboard'),
    path('configure/', configure_view, name='configure'),

    path('batch/edit/<int:id>/', edit_batch, name='edit_batch'),
    path('batch/delete/<int:id>/', delete_batch, name='delete_batch'),

    path('accounts/', accounts_view, name='account_list'),
    path('accounts/import/', import_accounts_view, name='import_accounts'),
    path('accounts/add/', add_account_view, name='add_account'),
    path('accounts/delete/<int:id>/', delete_account_view, name='delete_account'),
    path('accounts/photo/<int:graduate_id>/', upload_photo_view, name='upload_photo'),

    path('send-reminder/<int:graduate_id>/', send_reminder_email, name='send_reminder_email'),

    path('alumni-tracker/', alumni_tracker_view, name='alumni_tracker'),
    path('tracer/<int:graduate_id>/', view_tracer_form, name='view_tracer_form'),
    
    path('analytics/', analytics_view, name='analytics'),
    
    path('user-management/', user_management_view, name='user_management'),

    
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)