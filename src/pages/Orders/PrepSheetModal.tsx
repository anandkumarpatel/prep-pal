import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface PrepSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  quantities: { [category: string]: { name: string, quantity: number, unit: string }[] };
}

const PrepSheetModal = ({ isOpen, onClose, quantities }: PrepSheetModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Prep Sheet
              </Dialog.Title>
              <div className="mt-4">
                {Object.entries(quantities).map(([category, ingredients]) => (
                  <div key={category} className="mb-4">
                    <h4 className="font-bold text-md capitalize">{category}</h4>
                    <ul className="list-disc pl-5">
                      {ingredients.map(ing => (
                        <li key={ing.name}>{ing.name}: {ing.quantity} {ing.unit}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PrepSheetModal;
