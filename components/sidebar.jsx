"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FaHome, FaSearch, FaSitemap, FaRegUser, FaFileInvoice, FaThumbtack } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handlePinClick = () => {
    setIsPinned(!isPinned);
    setIsExpanded(!isPinned);
  };

  const handleLinkClick = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const menuItems = [
    { href: "/", icon: <FaHome className="text-xl" />, label: "Dashboard" },
    { href: "/category", icon: <MdOutlineCategory className="text-xl" />, label: "Category" },
    { href: "/product", icon: <FaSitemap className="text-xl" />, label: "Product" },
    { href: "/customers", icon: <FaRegUser className="text-xl" />, label: "Customers" },
    { href: "/invoices", icon: <FaFileInvoice className="text-xl" />, label: "Invoices" },
  ];

  const filteredItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex min-h-screen">
      <div 
        className={`flex flex-col h-screen bg-gray-800 text-white transition-width duration-300 ${isExpanded ? 'w-80 shadow-lg' : 'w-20'} ${isPinned ? 'shadow-lg' : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className={`text-2xl font-bold transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>BCRM</h1>
        </div>
        <nav className="flex-grow p-4">
          <div className="flex items-center bg-gray-700 rounded px-4 py-2 mb-4" onClick={handleSearchClick}>
            <FaSearch className="text-gray-400"/>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className={`bg-gray-700 text-white ml-2 focus:outline-none transition-width duration-300 ${isExpanded ? 'w-full' : 'w-0'}`}
            />
          </div>
          <ul className="space-y-2">
            {filteredItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-700 rounded" onClick={handleLinkClick}>
                  <span className="text-xl">{item.icon}</span>
                  <span className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div 
        className={`absolute top-4 left-${isExpanded ? '80' : '20'} transition-all duration-300 transform ${isPinned ? 'rotate-45' : 'rotate-0'}`}
        onClick={handlePinClick}
      >
        <FaThumbtack className={`text-2xl cursor-pointer ${isPinned ? 'text-yellow-500' : 'text-white'}`} />
      </div>
    </div>
  );
};

export default Sidebar;