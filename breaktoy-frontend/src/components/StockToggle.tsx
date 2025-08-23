// src/components/StockToggle.tsx
import React from 'react';

export interface StockToggleProps {
  /** El ID del producto */
  id: number;
  /** true si actualmente está en stock (>0), false si está agotado */
  inStock: boolean;
  /**
   * Llama para alternar el stock del producto.
   * @param id – ID del producto
   * @param currentlyInStock – estado actual (antes del toggle)
   */
  onToggle: (id: number, currentlyInStock: boolean) => void;
}

const StockToggle: React.FC<StockToggleProps> = ({ id, inStock, onToggle }) => {
  const handleChange = () => {
    onToggle(id, inStock);
  };

  return (
    <input
      type="checkbox"
      checked={!inStock}
      onChange={handleChange}
      className="cursor-pointer"
      title={inStock ? "Marcar como fuera de stock" : "Marcar como en stock"}
    />
  );
};

export default StockToggle;
