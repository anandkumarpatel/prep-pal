import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MenuItem, Ingredient } from 'types';
import { createMenuItem, updateMenuItem, getIngredients } from 'utils';
import { v4 as uuidv4 } from 'uuid';

interface MenuItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  menuItem?: MenuItem | null;
}

const MenuItemForm = ({ isOpen, onClose, onSave, menuItem }: MenuItemFormProps) => {
  const [name, setName] = useState('');
  const [servingSize, setServingSize] = useState(1);
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState<{ id: string, ingredientId: string, quantity: number }[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    setAvailableIngredients(getIngredients());
  }, []);

  useEffect(() => {
    if (menuItem) {
      setName(menuItem.name);
      setServingSize(menuItem.servingSize);
      setInstructions(menuItem.instructions);
      setIngredients(menuItem.ingredients);
    } else {
      setName('');
      setServingSize(1);
      setInstructions('');
      setIngredients([]);
    }
  }, [menuItem, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const menuItemData = { name, servingSize, instructions, ingredients };
    if (menuItem) {
      updateMenuItem({ ...menuItem, ...menuItemData });
    } else {
      createMenuItem(menuItemData);
    }
    onSave();
    onClose();
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: uuidv4(), ingredientId: '', quantity: 1 }]);
  };

  const handleIngredientChange = (index: number, field: string, value: string | number) => {
    const newIngredients = [...ingredients];
    if (field === 'quantity') {
      newIngredients[index] = { ...newIngredients[index], quantity: Number(value) };
    } else {
      newIngredients[index] = { ...newIngredients[index], ingredientId: value as string, quantity: 1 };
    }
    setIngredients(newIngredients);
  };

  const handleRemoveIngredient = (index: number) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                  </div>
                  <div>
                    <label htmlFor="servingSize" className="block text-sm font-medium text-gray-700">Serving Size</label>
                    <input type="number" name="servingSize" id="servingSize" value={servingSize} onChange={(e) => setServingSize(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required min="0" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                    <div className="flex items-center space-x-2 mt-2 text-sm font-medium text-gray-500">
                        <div className="flex-grow">Name</div>
                        <div className="w-24">Quantity</div>
                        <div className="w-24 text-left">Unit</div>
                        <div className="w-20"></div>
                    </div>
                    {ingredients.map((ing, index) => {
                      const selectedIngredient = availableIngredients.find(i => i.id === ing.ingredientId);
                      return (
                        <div key={ing.id} className="flex items-center space-x-2 mt-2">
                          <select
                            value={ing.ingredientId}
                            onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
                            className="block flex-grow rounded-md border-gray-300 bg-gray-50 shadow-sm"
                          >
                            <option value="">Select Ingredient</option>
                            {availableIngredients.map((availIng) => (
                              <option key={availIng.id} value={availIng.id}>{availIng.name}</option>
                            ))}
                          </select>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={ing.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                            className="block w-24 rounded-md border-gray-300 shadow-sm"
                          />
                          <span className="text-sm text-gray-500 w-24 text-left">{selectedIngredient?.unit || ''}</span>
                          <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500 w-20">Remove</button>
                        </div>
                      )
                    })}
                    <button type="button" onClick={handleAddIngredient} className="mt-2 text-indigo-600">Add Ingredient</button>
                  </div>
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea name="instructions" id="instructions" rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700">Cancel</button>
                  <button type="submit" className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white">Save</button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MenuItemForm;
