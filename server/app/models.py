from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from app.utils import send_mail


# Create your models here.
class BaseModel(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Role(BaseModel):
    pass


class User(AbstractUser):
    phone_number_regex = RegexValidator(regex=r'^(0[0-9]{9,10})$',
                                        message='Please enter correct format phone number, ex: 0987654321')
    phone_number = models.CharField(max_length=11, validators=[phone_number_regex])
    address = models.CharField(max_length=255)
    avatar = CloudinaryField('avatar', folder='food-delivery-app/user',
                             null=False)
    role = models.ForeignKey(to=Role, on_delete=models.CASCADE,
                             related_name='role_users')
    restaurants = models.ManyToManyField(to='Restaurant', related_name='users',
                                         through='Follow', symmetrical=False)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'

    def save(self, *args, **kwargs):
        role_admin, created = Role.objects.get_or_create(name='ROLE_ADMIN')

        if self.is_superuser:
            self.role = role_admin
            self.first_name = 'admin'

        return super(User, self).save(args, **kwargs)


class Restaurant(BaseModel):
    is_active = models.BooleanField(default=False)
    address = models.CharField(max_length=255)
    logo = CloudinaryField('logo', folder='food-delivery-app/restaurant',
                           null=False)
    user = models.OneToOneField(to=User, on_delete=models.CASCADE, unique=True)


class Follow(models.Model):
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE,
                             related_name='user_follows')
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE,
                                   related_name='restaurant_follows')


class Category(BaseModel):
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE)


class Product(BaseModel):
    price = models.FloatField()
    image = CloudinaryField('image', folder='food-delivery-app/product',
                            null=False)
    category = models.ForeignKey(to=Category, on_delete=models.CASCADE,
                                 related_name='category_products')
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE,
                                   related_name='restaurant_products')

    def save(self, *args, **kwargs):
        self.is_active = True
        return super(Product, self).save(*args, **kwargs)


@receiver(post_save, sender=Product)
def send_mail_post_save(sender, instance, created, **kwargs):
    if created:
        restaurant = instance.restaurant
        followers = restaurant.users.all()

        if followers:
            for follower in followers:
                send_mail(restaurant.name, instance.name, follower.email)


class Payment(BaseModel):
    pass


class Status(BaseModel):
    pass


class Invoice(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.FloatField()
    delivery_price = models.FloatField()
    total_quantity = models.IntegerField()
    payment = models.ForeignKey(to=Payment, on_delete=models.CASCADE,
                                related_name='payment_invoices')
    status = models.ForeignKey(to=Status, on_delete=models.CASCADE,
                               related_name='status_invoices')
    user = models.ForeignKey(to=User, on_delete=models.CASCADE,
                             related_name='user_invoices')
    restaurant = models.ForeignKey(to=Restaurant, on_delete=models.CASCADE,
                                   related_name='restaurant_invoices')

    def __str__(self):
        return self.id


class Details(models.Model):
    unit_price = models.FloatField()
    quantity = models.IntegerField()
    invoice = models.ForeignKey(to=Invoice, on_delete=models.CASCADE,
                                related_name='invoice_details')
    product = models.ForeignKey(to=Product, on_delete=models.CASCADE,
                                related_name='product_details')

    def __str__(self):
        return self.id


class Interaction(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)

    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255, null=False)


class Rating(Interaction):
    rate = models.PositiveSmallIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
