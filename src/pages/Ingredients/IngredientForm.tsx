import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Ingredient } from 'types';
import { createIngredient, updateIngredient, getIngredients } from 'utils';

interface IngredientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  ingredient?: Ingredient | null;
}

const IngredientForm = ({ isOpen, onClose, onSave, ingredient }: IngredientFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');

  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [allUnits, setAllUnits] = useState<string[]>([]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isAddingNewUnit, setIsAddingNewUnit] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newUnit, setNewUnit] = useState("");

  useEffect(() => {
    if (isOpen) {
        const allIngredients = getIngredients();
        const uniqueCategories = [...new Set(allIngredients.map(i => i.category).filter(Boolean))];
        const uniqueUnits = [...new Set(allIngredients.map(i => i.unit).filter(Boolean))];

        if (ingredient?.category && !uniqueCategories.includes(ingredient.category)) {
            uniqueCategories.push(ingredient.category);
        }
        if (ingredient?.unit && !uniqueUnits.includes(ingredient.unit)) {
            uniqueUnits.push(ingredient.unit);
        }

        setAllCategories(uniqueCategories);
        setAllUnits(uniqueUnits);

        setIsAddingNewCategory(false);
        setIsAddingNewUnit(false);
        setNewCategory('');
        setNewUnit('');
    }
  }, [isOpen, ingredient]);

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setCategory(ingredient.category);
      setUnit(ingredient.unit);
      setNotes(ingredient.notes);
    } else {
      setName('');
      setCategory('');
      setUnit('');
      setNotes('');
    }
  }, [ingredient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = isAddingNewCategory ? newCategory : category;
    const finalUnit = isAddingNewUnit ? newUnit : unit;
    const ingredientData = { name, category: finalCategory, unit: finalUnit, notes };
    if (ingredient) {
      updateIngredient({ ...ingredient, ...ingredientData });
    } else {
      createIngredient(ingredientData);
    }
    onSave();
    onClose();
  };

  const handleCategoryChange = (value: string) => {
    if (value === 'add-new') {
        setIsAddingNewCategory(true);
        setCategory('');
    } else {
        setIsAddingNewCategory(false);
        setCategory(value);
    }
  };

  const handleUnitChange = (value: string) => {
      if (value === 'add-new') {
          setIsAddingNewUnit(true);
          setUnit('');
      } else {
          setIsAddingNewUnit(false);
          setUnit(value);
      }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {ingredient ? 'Edit Ingredient' : 'Add Ingredient'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        name="category"
                        id="category"
                        value={isAddingNewCategory ? 'add-new' : category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Category</option>
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="add-new">Add new category...</option>
                      </select>
                      {isAddingNewCategory && (
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="New category name"
                        />
                      )}
                    </div>
                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
                      <select
                        name="unit"
                        id="unit"
                        value={isAddingNewUnit ? 'add-new' : unit}
                        onChange={(e) => handleUnitChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select Unit</option>
                        {allUnits.map(u => <option key={u} value={u}>{u}</option>)}
                        <option value="add-new">Add new unit...</option>
                      </select>
                      {isAddingNewUnit && (
                        <input
                          type="text"
                          value={newUnit}
                          onChange={(e) => setNewUnit(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="New unit name"
                        />
                      )}
                    </div>
                    <div>
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        id="notes"
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default IngredientForm;
