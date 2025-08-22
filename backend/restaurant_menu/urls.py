from django.urls import path
from .views import MenuItemListView
from .views import MenuItemDetailView
from .views import (MenuItemAllergenView, IngredientDetailView, NutritionalInfoView, NutritionalInfoDetailView)
from .views import OrderStatusUpdateView
from .views import StaffLoginView
from .views import (TokenView, AddToCartView,  ViewCartView, PlaceOrderView,  ViewOrdersToday,
 GenerateReportView, MenuItemDeleteView
   
)
from .views import category_list
from .views import MenuItemCreateView
from .views import IngredientView


urlpatterns = [
    path('menu-items/', MenuItemListView.as_view(), name='menu-items'),
    path('menu-items/<int:id>/', MenuItemDetailView.as_view(), name='menu-items'),
    path('menu-items/create', MenuItemCreateView.as_view(), name='menu-item-create'),
    path('menu-items/<int:id>/allergens/', MenuItemAllergenView.as_view(), name='menu-item-detail'),
    path('ingredients/', IngredientView.as_view(), name='ingredients'),
    path("ingredients/<int:id>/", IngredientDetailView.as_view(), name="ingredient-detail"),

    path("ingredients/<int:id>/nutritional-info/", NutritionalInfoView.as_view(), name="nutritional-info-list-create"),
    path("nutritional-info/<int:id>/", NutritionalInfoDetailView.as_view(), name="nutritional-info-detail"),
    path("categories/",category_list , name="category-list"),

    path('staff-login/', StaffLoginView.as_view(), name='staff_login'),
    path('token/generate/', TokenView.as_view(), name='generate_token'),
    
 # Cart Endpoints
    path('cart/', AddToCartView.as_view(), name='cart'),  # General cart operations (add)
    path('cart/view/<int:token>/', ViewCartView.as_view(), name='view_cart'),

    path('menu-items/delete/', MenuItemDeleteView.as_view(), name='menu-items-delete'),


    path('order/place/<int:token>/', PlaceOrderView.as_view(), name='place_order'),
    path('orders/today/', ViewOrdersToday.as_view(), name='view_orders_today'),
    path('report/generate/', GenerateReportView.as_view(), name='generate_report'),
    path('orders/<int:token>/status/', OrderStatusUpdateView.as_view(), name='order-status-update'),

   
   
]