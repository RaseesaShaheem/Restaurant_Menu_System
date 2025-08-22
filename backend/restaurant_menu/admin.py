from django.contrib import admin

# Register your models here.
# menu/admin.py
from .models import Category, MenuItem,Ingredient, NutritionalInfo, Allergen,Order, DailyReport

from .models import StaffLogin

# Register Category model
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [ 'id','name']  # Display the ID and name of the category in the admin list view


# Register MenuItem model
@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'image','standard_quantity']  # Display ID, name, category, price, and image in the admin
    list_filter = ['category']  # Adds filtering by category in the admin interface
    list_editable = ['standard_quantity'] # Enable inline editing
    search_fields = ['name', 'description']  # Adds a search bar for name and description
    ordering = ['category', 'name']  # Orders the items by category and name in the admin list view

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'menu_item', 'quantity')
    search_fields = ('name', 'menu_item__name')
    list_filter = ('menu_item',)


@admin.register(NutritionalInfo)
class NutritionalInfoAdmin(admin.ModelAdmin):
    list_display = ('ingredient', 'calories', 'protein', 'fat', 'carbohydrates', 'sugar', 'calcium', 'iron', 'fiber')
    search_fields = ('ingredient__name',)


@admin.register(Allergen)
class AllergenAdmin(admin.ModelAdmin):
    list_display = ('allergen', 'menu_item')
    search_fields = ('nallergen', 'menu_item__name')
    list_filter = ('menu_item',)
    

@admin.register(StaffLogin)
class StaffLoginAdmin(admin.ModelAdmin):
    list_display = ['staff_id', 'name']


    # ✅ Register Order model
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('token', 'customer_name', 'total_price', 'created_at')
    search_fields = ('customer_name', 'token')

# ✅ Register DailyReport model
@admin.register(DailyReport)
class DailyReportAdmin(admin.ModelAdmin):
    list_display = ('date', 'total_orders', 'total_revenue')
    list_filter = ('date',)

# ✅ Register MonthlyReport model
# @admin.register(MonthlyReport)
# class MonthlyReportAdmin(admin.ModelAdmin):
#     list_display = ('month', 'total_orders', 'total_revenue')
#     list_filter = ('month',)