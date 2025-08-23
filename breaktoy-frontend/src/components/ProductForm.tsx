// src/components/ProductForm.tsx
import React, { useState, useEffect } from 'react';
import type { Product } from '../api/products';

export interface ProductFormProps {
  initial?: Product;
  categories: string[];
  onSubmit: (product: Product) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initial,
  categories,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [quantityInStock, setQuantityInStock] = useState<number | ''>('');
  const [outOfStock, setOutOfStock] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // load initial values
  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setCategory(initial.category);
      setUnitPrice(initial.unitPrice ?? '');
      setQuantityInStock(initial.quantityInStock ?? '');
      setOutOfStock((initial.quantityInStock ?? 0) === 0);
    }
  }, [initial]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Required';
    if (!category.trim()) e.category = 'Required';
    if (unitPrice === '' || unitPrice < 0) e.unitPrice = '≥ 0';
    if (quantityInStock === '' || quantityInStock < 0) e.quantityInStock = '≥ 0';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      ...(initial ?? {}),
      name: name.trim(),
      category: category.trim(),
      unitPrice: Number(unitPrice),
      quantityInStock: outOfStock ? 0 : Number(quantityInStock),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 overflow-auto">
      <div className="bg-gray-800 text-gray-100 rounded-lg shadow-lg w-full max-w-md p-6 space-y-6 transition-colors">
        <h2 className="text-xl font-semibold text-center">
          {initial ? 'Edit Product' : 'Add new Product'}
        </h2>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className={`
              w-full px-3 py-2 rounded bg-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.name ? 'border-2 border-red-500' : 'border border-gray-600'}
            `}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Category <span className="text-red-500">*</span>
          </label>
          <input
            list="categories"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={`
              w-full px-3 py-2 rounded bg-gray-700 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              ${errors.category ? 'border-2 border-red-500' : 'border border-gray-600'}
            `}
            placeholder="Type or select…"
          />
          <datalist id="categories">
            {categories.map(cat => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
          {errors.category && (
            <p className="mt-1 text-xs text-red-400">{errors.category}</p>
          )}
        </div>

        {/* Price & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                step="0.01"
                value={unitPrice}
                onChange={e => setUnitPrice(e.target.valueAsNumber)}
                className={`
                  w-full pl-6 pr-3 py-2 rounded bg-gray-700 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${errors.unitPrice ? 'border-2 border-red-500' : 'border border-gray-600'}
                `}
              />
            </div>
            {errors.unitPrice && (
              <p className="mt-1 text-xs text-red-400">{errors.unitPrice}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={quantityInStock}
              onChange={e => setQuantityInStock(e.target.valueAsNumber)}
              className={`
                w-full px-3 py-2 rounded bg-gray-700 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${errors.quantityInStock
                  ? 'border-2 border-red-500'
                  : 'border border-gray-600'}
              `}
            />
            {errors.quantityInStock && (
              <p className="mt-1 text-xs text-red-400">{errors.quantityInStock}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-gray-700 hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-700 transition text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
