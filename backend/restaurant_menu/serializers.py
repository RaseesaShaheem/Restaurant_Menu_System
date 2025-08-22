from rest_framework import serializers
from .models import MenuItem, Category,Ingredient, NutritionalInfo, Allergen

from .models import StaffLogin


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        
        model = Category
        fields = '__all__'

class NutritionalInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = NutritionalInfo
        fields = '__all__'

class AllergenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergen
        fields = '__all__'

class IngredientSerializer(serializers.ModelSerializer):
    nutritional_info = NutritionalInfoSerializer(required=False)
    menu_item = serializers.PrimaryKeyRelatedField(
        queryset=MenuItem.objects.all(),
        required=True
    )

        
    class Meta:
        model = Ingredient
        fields = '__all__'
        # fields = ['id', 'name', 'menu_item', 'quantity']

    def create(self, validated_data):
        nutritional_info_data = validated_data.pop('nutritional_info',None)  # Extract nutritional values
        ingredient = Ingredient.objects.create(**validated_data)  # Create ingredient
        if nutritional_info_data:  # ✅ Only create if nutritional data exists
            NutritionalInfo.objects.create(ingredient=ingredient, **nutritional_info_data)
        return ingredient
class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    category_details = CategorySerializer(source='category', read_only=True)  # Returns full details in response
    ingredients = IngredientSerializer(many=True, required=False)
    allergens = serializers.SerializerMethodField()  # Fetch allergens dynamically

    class Meta:
        model = MenuItem
        fields = '__all__'

    def get_allergens(self, obj):
        """Fetches all allergens related to this menu item."""
        allergens = Allergen.objects.filter(menu_item=obj)  # Ensure menuitem field matches your model
        return [allergen.allergen for allergen in allergens]    
    def create(self, validated_data):
        """
        Creates a MenuItem and associated ingredients.
        Nutritional info is NOT created here anymore.
        """
        ingredients_data = validated_data.pop('ingredients', [])
        menu_item = MenuItem.objects.create(**validated_data)

        for ingredient_data in ingredients_data:
            # Nutritional info is removed from automatic creation
            Ingredient.objects.create(menu_item=menu_item, **ingredient_data)

        return menu_item


class StaffLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffLogin
        fields = ['staff_id', 'name']