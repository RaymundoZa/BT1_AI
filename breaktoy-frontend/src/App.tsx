// src/App.tsx
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductsList from './components/ProductsList';
import ProductForm from './components/ProductForm';
import SearchBar from './components/SearchBar';
import MetricsTable from './components/MetricsTable';
import MetricsGraphics from './components/MetricsGraphics';
import type { Product, Metrics as MetricsType } from './api/products';
import {
  fetchProducts,
  fetchMetrics,
  createProduct,
  updateProduct,
  deleteProduct,
  markInStock,
  markOutOfStock,
} from './api/products';

const pageSize = 10;

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const [name, setName] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'all' | 'inStock' | 'outOfStock'>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [metrics, setMetrics] = useState<MetricsType | null>(null);
  const [page, setPage] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const buildFilters = () => ({
    name: name || undefined,
    category: selectedCategories.length ? selectedCategories : undefined,
    inStock:
      availability === 'inStock'
        ? true
        : availability === 'outOfStock'
        ? false
        : undefined,
  });

  const loadProducts = async () => {
    const filters = buildFilters();
    console.log('Enviando filtros:', filters);
    const res = await fetchProducts({ ...filters, page, size: pageSize });
    setProducts(res.data);
  };

  const loadMetrics = async () => {
    const res = await fetchMetrics();
    setMetrics(res.data);
  };

  useEffect(() => {
    setCategories(Array.from(new Set(products.map(p => p.category))));
  }, [products]);

  useEffect(() => {
    loadProducts();
    loadMetrics();
  }, [name, selectedCategories, availability, page]);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />

      <main className="flex-grow p-6">
        <SearchBar
          name={name}
          onNameChange={setName}
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          availability={availability}
          onAvailabilityChange={setAvailability}
          onSearch={() => { setPage(0); loadProducts(); loadMetrics(); }}
          onClear={() => {
            setName('');
            setSelectedCategories([]);
            setAvailability('all');
            setPage(0);
            loadProducts();
            loadMetrics();
          }}
        />

        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + New Product
        </button>

        <ProductsList
          products={products}
          onEdit={p => { setEditing(p); setShowForm(true); }}
          onDelete={async id => {
            await deleteProduct(id);
            await loadProducts();
            await loadMetrics();
          }}
          onToggleStock={async (id, currentlyInStock, newQty) => {
            if (currentlyInStock) {
              await markOutOfStock(id);
            } else {
              await markInStock(id, newQty ?? 0);
            }
            await loadProducts();
            await loadMetrics();
          }}
        />

        <div className="flex justify-center items-center space-x-4 my-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
            disabled={page === 0}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ‹ Prev
          </button>
          <span>Page {page + 1}</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={products.length < pageSize}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next ›
          </button>
        </div>

        {metrics && (
          <div id="metrics" className="scroll-mt-20">
              <h2 className="text-3xl font-semibold mb-8 mt-15 text-center text-gray-100">
      Metrics Inventory
      </h2>
            <MetricsTable metrics={metrics} />
            <MetricsGraphics metrics={metrics} />
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start p-4 overflow-auto">
            <div className="bg-white dark:bg-gray-800 dark:text-gray-100 rounded shadow-lg max-w-md w-full p-6 transition-colors">
              <ProductForm
                initial={editing ?? undefined}
                categories={categories}
                onSubmit={async prod => {
                  if (prod.id) await updateProduct(prod.id, prod);
                  else await createProduct(prod);
                  setShowForm(false);
                  loadProducts();
                  loadMetrics();
                }}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
