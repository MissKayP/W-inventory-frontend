import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const StockManagement = () => {
  const { products, addStockTransaction } = useInventory();
  const [stockUpdate, setStockUpdate] = useState({
    productId: '',
    quantity: '',
    type: 'add',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStockUpdate((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleUpdateStock = (e) => {
    e.preventDefault();

    const { productId, quantity, type } = stockUpdate;

    // Validation
    if (!productId) {
      alert('Please select a product');
      return;
    }

    const selectedProduct = products.find((p) => p.id === parseInt(productId, 10));
    if (!selectedProduct) {
      alert('Product not found');
      return;
    }

    if (type === 'remove' && quantity > selectedProduct.quantity) {
      alert('Cannot remove more stock than available');
      return;
    }

    addStockTransaction({
      productId: parseInt(productId, 10),
      quantity: parseInt(quantity, 10),
      type,
    });

    setStockUpdate({ productId: '', quantity: '', type: 'add' }); // Reset form
  };

  return (
    <div>
      <h1>Stock Management</h1>
      <form onSubmit={handleUpdateStock}>
        <select name="productId" value={stockUpdate.productId} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          value={stockUpdate.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
        />
        <select name="type" value={stockUpdate.type} onChange={handleChange}>
          <option value="add">Add (Buy Stock)</option>
          <option value="remove">Sell Stock</option>
        </select>
        <button type="submit">Update Stock</button>
      </form>
    </div>
  );
};

export default StockManagement;
