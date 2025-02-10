"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import TableCard from '@/components/TableCard';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ERROR } from '@/utils/errorMessage';
import { FaPen, FaTrash } from 'react-icons/fa';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(()=>{
    if(!isModalOpen){
      setSelectedCategory(null);
    }
  },[isModalOpen])

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    if (error) {
      console.error('Error fetching categories:', error.message);
    } else {
      setCategories(data);
    }
    setIsLoading(false);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);
    if (error) {
      throw new Error(error);
    } else {
      fetchCategories(); // Refresh the list
    }
  };

  const handleSubmit = async (values) => {
    if (selectedCategory) {
      // Update existing category
      const { data, error } = await supabase
        .from('categories')
        .update(values)
        .eq('id', selectedCategory.id);
      if (error) {
        console.error('Error updating category:', error.message);
      } else {
        console.log('Category updated:', data);
        fetchCategories(); // Refresh the list
        toast.success('Category updated successfully!');
     
      }
    } else {
      // Add new category
      const { data, error } = await supabase
        .from('categories')
        .insert(values);
      if (error) {
        console.error('Error adding category:', error.message);
      } else {
        fetchCategories(); // Refresh the list
        toast.success('Category added successfully!');
    
      }
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const confirmDelete = ({id}) => {
    setConfirmModal(true);
    setDeleteCategoryId(id)
  }

  const deleteCategory = async () => {
    try {
      await handleDelete(deleteCategoryId);
      setConfirmModal(false);
      toast.success('Category Deleted successfully!');
    } catch (error) {
      toast.error('Error deleting category');
    }
  }

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
  });

  return (
    <div className="p-8">
      <TableCard title="Categories" onAddCategory={() => setIsModalOpen(true)}>
        {isLoading ? (
          <Skeleton count={5} height={40} />
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700" style={{ width: '40%' }}>Description</th>
                <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition duration-200">
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">{category.name}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700" style={{ width: '40%' }}>{category.description}</td>
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                    <button onClick={() => handleEdit(category)} className="text-blue-500 hover:text-blue-700 mr-2"><FaPen/></button>
                    <button onClick={() => confirmDelete(category)} className="text-pink-700 hover:text-pink-900"><FaTrash/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </TableCard>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedCategory ? 'Edit Category' : 'Add Category'}</h2>
            <Formik
              initialValues={{
                name: selectedCategory ? selectedCategory.name : '',
                description: selectedCategory ? selectedCategory.description : '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Category Name"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Field
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Category Description"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
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
      <ConfirmModal 
      isOpen={confirmModal} 
      onClose={() => {
        setConfirmModal(false)
        setDeleteCategoryId(null)
      }} 
      onConfirm={deleteCategory}
       message="Are you sure you want to delete this category?" />
    </div>
  );
};

export default CategoryPage;