import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Order } from 'types';

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Order[];
  onSelect: (template: Order) => void;
}

const TemplateSelectionModal = ({ isOpen, onClose, templates, onSelect }: TemplateSelectionModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                Select a Template
              </Dialog.Title>
              <div className="mt-4">
                <ul className="divide-y divide-gray-200">
                  {templates.map(template => (
                    <li key={template.id} className="py-4 flex justify-between items-center">
                      <span>{template.name}</span>
                      <button
                        onClick={() => onSelect(template)}
                        className="rounded-md border border-transparent bg-indigo-600 py-1 px-3 text-sm font-medium text-white"
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TemplateSelectionModal;
