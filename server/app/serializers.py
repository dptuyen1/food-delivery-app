from rest_framework import serializers

from app import constants
from app.models import Restaurant, User, Category, Product, Payment, Status, Invoice, Details, Comment, Rating, Follow


class RestaurantSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    @staticmethod
    def get_image(restaurant):
        if restaurant.logo:
            return f'https://res.cloudinary.com/{constants.CLOUD_NAME}/{restaurant.logo}'

    class Meta:
        model = Restaurant
        exclude = ['user']


class UserSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    restaurant = RestaurantSerializer(many=False, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'password', 'avatar', 'image', 'address', 'email',
                  'role',
                  'phone_number', 'restaurant']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    @staticmethod
    def get_image(user):
        if user.avatar:
            return f'https://res.cloudinary.com/{constants.CLOUD_NAME}/{user.avatar}'

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data['password'])
        user.save()

        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()

    @staticmethod
    def get_img(product):
        if product.image:
            return f'https://res.cloudinary.com/{constants.CLOUD_NAME}/{product.image}'

    class Meta:
        model = Product
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'
