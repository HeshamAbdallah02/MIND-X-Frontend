// frontend/src/components/dashboard/pages/home/sections/hero/HeroManager.js
import React from 'react';
import useHeroData from './hooks/useHeroData';
import HeroList from './components/HeroList';

const HeroManager = () => {
  const { 
    contents, 
    isLoading, 
    fetchContents, 
    deleteContent, 
    updateOrder 
  } = useHeroData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBB859]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-content mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#606161]">
          Manage Hero Content
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>

        <HeroList
          contents={contents}
          onDelete={deleteContent}
          onReorder={updateOrder}
          onSuccess={fetchContents}
        />
      </div>
    </div>
  );
};

export default HeroManager;