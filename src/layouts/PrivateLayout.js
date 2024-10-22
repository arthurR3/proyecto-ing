import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Components/footer/Footer.js';
import NavBarAdmin from '../Components/nav/NavBarAdmin.js';

function PrivateLayout({ children }) {
  return (
    <>
      <NavBarAdmin />
      <div className='mt-32 py-42'>
        {children || <Outlet />}
      </div>
      <Footer/>
    </>
  );
}

{/* 
      <aside className="w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 bg-gray-800 text-white">
          <span className="text-2xl font-semibold">Logo</span>
        </div>
        <nav className="mt-6">
          <div className="px-3 space-y-1">
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md">
              <Home className="mr-3" size={20} />
              Home
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md">
              <Users className="mr-3" size={20} />
              Users
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md">
              <Settings className="mr-3" size={20} />
              Settings
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800 rounded-md">
              <HelpCircle className="mr-3" size={20} />
              Help
            </a>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Search className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    type="search"
                    placeholder="Search..."
                  />
                </div>
              </div>
              <div className="flex items-center">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User avatar"
                  />
                  <span className="ml-2">John Doe</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}*/}
export default PrivateLayout;



