'use client';

import { useState, useEffect } from 'react';
import {
  getAllProductsForAdmin,
  deleteProduct,
  updateProduct,
  createProduct,
  uploadProductImages,
  uploadProductMedia, // Add this import
  deleteProductImage,
  setPrimaryImage,
  getAllCategories,
} from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link'; // Add this import
import { FaEdit, FaTrash, FaPlus, FaImage, FaStar } from 'react-icons/fa';

interface ProductImage {
  id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category_id?: string; // Make sure this is category_id, not category
  stock_quantity?: number;
  created_at: string;
  product_images: ProductImage[];
}

// Add Category interface
interface Category {
  id: string;
  name: string;
}

interface ProductFormData {
  name: string;
  price: number;
  description: string;
  category_id: string; // Changed from 'category' to 'category_id'
  stock_quantity: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    category_id: '',
    stock_quantity: 0,
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [mediaFiles, setMediaFiles] = useState<FileList | null>(null); // Add this line
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Add this line
    
    // Set up 60-second revalidation
    const interval = setInterval(() => {
      fetchProducts();
      fetchCategories();
    }, 60000); // 60 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Add fetchCategories function
  const fetchCategories = async () => {
    try {
      const { data, error } = await getAllCategories();
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await getAllProductsForAdmin();
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this product? This will also delete all associated images.'
      )
    ) {
      return;
    }

    try {
      const { error } = await deleteProduct(productId);
      if (error) throw error;

      setProducts(products.filter((p) => p.id !== productId));
      alert('Product deleted successfully!');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
      category_id: product.category_id || '',
      stock_quantity: product.stock_quantity || 0,
    });
  };

  const handleSave = async () => {
    if (!editingProduct) return;

    try {
      // Create an object with only the changed fields
      const changedFields: any = {};

      // Compare each field and only include changed ones
      if (formData.name !== editingProduct.name) {
        changedFields.name = formData.name;
      }
      if (formData.price !== editingProduct.price) {
        changedFields.price = formData.price;
      }
      if (formData.description !== (editingProduct.description || '')) {
        changedFields.description = formData.description;
      }
      if (formData.category_id !== (editingProduct.category_id || '')) {
        changedFields.category_id = formData.category_id; // Changed from 'category' to 'category_id'
      }
      if (formData.stock_quantity !== (editingProduct.stock_quantity || 0)) {
        changedFields.stock_quantity = formData.stock_quantity;
      }

      // Only update if there are actual changes
      if (Object.keys(changedFields).length > 0) {
        console.log('Updating product with changed fields:', changedFields);
        console.log('Product ID:', editingProduct.id);

        const { data, error } = await updateProduct(
          editingProduct.id,
          changedFields
        );

        console.log('Update response:', { data, error });

        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }
      } else {
        console.log('No changes detected in product data');
      }

      // Handle image uploads if any
      if (imageFiles && imageFiles.length > 0) {
        await handleImageUploads(editingProduct.id);
      }

      // Handle media uploads if any (updated to use mediaFiles)
      if (mediaFiles && mediaFiles.length > 0) {
        await handleMediaUploads(editingProduct.id);
      }

      await fetchProducts();
      setEditingProduct(null);
      setMediaFiles(null); // Updated from setImageFiles

      if (
        Object.keys(changedFields).length > 0 ||
        (mediaFiles && mediaFiles.length > 0) // Updated from imageFiles
      ) {
        alert('Product updated successfully!');
      } else {
        alert('No changes to save');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert(
        `Error updating product: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      );
    }
  };

  // Update the handleImageUploads function to use the new API
  const handleImageUploads = async (
    productId: string,
    primaryIndex: number = 0
  ) => {
    if (!imageFiles) return;

    setUploading(true);
    try {
      // Use the new bulk upload function
      const result = await uploadProductImages(
        imageFiles,
        productId,
        primaryIndex
      );

      if (result.errors && result.errors.length > 0) {
        console.error('Some images failed to upload:', result.errors);
        alert(
          `${result.data.length} images uploaded successfully, ${result.errors.length} failed`
        );
      } else {
        console.log('All images uploaded successfully:', result.data);
      }

      return result;
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Update handleMediaUploads to handleMediaUploads
  const handleMediaUploads = async (
    productId: string,
    primaryIndex: number = 0
  ) => {
    if (!mediaFiles) return;

    setUploading(true);
    try {
      // Use the new bulk upload function for both images and videos
      const result = await uploadProductMedia(
        mediaFiles,
        productId,
        primaryIndex
      );

      if (result.errors && result.errors.length > 0) {
        console.error('Some media files failed to upload:', result.errors);
        alert(
          `${result.data.length} files uploaded successfully, ${result.errors.length} failed`
        );
      } else {
        console.log('All media files uploaded successfully:', result.data);
      }

      return result;
    } catch (error) {
      console.error('Error uploading media files:', error);
      alert('Error uploading media files');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Remove this entire duplicate function (lines 264-330):
  // Update handleSave function
  // const handleSave = async () => {
  //   if (!editingProduct) return;
  //   ... (entire duplicate function)
  // };

  // Update handleCreate function
  const handleCreate = async () => {
    try {
      // Step 1: Submit the Product
      console.log('Step 1: Creating product with data:', formData);
      const { data: productData, error: productError } =
        await createProduct(formData);

      if (productError) {
        console.error('Error creating product:', productError);
        throw productError;
      }

      if (!productData) {
        throw new Error('Product creation failed - no data returned');
      }

      console.log('Product created successfully with ID:', productData.id);
      const productId = productData.id;

      // Step 2: Handle media uploads if any files are selected
      if (mediaFiles && mediaFiles.length > 0) {
        console.log(
          `Step 2: Processing ${mediaFiles.length} media files for product ${productId}`
        );

        const result = await handleMediaUploads(productId, 0);

        if (result && result.errors && result.errors.length > 0) {
          console.error('Media upload errors:', result.errors);
          alert(
            `Product created successfully! ${result.data.length} files uploaded, ${result.errors.length} failed.`
          );
        } else if (result) {
          console.log('All media files uploaded successfully');
        }
      }

      // Step 3: Return Success Response
      console.log('Step 3: Refreshing products list and resetting form...');
      await fetchProducts();
      setShowCreateForm(false);
      setFormData({
        name: '',
        price: 0,
        description: '',
        category_id: '',
        stock_quantity: 0,
      });
      setMediaFiles(null);

      alert('Product created successfully!');
      console.log('Product creation workflow completed successfully');
    } catch (error) {
      console.error('Error in product creation process:', error);
      alert(
        `Error creating product: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
      );
    }
  };

  const handleDeleteImage = async (imageId: string, productId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await deleteProductImage(imageId);
      if (error) throw error;

      // Update the main products list
      await fetchProducts();

      // Update the editingProduct state to reflect changes immediately
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct({
          ...editingProduct,
          product_images: editingProduct.product_images.filter(
            (img) => img.id !== imageId
          ),
        });
      }

      alert('Image deleted successfully!');
    } catch (error: unknown) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleSetPrimary = async (productId: string, imageId: string) => {
    try {
      const { error } = await setPrimaryImage(productId, imageId);
      if (error) throw error;

      // Update the main products list
      await fetchProducts();

      // Update the editingProduct state to reflect changes immediately
      if (editingProduct && editingProduct.id === productId) {
        setEditingProduct({
          ...editingProduct,
          product_images: editingProduct.product_images.map((img) => ({
            ...img,
            is_primary: img.id === imageId,
          })),
        });
      }

      alert('Primary image updated!');
    } catch (error: unknown) {
      console.error('Error setting primary image:', error);
      alert('Error setting primary image');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 mt-30">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Manage Products
              </h1>
              <p className="text-gray-600 mt-2">
                Add, edit, and manage your jewelry products
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Link
                href="/admin"
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center"
              >
                Back to Dashboard
              </Link>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  setFormData({
                    name: '',
                    price: 0,
                    description: '',
                    category_id: '',
                    stock_quantity: 0,
                  });
                  setMediaFiles(null);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FaPlus /> Add New Product
              </button>
            </div>
          </div>

          {/* Products Table - Mobile Responsive */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Mobile View */}
            <div className="block sm:hidden">
              <div className="divide-y divide-gray-200">
                {products.map((product) => {
                  const primaryImage = product.product_images.find(
                    (img) => img.is_primary
                  );
                  return (
                    <div key={product.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt_text || product.name}
                              width={60}
                              height={60}
                              className="w-15 h-15 object-cover rounded"
                            />
                          ) : (
                            <div className="w-15 h-15 bg-gray-200 rounded flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ${product.price} • Stock:{' '}
                            {product.stock_quantity || 0}
                          </p>
                          <p className="text-xs text-gray-400">
                            {product.product_images.length} image(s) •{' '}
                            {new Date(product.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-900 text-sm flex items-center gap-1"
                            >
                              <FaEdit size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-900 text-sm flex items-center gap-1"
                            >
                              <FaTrash size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const primaryImage = product.product_images.find(
                      (img) => img.is_primary
                    );
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {primaryImage ? (
                            <Image
                              src={primaryImage.url}
                              alt={primaryImage.alt_text || product.name}
                              width={50}
                              height={50}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <FaImage className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock_quantity || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.product_images.length} image(s)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(product.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-900 mr-4 flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add New Images/Videos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFiles(e.target.files)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>

              {/* Current Images */}
              {editingProduct.product_images.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {editingProduct.product_images.map((image) => (
                      <div key={image.id} className="relative">
                        <Image
                          src={image.url}
                          alt={image.alt_text || 'Product image'}
                          width={100}
                          height={100}
                          className="w-full h-20 object-cover rounded"
                        />
                        <div className="absolute top-1 right-1 flex gap-1">
                          {!image.is_primary && (
                            <button
                              type="button"
                              onClick={() =>
                                handleSetPrimary(editingProduct.id, image.id)
                              }
                              className="bg-yellow-500 text-white p-1 rounded text-xs hover:bg-yellow-600"
                              title="Set as primary"
                            >
                              <FaStar size={10} />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteImage(image.id, editingProduct.id)
                            }
                            className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                            title="Delete image"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                        {image.is_primary && (
                          <div className="absolute bottom-1 left-1 bg-yellow-500 text-white px-1 py-0.5 rounded text-xs">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setMediaFiles(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Product</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreate();
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) =>
                      setFormData({ ...formData, category_id: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images/Videos
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setMediaFiles(e.target.files)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Select multiple images or videos. The first image will be set
                  as primary.
                </p>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      name: '',
                      price: 0,
                      description: '',
                      category_id: '',
                      stock_quantity: 0,
                    });
                    setMediaFiles(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
