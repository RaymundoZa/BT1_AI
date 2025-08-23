// src/components/SearchBar.tsx
import React, { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

export interface SearchBarProps {
  name: string;
  onNameChange: (value: string) => void;
  categories: string[];
  selectedCategories: string[];
  onCategoriesChange: (value: string[]) => void;
  availability: 'all' | 'inStock' | 'outOfStock';
  onAvailabilityChange: (value: 'all' | 'inStock' | 'outOfStock') => void;
  onSearch: () => void;
  onClear: () => void;              // ← Nuevo prop
}

const SearchBar: React.FC<SearchBarProps> = ({
  name,
  onNameChange,
  categories,
  selectedCategories,
  onCategoriesChange,
  availability,
  onAvailabilityChange,
  onSearch,
  onClear,                         // ← Desestructuramos onClear
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      onCategoriesChange(selectedCategories.filter(c => c !== cat));
    } else {
      onCategoriesChange([...selectedCategories, cat]);
    }
  };

  return (
    <div className="relative mb-6">
      {/* Search input + filter toggle */}
      <div className="flex items-center bg-gray-700 dark:bg-gray-800 rounded-md shadow px-4 py-2">
        <input
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
          placeholder="Search by name..."
          className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none"
        />
        <button
          onClick={() => setShowFilters(f => !f)}
          className="ml-3 text-gray-300 hover:text-white focus:outline-none"
        >
          {showFilters ? <FiX size={20} /> : <FiFilter size={20} />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="absolute z-10 w-full bg-gray-700 dark:bg-gray-800 rounded-md shadow-lg mt-2 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-100">
          
          {/* Availability */}
          <div className="space-y-2 p-3 bg-gray-600 dark:bg-gray-700 rounded">
            <p className="font-semibold mb-1">Availability</p>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="avail"
                value="all"
                checked={availability === 'all'}
                onChange={() => onAvailabilityChange('all')}
                className="form-radio text-indigo-400"
              />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="avail"
                value="inStock"
                checked={availability === 'inStock'}
                onChange={() => onAvailabilityChange('inStock')}
                className="form-radio text-indigo-400"
              />
              <span>In Stock</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="avail"
                value="outOfStock"
                checked={availability === 'outOfStock'}
                onChange={() => onAvailabilityChange('outOfStock')}
                className="form-radio text-indigo-400"
              />
              <span>Out of Stock</span>
            </label>
          </div>

          {/* Categories */}
          <div className="space-y-2 p-3 bg-gray-600 dark:bg-gray-700 rounded">
            <p className="font-semibold mb-1">Filter by Category</p>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <label key={cat} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="form-checkbox text-indigo-400"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="md:col-span-2 flex justify-end space-x-3">
            <button
              onClick={() => {
                onClear();            // ← limpiamos filtros
                setShowFilters(false);
              }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
            >
              Clear
            </button>
            <button
              onClick={() => {
                onSearch();
                setShowFilters(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded"
            >
              Apply
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
