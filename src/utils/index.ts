import { v4 as uuidv4 } from 'uuid';
import { Ingredient, MenuItem, Order } from 'types';

export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

const INGREDIENTS_KEY = 'ingredients';

export const getIngredients = (): Ingredient[] => {
  const ingredients = localStorage.getItem(INGREDIENTS_KEY);
  return ingredients ? JSON.parse(ingredients) : [];
};

export const createIngredient = (ingredient: Omit<Ingredient, 'id'>): Ingredient => {
  const ingredients = getIngredients();
  const newIngredient = { ...ingredient, id: uuidv4() };
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify([...ingredients, newIngredient]));
  return newIngredient;
};

export const updateIngredient = (updatedIngredient: Ingredient): Ingredient => {
  const ingredients = getIngredients();
  const index = ingredients.findIndex((i) => i.id === updatedIngredient.id);
  ingredients[index] = updatedIngredient;
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(ingredients));
  return updatedIngredient;
};

export const deleteIngredient = (id: string): void => {
  const ingredients = getIngredients();
  const updatedIngredients = ingredients.filter((i) => i.id !== id);
  localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(updatedIngredients));
};

// Menu Item Service
const MENU_ITEMS_KEY = 'menuItems';

export const getMenuItems = (): MenuItem[] => {
  const menuItems = localStorage.getItem(MENU_ITEMS_KEY);
  return menuItems ? JSON.parse(menuItems) : [];
};

export const createMenuItem = (menuItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem => {
  const menuItems = getMenuItems();
  const newMenuItem = { ...menuItem, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify([...menuItems, newMenuItem]));
  return newMenuItem;
};

export const updateMenuItem = (updatedMenuItem: MenuItem): MenuItem => {
  const menuItems = getMenuItems();
  const index = menuItems.findIndex((i) => i.id === updatedMenuItem.id);
  menuItems[index] = { ...updatedMenuItem, updatedAt: new Date().toISOString() };
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(menuItems));
  return menuItems[index];
};

export const deleteMenuItem = (id: string): void => {
  const menuItems = getMenuItems();
  const updatedMenuItems = menuItems.filter((i) => i.id !== id);
  localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(updatedMenuItems));
};

// Order Service
const ORDERS_KEY = 'orders';

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem(ORDERS_KEY);
  return orders ? JSON.parse(orders) : [];
};

export const createOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
  const orders = getOrders();
  const newOrder = { ...order, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  localStorage.setItem(ORDERS_KEY, JSON.stringify([...orders, newOrder]));
  return newOrder;
};

export const updateOrder = (updatedOrder: Order): Order => {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === updatedOrder.id);
  orders[index] = { ...updatedOrder, updatedAt: new Date().toISOString() };
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return orders[index];
};

export const deleteOrder = (id: string): void => {
  const orders = getOrders();
  const updatedOrders = orders.filter((o) => o.id !== id);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
};

export const calculateQuantities = (order: Order) => {
  const menuItems = getMenuItems();
  const ingredients = getIngredients();
  const requiredIngredients: { [key: string]: { quantity: number, unit: string, category: string } } = {};

  order.menuItems.forEach(orderItem => {
    const menuItem = menuItems.find(mi => mi.id === orderItem.recipeId);
    if (menuItem) {
      menuItem.ingredients.forEach(ingredientInfo => {
        const ingredient = ingredients.find(i => i.id === ingredientInfo.ingredientId);
        if (ingredient) {
          const totalQuantity = ingredientInfo.quantity * orderItem.servings;
          if (requiredIngredients[ingredient.name]) {
            requiredIngredients[ingredient.name].quantity += totalQuantity;
          } else {
            requiredIngredients[ingredient.name] = {
              quantity: totalQuantity,
              unit: ingredient.unit,
              category: ingredient.category,
            };
          }
        }
      });
    }
  });

  const categorizedIngredients: { [category: string]: { name: string, quantity: number, unit: string }[] } = {};

  Object.entries(requiredIngredients).forEach(([name, data]) => {
    if (!categorizedIngredients[data.category]) {
      categorizedIngredients[data.category] = [];
    }
    categorizedIngredients[data.category].push({ name, ...data });
  });

  return categorizedIngredients;
};
