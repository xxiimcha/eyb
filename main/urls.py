# main/urls.py
from django.urls import path
from .views import login_view

urlpatterns = [
    path('', login_view, name='login'),  # root path → login page
    path('login/', login_view),          # optional: also accessible via /login/
]
