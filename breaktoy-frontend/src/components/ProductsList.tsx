// src/components/ProductsList.tsx
import React, { useState } from 'react';
import type { Product } from '../api/products';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export interface ProductsListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  /**
   * @param id               the product id
   * @param currentlyInStock true if it was IN STOCK (we’ll mark out)
   * @param newQty?          for restock: the new quantity
   */
  onToggleStock: (
    id: number,
    currentlyInStock: boolean,
    newQty?: number
  ) => void;
}

type ModalState =
  | { id: number; type: 'out' }
  | { id: number; type: 'in' };

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onDelete,
  onToggleStock,
}) => {
  const [modal, setModal] = useState<ModalState | null>(null);
  const [qtyInput, setQtyInput] = useState<string>('');

  return (
    <>
      <div className="bg-gray-800 dark:bg-gray-900 text-gray-100 rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto divide-y divide-gray-700 text-sm">
            <thead className="bg-gray-700 dark:bg-gray-800">
              <tr>
                {['Name','Category','Price','Stock','Status','Actions'].map(h => (
                  <th
                    key={h}
                    className="px-4 py-2 font-semibold uppercase tracking-wide text-gray-300 dark:text-gray-400 text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map(p => {
                const qty = p.quantityInStock ?? 0;
                const inStock = qty > 0;

                // text color by stock
                const qtyColor =
                  qty === 0      ? 'text-red-400' :
                  qty < 5        ? 'text-red-300' :
                  qty <= 10      ? 'text-yellow-300' :
                                   'text-green-300';

                // status badge
                const statusText = inStock ? 'In Stock' : 'Out of Stock';
                const statusBg   = inStock ? 'bg-green-600' : 'bg-red-600';

                return (
                  <tr key={p.id} className="hover:bg-gray-700 transition-colors">
                    <td className="px-4 py-2 text-center">{p.name}</td>
                    <td className="px-4 py-2 text-center">{p.category}</td>
                    <td className="px-4 py-2 text-center">${p.unitPrice.toFixed(2)}</td>
                    <td className={`px-4 py-2 text-center font-semibold ${qtyColor}`}>
                      {qty}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => setModal({ id: p.id!, type: inStock ? 'out' : 'in' })}
                        className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full ${statusBg} hover:opacity-80 transition`}
                      >
                        {statusText}
                      </button>
                    </td>
                    <td className="px-4 py-2 text-center space-x-3">
                      <button
                        onClick={() => onEdit(p)}
                        className="hover:text-indigo-400 transition"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id!)}
                        className="hover:text-red-400 transition"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dark-mode custom modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 dark:bg-gray-900 text-gray-100 rounded-lg p-6 w-80 space-y-4">
            {modal.type === 'out' ? (
              <>
                <h3 className="text-lg font-semibold">Confirm Change</h3>
                <p>Mark this product as <strong>Out of Stock</strong>?</p>
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setModal(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onToggleStock(modal.id, true);
                      setModal(null);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white transition"
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">Restock Product</h3>
                <p>Enter quantity to assign:</p>
                <input
                  type="number"
                  value={qtyInput}
                  onChange={e => setQtyInput(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2 rounded bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => { setModal(null); setQtyInput(''); }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const newQty = parseInt(qtyInput, 10);
                      if (!isNaN(newQty)) {
                        onToggleStock(modal.id, false, newQty);
                      }
                      setModal(null);
                      setQtyInput('');
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsList;
