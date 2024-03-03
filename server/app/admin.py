from django.contrib import admin
from django.template.response import TemplateResponse
from django.urls import path
from django.views import View

from app import dao
from app.models import Product, Category, Restaurant, Payment, Status, Role


# Register your models here.
class FoodDeliveryAppAdminSite(admin.AdminSite):
    def get_urls(self):
        return [
            path('stats/', self.StatsView.as_view())
        ] + super().get_urls()

    class StatsView(View):
        @staticmethod
        def get(request):
            return TemplateResponse(request, 'stats.html', {
                'stats': dao.count_sold_product_by_restaurant(),
                'months': range(1, 13),
                'quarters': range(1, 5)
            })

        @staticmethod
        def post(request):
            month = request.POST.get('month')
            year = request.POST.get('year')
            quarter = request.POST.get('quarter')
            return TemplateResponse(request, 'stats.html', {
                'stats': dao.count_sold_product_by_restaurant(month, year, quarter),
                'months': range(1, 13),
                'quarters': range(1, 5)
            })


admin_site = FoodDeliveryAppAdminSite(name='app')


class RoleAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active']
    search_fields = ['name']
    list_filter = ['id', 'name']


class RestaurantAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active', 'user']
    search_fields = ['name']
    list_filter = ['id', 'name']


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active', 'restaurant']
    search_fields = ['name']
    list_filter = ['id', 'name']


class ProductAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active', 'price', 'restaurant']
    search_fields = ['name']
    list_filter = ['id', 'name']


class PaymentAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active']
    search_fields = ['name']
    list_filter = ['id', 'name']


class StatusAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'is_active']
    search_fields = ['name']
    list_filter = ['id', 'name']


admin_site.register(Category, CategoryAdmin)
admin_site.register(Product, ProductAdmin)
admin_site.register(Restaurant, RestaurantAdmin)
admin_site.register(Payment, PaymentAdmin)
admin_site.register(Status, StatusAdmin)
admin_site.register(Role, RoleAdmin)
