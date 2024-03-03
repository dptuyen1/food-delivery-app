from django.db.models import Count, Sum, F
from app.models import Restaurant, Product, Details


def count_sold_product_by_restaurant(month=None, year=None, quarter=None):
    # query = (Restaurant.objects.annotate(
    #     count=Count('restaurant_products__product_details__id', distinct=True))
    #          .values('count', 'name'))
    query = (Restaurant.objects.values('name')).annotate(
        count=Count('restaurant_products__product_details__id'))

    if month:
        query = query.filter(restaurant_invoices__created_at__month=month)

    if year:
        query = query.filter(restaurant_invoices__created_at__year=year)

    if quarter:
        query = query.filter(restaurant_invoices__created_at__quarter=quarter)

    return query


def stats_revenue_by_restaurant(restaurant_id, month=None, year=None, quarter=None):
    query = (Details.objects.values(name=F('product__name')).annotate(
        revenue=Sum(F('unit_price') * F('quantity')))).filter(invoice__restaurant_id=restaurant_id)

    return query
