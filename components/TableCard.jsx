import React from 'react';
import { FaPlus } from 'react-icons/fa';

const TableCard = ({ title, onAddCategory, children }) => {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <button
          onClick={onAddCategory}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          <FaPlus className="mr-2" />
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto min-h-96">
        {children}
      </div>
    </div>
  );
};

export default TableCard;