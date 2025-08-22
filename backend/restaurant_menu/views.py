   #from django.shortcuts import render

# # Create your views here.

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils.timezone import now
from .models import (
     MenuItem, Ingredient,NutritionalInfo,StaffLogin,Allergen,Category,
     Cart, CartItem, Order, Token, DailyReport, OrderItem,
)
from django.views.decorators.csrf import csrf_exempt
import json

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .serializers import (
     MenuItemSerializer,IngredientSerializer, NutritionalInfoSerializer, AllergenSerializer, CategorySerializer
)
from rest_framework.permissions import AllowAny
from django.db import transaction

from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from django.http import QueryDict
from django.db.models import Sum
from datetime import date
from django.db.utils import OperationalError, DatabaseError
import calendar
from rest_framework.exceptions import NotFound   
import logging
import random
from datetime import timedelta,datetime
from django.utils.timezone import make_aware

#  View to get all menu items
class MenuItemListView(generics.ListCreateAPIView):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


 #  View to get/update/delete a menu item
class MenuItemDetailView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def get(self, request, id):
        menu_item = get_object_or_404(MenuItem, id=id)
        serializer = MenuItemSerializer(menu_item)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, id):
        menu_item = get_object_or_404(MenuItem, id=id)
        serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  


class MenuItemCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            with transaction.atomic():
                data = request.data.copy()

                # Parse JSON strings into Python objects
                # ingredients_data = json.loads(data.get("ingredients", "[]"))
                # allergens_data = json.loads(data.get("allergens", "[]"))
                ingredients_data = data.get("ingredients", [])
                allergens_data = data.get("allergens", [])

            if isinstance(ingredients_data, str):  
                ingredients_data = json.loads(ingredients_data)  # Ensure JSON is properly parsed

            if isinstance(allergens_data, str):  
                    allergens_data = json.loads(allergens_data)    
                
                    serializer = MenuItemSerializer(data=data)
            if serializer.is_valid():
                    menu_item = serializer.save()  # Save menu item first

                    # Create Ingredients and Nutritional Info
                    for ingredient in ingredients_data:
                        nutritional_info = ingredient.pop('nutritional_info', {})
                        ingredient_obj = Ingredient.objects.create(menu_item=menu_item, **ingredient)
                    # if nutritional_info:
                        NutritionalInfo.objects.create(ingredient=ingredient_obj, **nutritional_info)

                    # Create allergens
                    for allergen_name in allergens_data:
                        Allergen.objects.create(menu_item=menu_item, allergen=allergen_name)

                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)




class MenuItemAllergenView(APIView):
    def get(self, request, id):
        try:
            # Fetch the menu item
            menu_item = MenuItem.objects.get(id=id)
            # Fetch allergens associated with the menu item
            allergen = Allergen.objects.filter(menu_item=menu_item)
            # Serialize the allergens
            serializer = AllergenSerializer(allergen, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, id):
        try:
            # Fetch the menu item
            menu_item = MenuItem.objects.get(id=id)
            
            # Extract allergens from request data
            allergens = request.data.get('allergens', [])
            print("Received allergens:", allergens)  # Debugging
            # Validate input
            if not isinstance(allergens, list) or not all(isinstance(a, str) for a in allergens):
                return Response({'error': 'Invalid allergen data'}, status=status.HTTP_400_BAD_REQUEST)

            # Create Allergen entries
            created_allergens = []
            for allergen in allergens:
                allergen, created = Allergen.objects.get_or_create(menu_item=menu_item, allergen=allergen)
                created_allergens.append(allergen)

            # Serialize and return response
            serializer = AllergenSerializer(created_allergens, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except MenuItem.DoesNotExist:
            return Response({'error': 'Menu item not found'}, status=status.HTTP_404_NOT_FOUND)




# ✅ View to update/delete a specific ingredient
class IngredientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    lookup_field = "id"
class IngredientView(APIView):
    def get(self, request):
        ingredients = Ingredient.objects.all()
        serializer = IngredientSerializer(ingredients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        # Handle both single ingredient and list of ingredients
        ingredients_data = request.data if isinstance(request.data, list) else [request.data]
        
        created_ingredients = []
        errors = []
        
        for ingredient_data in ingredients_data:
            try:
                # Extract nutritional info if present
                nutritional_info_data = ingredient_data.pop('nutritional_info', None)
                
                # Validate and create ingredient
                serializer = IngredientSerializer(data=ingredient_data)
                if serializer.is_valid():
                    ingredient = serializer.save()
                    print(f" Created Ingredient ID: {ingredient.id}")  # DEBUGGING LINE
                                        # If nutritional info is provided, validate and save it
                    if nutritional_info_data:
                        nutritional_info_data['ingredient'] = ingredient.id
                        nutritional_serializer = NutritionalInfoSerializer(data=nutritional_info_data)

                        if nutritional_serializer.is_valid():
                            nutritional_serializer.save()
                        else:
                            errors.append({
                                'ingredient': ingredient_data,
                                'nutritional_info_errors': nutritional_serializer.errors
                            })
                            continue  # Skip this ingredient if nutritional info has errors

                    created_ingredients.append(serializer.data)
                    
                else:
                    errors.append({'ingredient': ingredient_data, 'errors': serializer.errors})

            except Exception as e:
                errors.append({'ingredient': ingredient_data, 'error': str(e)})

        if errors:
            return Response(
                {'created_ingredients': created_ingredients, 'errors': errors},
                status=status.HTTP_207_MULTI_STATUS
            )

        return Response(created_ingredients, status=status.HTTP_201_CREATED)

    

class NutritionalInfoView(generics.ListCreateAPIView):
    serializer_class = NutritionalInfoSerializer

    def get_queryset(self):
        """
        Ensure that only nutritional info related to a specific ingredient is returned.
        """
        ingredient_id = self.kwargs.get("id")
        return NutritionalInfo.objects.filter(ingredient_id=ingredient_id)
    def create(self, request, *args, **kwargs):
        """
        Fixes "QueryDict instance is immutable" by making a mutable copy of request data.
        Ensures ingredient exists before adding nutritional info.
         Prevents duplicate nutritional info for the same ingredient.
        """
        ingredient_id = self.kwargs.get("id")  #  Get ingredient ID from URL

        # Check if the ingredient exists
        try:
            ingredient = Ingredient.objects.get(id=ingredient_id)
        except Ingredient.DoesNotExist:
            return Response({"error": "Ingredient not found"}, status=status.HTTP_404_NOT_FOUND)

        # Convert request.data to a mutable dictionary
        if isinstance(request.data, QueryDict):  
            data = request.data.copy()  #  Make a mutable copy
        else:
            data = request.data  #  Already mutable if it's a normal dictionary

        data["ingredient"] = ingredient_id  #  Add ingredient ID

        serializer = NutritionalInfoSerializer(data=data)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    

#  View to update/delete a specific nutritional info entry
class NutritionalInfoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NutritionalInfo.objects.all()
    serializer_class = NutritionalInfoSerializer
    lookup_field = "id"

@api_view(['GET', 'POST'])
def category_list(request):
    if request.method == 'GET':
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 

class StaffLoginView(APIView):
    def post(self, request):
        staff_id = request.data.get('staff_id')
        name = request.data.get('name')

        try:
            staff = StaffLogin.objects.get(staff_id=staff_id, name=name)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        except StaffLogin.DoesNotExist:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
class TokenView(APIView):
    def get(self, request):
        # Generate a random token (for example)
        token = random.randint(1000,9999)
        Cart.objects.create(token=token, customer_name="")  # or provide a real customer name if available
        return Response({"token": token}, status=status.HTTP_200_OK)
    
    
class AddToCartView(APIView):
    def get(self, request):
        # This is a simple GET method response.
        return Response({"message": "GET request received. Use POST to add items to the cart."}, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            data = request.data  # DRF automatically parses JSON
            print("Received data:", data)  #
            token =data.get('token') # Use token from request if provided
            customer_name = data.get('customer_name')
            menu_item_id = data.get('menu_item_id')
            quantity = data.get('quantity', 1)

           
            if not token or not menu_item_id:
                return Response({"error": "Missing required fields: customer_name, menu_item_id."}, status=status.HTTP_400_BAD_REQUEST)
            
              # Get or create a cart for the given token
            cart, created = Cart.objects.get_or_create(token=token, defaults={'customer_name': customer_name})


            # Fetch the menu item
            menu_item = MenuItem.objects.get(id=menu_item_id)


            # Calculate the total price
            total_price = menu_item.price * quantity

            # Add item to the cart
            # CartItem.objects.create(
            cart_item, item_created = CartItem.objects.get_or_create(
                cart=cart,
                menu_item=menu_item,
                defaults={'quantity': quantity, 'price_per_unit': menu_item.price, 'total_price': total_price}
            )

            if not item_created:
                # If item exists, update quantity and total price
                cart_item.quantity += quantity
                cart_item.total_price = cart_item.quantity * menu_item.price
                cart_item.save()

            

            return Response({"message": "Item added to cart",
                             "cart_created": created,
                             "token": token  # Return the token so frontend can store it
                              }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": f"An error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






class ViewCartView(APIView):
    def get(self, request, token):
        try:
            # Fetch the cart using the provided token
            cart =Cart.objects.get(token=token)
        except Cart.DoesNotExist:
              # Instead of raising a 404, return an empty cart response
            return Response({"cart": []}, status=200)
        
        items = CartItem.objects.filter(cart=cart)
        cart_data = [
            {
                "name": item.menu_item.name,
                "quantity": item.quantity,
                "total_price": item.total_price
            }
            for item in items
        ]

        return Response({"cart": cart_data}, status=200)
        
class PlaceOrderView(APIView):
    def get(self, request, token):
        """
        GET method for testing endpoint availability.
        """
        return Response(
            {"message": f"GET request received for token: {token}"},
            status=status.HTTP_200_OK
        )
    """
    Handles order placement when 'Place Order' is clicked in the frontend.
    Generates a new token, saves order details, and clears the cart.
    """
    def post(self, request, token):
        try:
           
            try:
                token = int(token)
            except ValueError:
                raise NotFound(detail="Invalid token format. Must be a number.")
            try:
                cart = Cart.objects.get(token=token)
            except Cart.DoesNotExist:
                # logger.error(f"No Cart found for token: {token}")
                raise NotFound(detail="Cart not found for the provided token.")
            
            cart_items = CartItem.objects.filter(cart=cart)

            if not cart_items.exists():
                return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

                 # ✅ Retrieve customer_name from request if available
            customer_name = request.data.get("customer_name", "").strip()

            # ✅ If customer_name is empty, use cart's stored name
            if not customer_name:
                return Response({"error": "Customer name is required"}, status=status.HTTP_400_BAD_REQUEST)


            print(f"Customer Name Used: {customer_name}")  # Debugging log


            total_price = sum(item.total_price for item in cart_items)
            # logger.info(f"Total price calculated: {total_price}")
            # Create the order
            order = Order.objects.create(
                token=token,
                customer_name=customer_name,
                total_price=total_price,
                status="",  # Order starts with no status
                started_cooking_at=None,
                completed_at=None,
                cancelled_at=None
            )

             # Create OrderItem entries for each item in the cart
            for item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=item.menu_item,
                    quantity=item.quantity,
                    price_per_unit=item.price_per_unit,
                    total_price=item.total_price
                )

             # Clear cart after placing the order
            cart_items.delete()
            cart.delete()

            # Generate a new token number for the order
            new_token = random.randint(1000, 9999)
            # logger.info(f"New token generated: {new_token}")

            
            # logger.info(f"Order created: {order.id}")

             # Create a new, empty Cart with the new token.
            Cart.objects.create(token=new_token, customer_name="")

            # logger.info("Cart cleared after placing order")


            return Response({
                "message": "Order placed successfully.",
                "order_id": order.id,
                "token": new_token
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # logger.error(f"Error placing order: {str(e)}", exc_info=True)
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class OrderStatusUpdateView(APIView):
    def get(self, request, token):  # Ensure GET method is properly defined
        try:
            order = Order.objects.filter(token=token).first()
            if not order:
                return Response({"error": f"Order with token {token} not found."}, status=status.HTTP_404_NOT_FOUND)

            return Response({
                "token": order.token,
                "status": order.status,
                "started_cooking_at": order.started_cooking_at,
                "completed_at": order.completed_at,
                "cancelled_at": order.cancelled_at,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, token):  # Only using token
        try:
            order = Order.objects.get(token=token)
            new_status = request.data.get("status")

            # Prevent changing status once set
            if order.status in ["completed", "cancelled"]:
                return Response({"error": "Order status cannot be changed once completed or cancelled."}, status=status.HTTP_400_BAD_REQUEST)

            if new_status not in ["progress", "completed", "cancelled"]:
                return Response({"error": "Invalid status."}, status=status.HTTP_400_BAD_REQUEST)

            if new_status == "progress":
                if order.status:  # If already set, do not change
                    return Response({"error": "Order status cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)
                order.status = "progress"
                order.started_cooking_at = now()

            elif new_status == "completed":
                if order.status != "progress":
                    return Response({"error": "Order must be in progress before completing."}, status=status.HTTP_400_BAD_REQUEST)
                order.status = "completed"
                order.completed_at = now()

            elif new_status == "cancelled":
                if order.status:
                    return Response({"error": "Order status cannot be changed."}, status=status.HTTP_400_BAD_REQUEST)
                order.status = "cancelled"
                order.cancelled_at = now()

            order.save()
            return Response({
                "token": order.token,
                "status": order.status,
                "started_cooking_at": order.started_cooking_at,
                "completed_at": order.completed_at,
                "cancelled_at": order.cancelled_at,
            }, status=status.HTTP_200_OK)

        except Order.DoesNotExist:
            return Response({"error": "Order not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ViewOrdersToday(APIView):
    """
    Retrieves all orders placed today.
    """

    def get(self, request):
        today = now().date()
        start_of_day = now().replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = now().replace(hour=23, minute=59, second=59, microsecond=999999)

        orders = Order.objects.filter(created_at__range=(start_of_day, end_of_day))

        order_data = [
            {
                "token": order.token,
                "customer": order.customer_name,
                "total_price": order.total_price,
                 "created_at": order.created_at,
                "items": [
                    {
                        "name": oi.menu_item.name,
                        "quantity": oi.quantity,
                        "price_per_unit": oi.price_per_unit,
                        "total_price": oi.total_price,
                    } for oi in order.items.all()
                ]
            }
            for order in orders
        ]

        return Response({"orders": order_data}, status=status.HTTP_200_OK)
    
class GenerateReportView(APIView):
    """
    Generates a daily and monthly sales report.
    """
    def get(self, request):
        return Response({"message": "Use POST to generate the report."}, status=status.HTTP_200_OK)

    def post(self, request):
        report_type = request.data.get("report_type", "daily")  # Default to daily
        today = now().date()

        if report_type == "daily":
            start_time = now().replace(hour=0, minute=0, second=0, microsecond=0)
            end_time = now().replace(hour=23, minute=59, second=59, microsecond=999999)

             # ✅ Print orders before filtering
            print("All Orders Today:", list(Order.objects.all().values("id", "token", "customer_name", "total_price", "created_at")))

            orders =  Order.objects.filter(
                created_at__gte=start_time,
                created_at__lte=end_time,
                status="completed")

# ✅ Print orders fetched for the report
            print("Fetched Orders for Report:", list(orders.values("id", "token", "customer_name", "total_price", "created_at")))


            total_orders = orders.count()
            total_revenue = orders.aggregate(Sum('total_price'))['total_price__sum'] or 0

            report, created = DailyReport.objects.update_or_create(
                date=today,
                is_monthly=False,
                defaults={'total_orders': total_orders, 'total_revenue': total_revenue}
            )
                # ✅ Print report details
            print("Updated Report:", report.date, report.total_orders, report.total_revenue)


            return Response(
                {
                    "report_type": "daily",
                    "date": str(today),
                    "total_orders": report.total_orders,
                    "total_revenue": float(report.total_revenue),
                    "orders": list(orders.values("id", "token", "customer_name", "total_price", "created_at"))
                },
                status=status.HTTP_200_OK
            )

        elif report_type == "monthly":
            first_day_of_month = make_aware(datetime(today.year, today.month, 1))  # Ensure timezone-aware
            last_day_of_month = make_aware(datetime(today.year, today.month, calendar.monthrange(today.year, today.month)[1], 23, 59, 59))


             # Get total orders and revenue from Orders directly
            orders = Order.objects.filter(
                created_at__range=(first_day_of_month, last_day_of_month),
                status="completed"  )
            total_orders = orders.count()
            total_revenue = orders.aggregate(Sum('total_price'))['total_price__sum']
            total_revenue = float(total_revenue) if total_revenue else 0.00


            return Response(
                {
                    "report_type": "monthly",
                    "month": today.strftime('%B %Y'),
                    "total_orders": total_orders,
                    "total_revenue": float(total_revenue),
                    "orders": list(orders.values("id", "token", "customer_name", "total_price", "created_at"))
                },
                status=status.HTTP_200_OK
            )

        else:
            return Response({"error": "Invalid report type. Use 'daily' or 'monthly'."}, status=400)
        
class MenuItemDeleteView(APIView):
    def get(self, request, *args, **kwargs):
        """
        GET method to test API availability and call the POST method internally.
        """
        return self.post(request)  # Calls the POST method internally

    def post(self, request, *args, **kwargs):
        """
        POST method to delete selected menu items.
        """
        item_ids = request.data.get("ids", [])
        if not item_ids:
            return Response({"error": "No items selected"}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = MenuItem.objects.filter(id__in=item_ids).delete()
        return Response({"message": f"{deleted_count} menu item(s) deleted."}, status=status.HTTP_200_OK)