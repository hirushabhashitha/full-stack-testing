// components/ProductTab.js
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ProductTab({ products, setProducts }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ Add/Edit Product Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  // Custom Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('accessToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        const res = await axios.put(`http://localhost:5000/api/products/${editingId}`, formData, config);
        setProducts(products.map((p) => (p._id === editingId ? res.data : p)));
        setEditingId(null);
      } else {
        const res = await axios.post('http://localhost:5000/api/products', formData, config);
        setProducts([res.data, ...products]);
      }

      setFormData({ name: '', price: '', category: '', stock: '', description: '', image: '' });
      setIsFormModalOpen(false); // Close Modal after save
    } catch (err) {
      setError(err.response?.data?.message || 'ප්‍රශ්නයක් සිදු විය.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock || 0,
      description: product.description || '',
      image: product.image || product.imageUrl || product.img || ''
    });
    setIsFormModalOpen(true); // Open modal on edit
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteExecute = async () => {
    if (!productToDelete) return;
    setDeleting(true);

    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      alert('නිෂ්පාදනය මකා දැමීමට නොහැකි විය.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Professional Right-Aligned Add Product Button */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Product Management (Admin)</h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage store inventory, prices, and product details</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', price: '', category: '', stock: '', description: '', image: '' });
            setIsFormModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm inline-flex items-center gap-2 cursor-pointer"
        >
          <span>+</span> Add Product
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs">{error}</div>}

      {/* Products List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <th className="p-3.5">Image</th>
              <th className="p-3.5">Name</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Price</th>
              <th className="p-3.5">Stock</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">Products කිසිවක් හමු නොවීය.</td>
              </tr>
            ) : (
              products.map((product) => {
                const imgUrl = product.image || product.imageUrl || product.img;
                return (
                  <tr key={product._id} className="hover:bg-gray-50/50">
                    <td className="p-3.5">
                      {imgUrl ? (
                        <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden p-0.5">
                          <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded">No Image</span>
                      )}
                    </td>
                    <td className="p-3.5 font-semibold text-gray-800">{product.name}</td>
                    <td className="p-3.5 text-gray-500">{product.category || 'General'}</td>
                    <td className="p-3.5 text-gray-700 font-medium">${product.price}</td>
                    <td className="p-3.5 text-gray-700">{product.stock}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-lg transition cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ⭐ Professional Add / Edit Product Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 border border-gray-100">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-800 text-base">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Electronic"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  placeholder="Enter product description..."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Custom Delete Confirmation Modal Popup */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">Delete Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                "<span className="font-semibold text-gray-700">{productToDelete?.name}</span>" නිෂ්පාදනය සදාකාලිකවම මකා දැමීමට අවශ්‍ය බව ස්ථිරද?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExecute}
                disabled={deleting}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 cursor-pointer"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}