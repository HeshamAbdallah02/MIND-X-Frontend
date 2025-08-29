// frontend/src/components/dashboard/pages/home/sections/stats/StatsManager.js
import React, { useState } from 'react';
import { useSettings } from '../../../../../../context/BrandSettingsContext';
import useStatsData from './hooks/useStatsData';
import StatsForm from './components/StatsForm';
import ColorSettingsForm from '../../../../shared/ColorSettingsForm';
import api from '../../../../../../utils/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';

const StatsManager = () => {
  const { settings, updateSettings } = useSettings();
  const { stats, deleteStat, createStat, updateStat } = useStatsData();
  const [activeStat, setActiveStat] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSavingColors, setIsSavingColors] = useState(false);

  const maxStatsReached = stats?.length >= 7;

  // Handle saving color settings
  const handleSaveColors = async (newColors) => {
    setIsSavingColors(true);
    try {
      // Merge existing settings with updated statsColors
      await api.put('/settings', { statsColors: newColors });

      // Update context with the server response
      updateSettings({ statsColors: newColors });
      toast.success('Color scheme updated');
    } catch (error) {
      console.error('Color save error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to save color changes');
    } finally {
      setIsSavingColors(false);
    }
  };

  // Handle deleting a stat using the mutation hook
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;
    try {
      await deleteStat.mutateAsync(id);
      toast.success('Stat deleted');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 max-w-content mx-auto px-4">
      {/* Style Controls Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <ColorSettingsForm
          initialValues={settings?.statsColors || {}}
          onSave={handleSaveColors}
          isSaving={isSavingColors}
          fields={[
            { 
              label: 'Background Color',
              name: 'sectionBackground', 
              type: 'color' 
            },
            { 
              label: 'Title Color',      
              name: 'titleColor',       
              type: 'color' 
            },
            { 
              label: 'Icon Color',       
              name: 'iconColor',        
              type: 'color' 
            },
            { 
              label: 'Number Color',     
              name: 'numberColor',      
              type: 'color' 
            },
            { 
              label: 'Text Color',       
              name: 'textPrimary',      
              type: 'color' 
            }
          ]}
        />
      </div>

      {/* Statistics Management Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#606161]">
          Manage Statistics
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {stats?.map((stat) => (
            <div
              key={stat._id}
              className={`p-6 rounded-2xl transition-all duration-300 ${
                activeStat?._id === stat._id
                  ? 'border-2 border-[#FBB859] bg-[#FBB859]/05 shadow-lg'
                  : 'border border-[#606161]/10 hover:border-[#81C99C]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-4xl font-bold text-[#FBB859] mb-1">
                    {stat.number}
                  </p>
                  <h3 className="text-lg font-semibold text-[#606161]">
                    {stat.label}
                  </h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setActiveStat(activeStat?._id === stat._id ? null : stat)
                    }
                    className="p-2 rounded-lg hover:bg-[#81C99C]/10 text-[#606161] hover:text-[#FBB859] transition-colors"
                  >
                    <FiEdit className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(stat._id)}
                    className="p-2 rounded-lg hover:bg-red-100/50 text-[#606161] hover:text-red-500 transition-colors"
                  >
                    <FiTrash className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Edit Stat Form */}
              {activeStat?._id === stat._id && (
                <div className="pt-4 mt-4 border-t border-[#606161]/10">
                  <StatsForm
                    initialData={stat}
                    updateStat={updateStat}
                    onSuccess={() => {
                      setActiveStat(null);
                    }}
                    onCancel={() => setActiveStat(null)}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Add New Stat Card */}
          <div
            className={`p-6 border-3 border-dashed rounded-2xl transition-all duration-300 ${
              maxStatsReached
                ? 'border-gray-300 cursor-not-allowed'
                : `${isAddingNew ? 'border-[#FBB859] bg-[#FBB859]/10' : 'border-[#81C99C]/30 hover:border-[#81C99C]'} cursor-pointer hover:shadow-lg group`
            }`}
            onClick={() => {
              if (!maxStatsReached) setIsAddingNew(true);
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <FiPlus
                className={`w-10 h-10 transition-transform ${
                  maxStatsReached ? 'text-gray-400' : 'text-[#81C99C] group-hover:rotate-90'
                }`}
              />
              <span
                className={`text-lg font-medium ${
                  maxStatsReached ? 'text-gray-400' : 'text-[#606161] group-hover:text-[#81C99C]'
                }`}
              >
                {maxStatsReached ? 'Maximum 7 statistics reached' : 'Add New Statistic'}
              </span>
            </div>
          </div>

          {/* Add New Stat Form */}
          {isAddingNew && (
            <div className="col-span-full mt-6 p-6 border-2 border-[#81C99C] rounded-2xl bg-[#81C99C]/05">
              <StatsForm
                initialData={null}
                createStat={createStat}
                onSuccess={() => {
                  setIsAddingNew(false);
                }}
                onCancel={() => setIsAddingNew(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsManager;
