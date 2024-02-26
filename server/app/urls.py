from django.urls import path, include
from rest_framework import routers
from app import views

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
]
