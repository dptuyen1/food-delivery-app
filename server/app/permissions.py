from rest_framework import permissions

from app.models import Restaurant, User


class IsRestaurantOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method.__eq__('POST'):
            restaurant_id = request.data.get('restaurant')
            restaurant = Restaurant.objects.get(pk=restaurant_id)
            return bool(request.user and request.user.is_authenticated and (request.user.role.pk == 2 and
                                                                            request.user ==
                                                                            restaurant.user))

        return bool(request.user and request.user.is_authenticated and request.user.role.pk == 2)

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view) and request.user == obj.restaurant.user
