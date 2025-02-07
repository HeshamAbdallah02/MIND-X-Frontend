// dashboard/layout/PageLayout.js
import React from 'react';

const PageLayout = ({ sidebarItems, children }) => {
  return (
    <div className="flex">
      {/* Page-specific Sidebar */}
      <div className="w-64 border-r bg-white h-[calc(100vh-64px)] overflow-y-auto">
        <nav className="p-4">
          {sidebarItems.map((section, index) => (
            <div key={index} className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                {section.name}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      onClick={item.onClick}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                        item.isActive
                          ? 'bg-[#81C99C]/10 text-[#81C99C]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;