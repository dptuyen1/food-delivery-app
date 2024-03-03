from django.urls import path, include
from rest_framework import routers
from app import views

router = routers.DefaultRouter()

router.register(prefix='users', viewset=views.UserViewSet, basename='users')
router.register(prefix='restaurants', viewset=views.RestaurantViewSet, basename='restaurants')
router.register(prefix='categories', viewset=views.CategoryViewSet, basename='categories')
router.register(prefix='products', viewset=views.ProductViewSet, basename='products')
router.register(prefix='payments', viewset=views.PaymentViewSet, basename='payments')
router.register(prefix='invoices', viewset=views.InvoiceViewSet, basename='invoices')
router.register(prefix='rating', viewset=views.RatingViewSet, basename='rating')
router.register(prefix='follows', viewset=views.FollowViewSet, basename='follows')

urlpatterns = [
    path('', include(router.urls)),
    path('pay/', views.pay, name='pay'),
    path('restaurant-stats/<int:restaurant_id>/', views.stats, name='restaurant-stats')
]
