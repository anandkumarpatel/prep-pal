1. Introduction

This document outlines the core features and functionalities of Prep Pal, a web-based application designed to streamline the process of calculating ingredient quantities and generating prep sheets for food service operations.

2. Goals

To provide a user-friendly interface for managing recipes and calculating required ingredients based on order size.
To automate the generation of clear and organized prep sheets for kitchen staff.
To enable efficient scaling of orders for varying guest counts.

3. Core Features
Order Management: A page to List, Read, Edit, Create and Delete Orders.
Menu Item Management: A page to List, Read, Edit, Create and Delete Menu Items. Only allow delete if no orders are associated with the menu item.
Ingredient Management: A page to List, Read, Edit, Create and Delete Ingredients.Only allow delete if no menu items are associated with the ingredient.

Quantity Calculation: Functionality to calculate the required quantities of ingredients on an order. This should be a modal that is triggered by the order page.
Prep Sheet Generation: The ability to generate a summary sheet clearly displaying required Ingredents by category.
Template Saving: The option to save order as templates for easy reuse.
Order Auto Scaling: Given the number of people, calculate the services of menu items based on each menu item's servingSize.

4. User Interface Guidelines
A clean and organized layout for easy data entry and readability.
Intuitive navigation and clear visual hierarchy.

5. Non-Functional Requirements
Reliable and accurate quantity calculations.
Efficient generation of prep sheets.

6. Tech Stack
Frontend: React with TypeScript, Tailwind CSS
Backend/Database: LocalStorage

7. Data

Order: {
    id: string;
    name: string;
    numberOfPeople: number;
    menuItems: {
      id: string;
      recipeId: string;
      servings: number; // number of this item to make
    }[];
    eventType: string;
    date: string;
    time: string;
    location: string;
    notes: string;
    createdAt: string;
  updatedAt: string;
  isTemplate: boolean;
}

MenuItem: {
    id: string;
    name: string;
    ingredients: {
      id: string
      ingredientId: string
      quantity: number
  } [];
    servingSize: number; // number of people this item can serve
    instructions: string;
    createdAt: string;
    updatedAt: string;
}

Ingredient: {
    id: string;
    name: string;
    unit: 'lbs' | 'oz' | 'gallons' | 'quarts' | 'pints' | 'cups' | 'tbsp' | 'tsp' | 'ml' | 'liters' | 'grams' | 'kg' | 'trays' | 'pieces' | 'each' | 'count' | 'bunches' | 'heads' | 'cloves' | string;
  notes: string;
  catagoty: 'meat' | 'side' | 'drinks' | string
}

InventoryItem: {
  id: string;
  ingredientId: string;
  quantity: number;
  added: string;
  expiration: string;
  notes: string;
}
