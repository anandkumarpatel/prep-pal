import { useState, useEffect } from 'react';
import { Order } from 'types';
import { getOrders, deleteOrder, calculateQuantities } from 'utils';
import OrderForm from './OrderForm';
import PrepSheetModal from './PrepSheetModal';
import TemplateSelectionModal from './TemplateSelectionModal';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [templates, setTemplates] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isPrepSheetModalOpen, setIsPrepSheetModalOpen] = useState(false);
  const [prepSheetQuantities, setPrepSheetQuantities] = useState({});
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  useEffect(() => {
    const allOrders = getOrders();
    setOrders(allOrders.filter(o => !o.isTemplate));
    setTemplates(allOrders.filter(o => o.isTemplate));
  }, []);

  const refreshOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders.filter(o => !o.isTemplate));
    setTemplates(allOrders.filter(o => o.isTemplate));
  };

  const handleDelete = (id: string) => {
    deleteOrder(id);
    refreshOrders();
  };

  const handleAdd = () => {
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    refreshOrders();
  };

  const handlePrepSheet = (order: Order) => {
    const quantities = calculateQuantities(order);
    setPrepSheetQuantities(quantities);
    setIsPrepSheetModalOpen(true);
  };

  const handleSelectTemplate = (template: Order) => {
    setSelectedOrder({ ...template, id: '', isTemplate: false, name: `New Order from ${template.name}` });
    setIsTemplateModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all the orders.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-2">
          <button
            type="button"
            onClick={() => setIsTemplateModalOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700"
          >
            Create from Template
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            Add Order
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      # of People
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {order.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.numberOfPeople}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button onClick={() => handlePrepSheet(order)} className="text-gray-600 hover:text-gray-900">
                          Prep Sheet
                        </button>
                        <button onClick={() => handleEdit(order)} className="ml-4 text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="ml-4 text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <OrderForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        order={selectedOrder}
      />
      <PrepSheetModal
        isOpen={isPrepSheetModalOpen}
        onClose={() => setIsPrepSheetModalOpen(false)}
        quantities={prepSheetQuantities}
      />
      <TemplateSelectionModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={templates}
        onSelect={handleSelectTemplate}
      />
    </div>
  );
};

export default OrdersPage;
