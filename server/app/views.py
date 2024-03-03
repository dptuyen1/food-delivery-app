import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, generics, parsers, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from app import serializers, dao
from app.models import User, Restaurant, Category, Product, Payment, Invoice, Status, Details, Comment, Rating, Follow
from app.utils import momo_payment, send_mail
from app.permissions import IsRestaurantOwner


# Create your views here.
class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.AllowAny()]

    def get_permissions(self):
        if self.action.__eq__('is_follow'):
            return [permissions.IsAuthenticated()]

        return self.permission_classes

    @action(methods=['GET'], detail=False, url_path='current-user')
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @action(methods=['GET'], detail=False, url_path='is-follow')
    def is_follow(self, request):
        user = request.user
        restaurant_id = request.query_params.get('restaurant')
        restaurant = Restaurant.objects.get(pk=restaurant_id)
        is_follow = Follow.objects.filter(user=user, restaurant=restaurant, is_active=True).exists()

        return Response(is_follow, status.HTTP_200_OK)


class RestaurantViewSet(viewsets.ViewSet, generics.CreateAPIView,
                        generics.ListAPIView, generics.UpdateAPIView):
    # queryset = Restaurant.objects.filter(is_active=True).all()
    queryset = Restaurant.objects.all()
    serializer_class = serializers.RestaurantSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.AllowAny()]

    def get_permissions(self):
        if self.action.__eq__('create'):
            return [permissions.IsAuthenticated()]

        if self.action.__eq__('comments') and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]

        if self.action.__eq__('rating') and self.request.method == 'POST':
            return [permissions.IsAuthenticated()]

        if self.action.__eq__('partial_update'):
            return [permissions.IsAdminUser()]

        return self.permission_classes

    def get_queryset(self):
        query = self.queryset
        product_name = self.request.query_params.get('product_name')
        is_active = self.request.query_params.get('is_active')

        if product_name:
            query = query.filter(restaurant_products__name__icontains=product_name)
        if is_active:
            # query = Restaurant.objects.filter(is_active=is_active).all()
            query = query.filter(is_active=is_active).all()

        return query

    def create(self, request, *args, **kwargs):
        name = request.data.get('name')
        address = request.data.get('address')
        logo = request.data.get('logo')
        user = request.user

        restaurant, created = Restaurant.objects.get_or_create(
            user=user,
            defaults={
                'name': name,
                'address': address,
                'logo': logo,
            }
        )

        if not created:
            return Response({'message': 'User already has restaurant'}, status=status.HTTP_409_CONFLICT)

        return Response(serializers.RestaurantSerializer(restaurant).data, status=status.HTTP_201_CREATED)

    @action(methods=['GET', 'POST'], detail=True)
    def comments(self, request, *args, **kwargs):
        if request.method.__eq__('GET'):
            comments = Comment.objects.filter(restaurant=self.get_object()).all()

            return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)
        elif request.method.__eq__('POST'):
            content = request.data.get('content')
            comment = Comment.objects.create(content=content, user=request.user, restaurant=self.get_object())

            return Response(serializers.CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @action(methods=['GET', 'POST'], detail=True)
    def rating(self, request, *args, **kwargs):
        if request.method.__eq__('GET'):
            rating = Rating.objects.filter(
                restaurant=self.get_object(),
                user=request.user,
            ).first()

            return Response(serializers.RatingSerializer(rating).data, status=status.HTTP_200_OK)
        elif request.method.__eq__('POST'):
            rate = request.data.get('rate')
            rating, created = Rating.objects.update_or_create(
                restaurant=self.get_object(),
                user=request.user,
                defaults={'rate': rate}
            )

            return Response(serializers.RatingSerializer(rating).data, status=status.HTTP_201_CREATED)


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Category.objects.filter(is_active=True).all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.AllowAny()]

    def get_permissions(self):
        if self.action.__eq__('create'):
            return [IsRestaurantOwner()]

        return self.permission_classes

    def get_queryset(self):
        query = self.queryset

        restaurant_id = self.request.query_params.get('restaurant_id')
        if restaurant_id:
            query = query.filter(restaurant__pk=restaurant_id).all()

        return query


class ProductViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Product.objects.filter(is_active=True).all()
    serializer_class = serializers.ProductSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]
    permission_classes = [permissions.AllowAny()]

    def get_permissions(self):
        if self.action.__eq__('create'):
            return [IsRestaurantOwner()]

        return self.permission_classes

    def get_queryset(self):
        query = self.queryset

        category_id = self.request.query_params.get('category_id')
        if category_id:
            query = query.filter(category__pk=category_id).all()

        restaurant_id = self.request.query_params.get('restaurant_id')
        if restaurant_id:
            query = query.filter(restaurant__pk=restaurant_id).all()

        return query


class PaymentViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Payment.objects.all()
    serializer_class = serializers.PaymentSerializer
    permission_classes = [permissions.AllowAny]


class InvoiceViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView,
                     generics.UpdateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = serializers.InvoiceSerializer
    permission_classes = [permissions.AllowAny()]

    def get_permissions(self):
        if self.action.__eq__('create'):
            return [permissions.IsAuthenticated()]

        if self.action.__eq__('partial_update'):
            return [IsRestaurantOwner()]

        return self.permission_classes

    def get_queryset(self):
        query = self.queryset
        status_id = self.request.query_params.get('status_id')
        restaurant_id = self.request.query_params.get('restaurant_id')
        user_id = self.request.query_params.get('user_id')

        if status_id:
            query = query.filter(status__pk=status_id)

        if restaurant_id:
            query = query.filter(restaurant__pk=restaurant_id)

        if user_id:
            query = query.filter(user__pk=user_id)

        return query

    def create(self, request, *args, **kwargs):
        payment = Payment.objects.get(pk=request.data['payment'])
        s = Status.objects.get(pk=request.data['status'])
        restaurant = Restaurant.objects.get(pk=request.data['restaurant'])
        user = request.user
        total_price = request.data['total_price']
        delivery_price = request.data['delivery_price']
        total_quantity = request.data['total_quantity']
        invoice = Invoice.objects.create(total_price=total_price, delivery_price=delivery_price,
                                         total_quantity=total_quantity, restaurant=restaurant, user=user,
                                         payment=payment, status=s)

        details = request.data['details']

        for detail in details:
            Details.objects.create(invoice=invoice, **detail)

        return Response(serializers.InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)


@csrf_exempt
def pay(request):
    if request.method == 'POST':
        amount = request.POST.get('amount')
        response = momo_payment(amount)
        return HttpResponse(response)
    else:
        message = json.dumps({'message': 'Invalid method'})
        return HttpResponse(message, status=405)


@csrf_exempt
def stats(request, restaurant_id):
    response = dao.stats_revenue_by_restaurant(restaurant_id=restaurant_id)
    return JsonResponse(list(response), safe=False)


class RatingViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Rating.objects.all()
    serializer_class = serializers.RatingSerializer

    def get_queryset(self):
        query = self.queryset
        restaurant_id = self.request.query_params.get('restaurant_id')

        if restaurant_id:
            query = query.filter(restaurant__pk=restaurant_id)

        return query


class FollowViewSet(viewsets.ViewSet, generics.CreateAPIView):
    serializer_class = serializers.FollowSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        user = request.user
        restaurant = Restaurant.objects.get(pk=request.data['restaurant'])

        follow, created = Follow.objects.get_or_create(
            user=user,
            restaurant=restaurant
        )

        if not created:
            follow.is_active = not follow.is_active
            follow.save()

        return Response(serializers.FollowSerializer(follow).data, status=status.HTTP_201_CREATED)
