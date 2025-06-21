import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Order, MenuItem } from 'types';
import { createOrder, updateOrder, getMenuItems, getOrders } from 'utils';
import { v4 as uuidv4 } from 'uuid';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  order?: Order | null;
}

const OrderForm = ({ isOpen, onClose, onSave, order }: OrderFormProps) => {
  const [name, setName] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [menuItems, setMenuItems] = useState<{ id: string, recipeId: string, servings: number }[]>([]);
  const [availableMenuItems, setAvailableMenuItems] = useState<MenuItem[]>([]);
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isTemplate, setIsTemplate] = useState(false);

  const [allEventTypes, setAllEventTypes] = useState<string[]>([]);
  const [isAddingNewEventType, setIsAddingNewEventType] = useState(false);
  const [newEventType, setNewEventType] = useState("");

  useEffect(() => {
    setAvailableMenuItems(getMenuItems());
    if (isOpen) {
        const allOrders = getOrders();
        const uniqueEventTypes = [...new Set(allOrders.map(o => o.eventType).filter(Boolean))];

        if (order?.eventType && !uniqueEventTypes.includes(order.eventType)) {
            uniqueEventTypes.push(order.eventType);
        }

        setAllEventTypes(uniqueEventTypes);

        setIsAddingNewEventType(false);
        setNewEventType('');
    }
  }, [isOpen, order]);

  useEffect(() => {
    if (order) {
      setName(order.name);
      setNumberOfPeople(order.numberOfPeople);
      setMenuItems(order.menuItems);
      setEventType(order.eventType);
      setDate(order.date);
      setTime(order.time);
      setLocation(order.location);
      setNotes(order.notes);
      setIsTemplate(order.isTemplate);
    } else {
      setName('');
      setNumberOfPeople(1);
      setMenuItems([]);
      setEventType('');
      setDate('');
      setTime('');
      setLocation('');
      setNotes('');
      setIsTemplate(false);
    }
  }, [order, isOpen]);

  const handleAutoScaling = () => {
    const newMenuItems = menuItems.map(item => {
      const menuItemDetails = availableMenuItems.find(mi => mi.id === item.recipeId);
      if (menuItemDetails && menuItemDetails.servingSize > 0) {
        return {
          ...item,
          servings: Math.ceil(numberOfPeople / menuItemDetails.servingSize)
        };
      }
      return item;
    });
    setMenuItems(newMenuItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEventType = isAddingNewEventType ? newEventType : eventType;
    const orderData = { name, numberOfPeople, menuItems, eventType: finalEventType, date, time, location, notes, isTemplate };
    if (order && order.id) {
      updateOrder({ ...order, ...orderData });
    } else {
      createOrder(orderData);
    }
    onSave();
    onClose();
  };

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { id: uuidv4(), recipeId: '', servings: 1 }]);
  };

  const handleMenuItemChange = (index: number, field: string, value: string | number) => {
    const newMenuItems = [...menuItems];
    if (field === 'servings') {
      newMenuItems[index] = { ...newMenuItems[index], servings: Number(value) };
    } else {
      newMenuItems[index] = { ...newMenuItems[index], recipeId: value as string };
    }
    setMenuItems(newMenuItems);
  };

  const handleRemoveMenuItem = (index: number) => {
    const newMenuItems = menuItems.filter((_, i) => i !== index);
    setMenuItems(newMenuItems);
  };

  const handleEventTypeChange = (value: string) => {
    if (value === 'add-new') {
        setIsAddingNewEventType(true);
        setEventType('');
    } else {
        setIsAddingNewEventType(false);
        setEventType(value);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                {order ? 'Edit Order' : 'Add Order'}
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                  </div>
                  <div>
                    <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700"># of People</label>
                    <div className="flex items-center space-x-2">
                      <input type="number" name="numberOfPeople" id="numberOfPeople" min="0" step="0.01" value={numberOfPeople} onChange={(e) => setNumberOfPeople(Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                      <button type="button" onClick={handleAutoScaling} className="rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-gray-800">Auto-Scale</button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">Event Type</label>
                    <select
                        name="eventType"
                        id="eventType"
                        value={isAddingNewEventType ? 'add-new' : eventType}
                        onChange={(e) => handleEventTypeChange(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                        <option value="">Select Event Type</option>
                        {allEventTypes.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="add-new">Add new event type...</option>
                    </select>
                    {isAddingNewEventType && (
                        <input
                            type="text"
                            value={newEventType}
                            onChange={(e) => setNewEventType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="New event type name"
                        />
                    )}
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                    <input type="time" name="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input type="text" name="location" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Menu Items</label>
                    <div className="flex items-center space-x-2 mt-2 text-sm font-medium text-gray-500">
                      <div className="flex-grow">Name</div>
                      <div className="w-1/4 pr-2">Servings</div>
                      <div className="w-16"></div>
                    </div>
                    {menuItems.map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-2 mt-2">
                        <select
                          value={item.recipeId}
                          onChange={(e) => handleMenuItemChange(index, 'recipeId', e.target.value)}
                          className="block w-full rounded-md border-gray-300 shadow-sm"
                        >
                          <option value="">Select Menu Item</option>
                          {availableMenuItems.map((availItem) => (
                            <option key={availItem.id} value={availItem.id}>{availItem.name}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.servings}
                          onChange={(e) => handleMenuItemChange(index, 'servings', e.target.value)}
                          className="block w-1/4 rounded-md border-gray-300 shadow-sm"
                        />
                        <button type="button" onClick={() => handleRemoveMenuItem(index)} className="text-red-500 w-16 text-center">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={handleAddMenuItem} className="mt-2 text-indigo-600">Add Menu Item</button>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isTemplate"
                      name="isTemplate"
                      type="checkbox"
                      checked={isTemplate}
                      onChange={(e) => setIsTemplate(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isTemplate" className="ml-2 block text-sm text-gray-900">
                      Save as template
                    </label>
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

export default OrderForm;
