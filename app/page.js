"use client"
import { useState } from 'react';
import { FaBox, FaClipboardList, FaUsers, FaShoppingCart, FaFileInvoice } from "react-icons/fa";
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

export default function Home() {
  const [filter, setFilter] = useState('monthly');

  const cards = [
    { name: "Category", number: 10, icon: <FaClipboardList className="text-4xl text-blue-500" />, gradient: "from-blue-100 to-blue-200" },
    { name: "Product", number: 50, icon: <FaBox className="text-4xl text-green-500" />, gradient: "from-green-100 to-green-200" },
    { name: "Customers", number: 200, icon: <FaUsers className="text-4xl text-purple-500" />, gradient: "from-purple-100 to-purple-200" },
    { name: "Order", number: 30, icon: <FaShoppingCart className="text-4xl text-red-500" />, gradient: "from-red-100 to-red-200" },
    { name: "Invoice", number: 15, icon: <FaFileInvoice className="text-4xl text-yellow-500" />, gradient: "from-yellow-100 to-yellow-200" },
  ];

  const data = {
    monthly: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Rupees',
          data: [3000, 2000, 4000, 5000, 6000, 7000, 8000],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Rupees',
          data: [1000, 1500, 2000, 2500],
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    },
    yearly: {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Rupees',
          data: [20000, 25000, 30000, 35000, 40000, 45000],
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgba(255, 159, 64, 1)',
          borderWidth: 1,
        },
      ],
    },
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Rupees Over Time',
      },
    },
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-lg shadow-lg bg-gradient-to-r ${card.gradient} text-gray-800 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{card.name}</h2>
              {card.icon}
            </div>
            <p className="text-4xl font-semibold">{card.number}</p>
          </div>
        ))}
      </div>
    </div>
  );
}