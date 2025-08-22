
# models.py
from django.db import models
from datetime import date
from django.utils.timezone import now# models.py
from django.db import models
from datetime import date
from django.utils.timezone import now

# Create your models here.
# menu/models.py

# Category model
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name  # This will return the category name in the admin interface

# MenuItem model
class MenuItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)  # ForeignKey to Category
    standard_quantity = models.FloatField(default=1)  # in grams

    def __str__(self):
        return self.name  # This will return the menu item name in the admin interface

class Ingredient(models.Model):
    name = models.CharField(max_length=200, unique=True)
    menu_item = models.ForeignKey(MenuItem, related_name='ingredients', on_delete=models.CASCADE)
    quantity = models.FloatField()  # in grams

    def __str__(self):
        return self.name

class NutritionalInfo(models.Model):
    ingredient = models.OneToOneField(Ingredient, on_delete=models.CASCADE, related_name='nutritional_info')
    calories = models.FloatField()  # per 100 g
    protein = models.FloatField()   # per 100 g
    fat = models.FloatField()   # per 100 g
    carbohydrates = models.FloatField()  # per 100 g
    sugar = models.FloatField()  # per 100 g
    calcium = models.FloatField()  # per 100 g
    iron = models.FloatField()  # per 100 g
    fiber = models.FloatField()  # per 100 g

    def __str__(self):
        return f"Nutritional Info for {self.ingredient.name}"

class Allergen(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='allergens')
    allergen = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.allergen

# Token model for tracking daily token numbers
class Token(models.Model):
    date = models.DateField(default=date.today, unique=True)
    current_token =  models.CharField(max_length=255, unique=True) 

    def __str__(self):
        return f"Token for {self.date}: {self.current_token}"

    @classmethod
    def get_next_token(cls):
        token, created = cls.objects.get_or_create(date=date.today(), defaults={'current_token': 1})
        if not created:
            token.current_token += 1
            token.save()
        return token.current_token

# Order model
class Order(models.Model):
    token = models.PositiveIntegerField(default=1)
    customer_name = models.CharField(max_length=255, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Order #{self.token} by {self.customer_name}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} (Order {self.order.token})"

# Cart model for temporary item storage before order placement
class Cart(models.Model):
    token = models.PositiveIntegerField(default=1)
    customer_name = models.CharField(max_length=255)

    def __str__(self):
        return f"Cart for {self.customer_name} (Token {self.token})"

# Cart Item model
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} in Cart (Token {self.cart.token})"

class StaffLogin(models.Model):
    staff_id = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.staff_id})"

# Daily Report model
class DailyReport(models.Model):
    date = models.DateField(default=date.today, unique=True)
    total_orders = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    orders = models.ManyToManyField(Order)  # ✅ Link orders to the report
    def __str__(self):
        return f"Daily Report for {self.date}"

# Create your models here.
# menu/models.py


# Category model
class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name  # This will return the category name in the admin interface

#MenuItem model
class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='menu_images/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE)  # ForeignKey to Category
    standard_quantity = models.FloatField(default=1)  # in grams

    def __str__(self):
        return self.name  # This will return the menu item name in the admin interface

class Ingredient(models.Model):
    name = models.CharField(max_length=200)
    menu_item = models.ForeignKey(MenuItem, related_name='ingredients', on_delete=models.CASCADE)
    quantity = models.FloatField()  # in grams

    def __str__(self):
        return self.name

class NutritionalInfo(models.Model):
    ingredient = models.OneToOneField(Ingredient, on_delete=models.CASCADE, related_name='nutritional_info')
    calories = models.FloatField()  # per 100 g
    protein = models.FloatField()   # per 100 g
    fat = models.FloatField()   # per 100 g
    carbohydrates = models.FloatField()  # per 100 g
    sugar = models.FloatField()  # per 100 g
    calcium = models.FloatField()  # per 100 g
    iron = models.FloatField()  # per 100 g
    fiber= models.FloatField()  # per 100 g

    def __str__(self):
        return f"Nutritional Info for {self.ingredient.name}"

class Allergen(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='allergens')
    allergen = models.CharField(max_length=255)

    def __str__(self):
        return self.allergen

# Token model for tracking daily token numbers
class Token(models.Model):
    date = models.DateField(default=date.today, unique=True)
    current_token =  models.CharField(max_length=255, unique=True) 

    def __str__(self):
        return f"Token for {self.date}: {self.current_token}"

    @classmethod
    def get_next_token(cls):
        token, created = cls.objects.get_or_create(date=date.today(), defaults={'current_token': 1})
        if not created:
            token.current_token += 1
            token.save()
        return token.current_token

# Order model
class Order(models.Model):
    STATUS_CHOICES = [
        ("", "No Status"),  # Default empty status
        ("progress", "Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    token = models.PositiveIntegerField(default=1)
    customer_name = models.CharField(max_length=255, null=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(default=now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="")
    started_cooking_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return f"Order #{self.token} by {self.customer_name}"
    
    
  # models.py

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} (Order {self.order.token})"
  

# Cart model for temporary item storage before order placement
class Cart(models.Model):
    # token = models.CharField(max_length=255)

    token = models.PositiveIntegerField(default=1)
    customer_name = models.CharField(max_length=255)

    def __str__(self):
        return f"Cart for {self.customer_name} (Token {self.token})"

# Cart Item model
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE, default=1)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, default=1)
    quantity = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name} in Cart (Token {self.cart.token})"

class StaffLogin(models.Model):
    staff_id = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.staff_id})"

# Daily Report model
class DailyReport(models.Model):
    date = models.DateField(default=date.today, unique=True)
    total_orders = models.PositiveIntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)


 
    # Fields for Monthly Reports
    is_monthly = models.BooleanField(default=False)  # To differentiate daily/monthly reports
    month = models.PositiveIntegerField(null=True, blank=True)  # Stores month for monthly reports
    year = models.PositiveIntegerField(null=True, blank=True)  # Stores year for monthly reports


    def __str__(self):
        if self.is_monthly:
            return f"Monthly Report: {self.month}/{self.year}"
        return f"Daily Report for {self.date}" 
