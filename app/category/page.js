// app/categories/page.js
'use client'; // Mark this as a Client Component
import React, { useEffect, useState, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { supabase } from '@/utils/supabase';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
});

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  // Fetch categories from Supabase
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(()=>{
    if(!isModalOpen){
      setSelectedCategory(null)
    }
  },[isModalOpen])

  const fetchCategories = async () => {
    try {
      let { data: categories, error } = await supabase
        .from('categories')
        .select();
      setCategories(categories);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              info.getValue() === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: (info) => info.getValue(),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <div>
            <button
              onClick={() => handleEdit(info.row.original)}
              className="text-blue-500 hover:text-blue-700 mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(info.row.original)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Initialize React Table
  const table = useReactTable({
    data: categories,
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  // Edit functionality
  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  // Delete functionality
  const handleDelete = async (category) => {
    console.log('------->',category)
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', category.id);
    if (error) {
      console.error('Error deleting category:', error.message);
    } else {
      console.log('Category deleted:', category.id);
      fetchCategories(); // Refresh the list
    }
  };

  // Form submission handler
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
      }
    } else {
      // Add new category
      const { data, error } = await supabase
        .from('categories')
        .insert([values]);
      if (error) {
        console.error('Error adding category:', error.message);
      } else {
        console.log('Category added:', data);
        fetchCategories(); // Refresh the list
      }
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="p-8">
     <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Category
        </button>
    </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Next
        </button>
      </div>

      {/* Modal (same as before) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md transform transition-all duration-300 ease-in-out opacity-0 scale-95"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: isModalOpen
                ? 'fadeIn 0.3s ease-in-out forwards'
                : 'fadeOut 0.3s ease-in-out forwards',
            }}
          >
            <h2 className="text-xl font-bold mb-4">
              {selectedCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <Formik
              initialValues={{
                name: selectedCategory ? selectedCategory.name : '',
                status: selectedCategory ? selectedCategory.status : '',
                description: selectedCategory ? selectedCategory.description : '',
              }}
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