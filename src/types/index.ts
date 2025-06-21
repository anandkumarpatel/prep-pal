export type Order = {
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
};

export type MenuItem = {
  id: string;
  name: string;
  ingredients: {
    id: string;
    ingredientId: string;
    quantity: number;
  }[];
  servingSize: number; // number of people this item can serve
  instructions: string;
  createdAt: string;
  updatedAt: string;
};

export type Ingredient = {
  id: string;
  name: string;
  unit:
    | 'lbs'
    | 'oz'
    | 'gallons'
    | 'quarts'
    | 'pints'
    | 'cups'
    | 'tbsp'
    | 'tsp'
    | 'ml'
    | 'liters'
    | 'grams'
    | 'kg'
    | 'trays'
    | 'pieces'
    | 'each'
    | 'count'
    | 'bunches'
    | 'heads'
    | 'cloves'
    | string;
  notes: string;
  category: 'meat' | 'side' | 'drinks' | string;
};

export type InventoryItem = {
  id: string;
  ingredientId: string;
  quantity: number;
  added: string;
  expiration: string;
  notes: string;
};
