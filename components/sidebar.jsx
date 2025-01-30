// components/Sidebar.js
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 bg-gray-900">
        <h1 className="text-2xl font-bold">Logo</h1>
      </div>
      <nav className="flex-grow p-4">
        <ul className="space-y-2">
        <li>
            <Link href="/" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/category" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Category
            </Link>
          </li>
          <li>
            <Link href="/product" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Product
            </Link>
          </li>
          <li>
            <Link href="/services" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Leads
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Stock
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 bg-gray-900">
        <p className="text-sm">© 2025 BCRM</p>
      </div>
    </div>
  );
};

export default Sidebar;