// src/api/products.ts
import axios from 'axios';
import qs from 'qs';

const API = axios.create({
  baseURL: 'http://localhost:9090',
  paramsSerializer: params =>
    qs.stringify(params, { arrayFormat: 'repeat' }),
});

export interface Product {
  id?: number;
  name: string;
  category: string;
  unitPrice: number;
  quantityInStock: number;
  expirationDate?: string;
}

export interface Metrics {
  totalStock: number;
  totalValue: number;
  avgPrice: number;
  byCategory: Record<
    string,
    { totalStock: number; totalValue: number; avgPrice: number }
  >;
}

// Listar con filtros, orden y paginación
export const fetchProducts = (params: Record<string, any>) =>
  API.get<Product[]>('/products', { params });

// CRUD básico
export const createProduct = (p: Product) =>
  API.post<Product>('/products', p);
export const updateProduct = (id: number, p: Product) =>
  API.put<Product>(`/products/${id}`, p);
export const deleteProduct = (id: number) =>
  API.delete(`/products/${id}`);

// Stock toggle
export const markInStock = (id: number, quantity = 10) =>
  API.put<Product>(`/products/${id}/instock`, null, {
    params: { quantity },
  });
export const markOutOfStock = (id: number) =>
  API.post<Product>(`/products/${id}/outofstock`);

// Métricas
export const fetchMetrics = () => API.get<Metrics>('/products/metrics');
