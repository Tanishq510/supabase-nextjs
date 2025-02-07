// app/product/page.js
'use client'; // Mark this as a Client Component
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '@/utils/supabase';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  status: Yup.string().required('Status is required'),
  description: Yup.string().required('Description is required'),
});

export default function ProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products,setProduct] = useState([])

  useEffect(()=>{
    fetchProducts()
  },[])

  const fetchProducts =  async ()=>{
    try {
    let { data: products, error } = await supabase
    .from('products')
    .select(`
    *,
    categories (
      id,
      name
    )
  `)
    console.log('---------->',products)

    setProduct(products)
    } catch (error) {
      console.log(error)
    }
  }

  // Handler for form submission
  const handleSubmit = (values) => {
    console.log('Form Values:', values);
    setIsModalOpen(false); // Close the modal after submission
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Product
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.categories.name}
                </td>
               
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsModalOpen(false)} // Close modal when clicking outside
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out opacity-0 scale-95"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
            onAnimationEnd={(e) => {
              if (e.animationName === 'fadeOut') {
                setIsModalOpen(false); // Close modal after fade-out animation
              }
            }}
            style={{
              animation: isModalOpen ? 'fadeIn 0.3s ease-in-out forwards' : 'fadeOut 0.3s ease-in-out forwards',
            }}
          >
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <Formik
              initialValues={{ name: '', status: '', description: '' }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      name="name"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}