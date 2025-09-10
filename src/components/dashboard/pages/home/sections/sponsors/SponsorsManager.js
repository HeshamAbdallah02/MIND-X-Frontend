// frontend/src/components/dashboard/pages/home/sections/sponsors/SponsorsManager.js
import React, { useState, useCallback } from 'react';
import { useSettings } from '../../../../../../context/BrandSettingsContext';
import useSponsorsData from './hooks/useSponsorsData';
import SponsorForm from './components/SponsorForm';
import ColorSettingsForm from '../../../../shared/ColorSettingsForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../../../../../utils/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash, FiToggleLeft, FiToggleRight, FiGrid } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

const SponsorsManager = () => {
  const { settings, updateSettings } = useSettings();
  const { sponsors, partners, mutate, deleteSponsor, createSponsor, updateSponsor, reorderSponsors } = useSponsorsData();
  const [activeSponsor, setActiveSponsor] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeTab, setActiveTab] = useState('sponsors');
  const [loadingStates, setLoadingStates] = useState({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (newSettings) => {
    setIsSavingSettings(true);
    try {
      const response = await api.put('/settings', {
        sponsorsColors: {
          sectionBackground: newSettings.sectionBackground,
          titleColor: newSettings.titleColor,
          sponsorsSpeed: Math.round(Math.max(50, Math.min(300, newSettings.sponsorsSpeed || 80))),
          partnersSpeed: Math.round(Math.max(50, Math.min(300, newSettings.partnersSpeed || 80)))
        }
      });
  
      if (response.data) {
        updateSettings({
          ...settings,
          sponsorsColors: response.data.sponsorsColors
        });
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      const errorMessages = error.response?.data?.details?.map(d => d.message) || [];
      const errorMessage = errorMessages.join(', ') || 'Failed to save settings';
      toast.error(errorMessage);
      console.error('Settings update error:', error);
    } finally {
      setIsSavingSettings(false); // End loading
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sponsor?')) {
      try {
        await deleteSponsor.mutateAsync(id);
        toast.success('Sponsor deleted');
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleToggleActive = async (id) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
      await api.patch(`/sponsors/${id}/active`);
      await mutate();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDragEnd = useCallback(async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.index === destination.index) {
      return; // Item dropped in the same position
    }

    // Get the current items being reordered
    const items = Array.from(activeTab === 'sponsors' ? sponsors : partners);
    const [movedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, movedItem);

    // Create the reorder data for the API
    const reorderData = items.map((item, index) => ({
      id: item._id,
      order: index
    }));

    // Execute reorder using React Query optimistic updates
    reorderSponsors.mutate(reorderData);
  }, [activeTab, sponsors, partners, reorderSponsors]);

  const currentItems = activeTab === 'sponsors' ? sponsors : partners;

  return (
    <div className="space-y-8 max-w-content mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <ColorSettingsForm 
          initialValues={{
            ...settings?.sponsorsColors,
            sponsorsSpeed: settings?.sponsorsColors?.sponsorsSpeed || 80,
            partnersSpeed: settings?.sponsorsColors?.partnersSpeed || 80
          }}
          onSave={handleSaveSettings}
          fields={[
            {
              label: 'Section Background',
              name: 'sectionBackground',
              type: 'color'
            },
            {
              label: 'Title Color',
              name: 'titleColor',
              type: 'color'
            },
            {
              label: 'Sponsors Speed',
              name: 'sponsorsSpeed', 
              type: 'range',
              config: {
                min: 50,
                max: 300,
                step: 10,
                format: (value) => `${value} pixels/sec`
              }
            },
            {
              label: 'Partners Speed',
              name: 'partnersSpeed',
              type: 'range',
              config: {
                min: 50,
                max: 300,
                step: 10,
                format: (value) => `${value} pixels/sec`
              }
            }
          ]}
          isSaving={isSavingSettings} 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-[#606161]">
            Manage Sponsors & Partners
            <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
          </h2>
          
          <div className="flex gap-2 bg-[#606161]/10 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('sponsors')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'sponsors' 
                  ? 'bg-white text-[#606161] shadow-sm' 
                  : 'text-[#606161]/70 hover:bg-[#606161]/05'
              }`}
            >
              Sponsors ({sponsors?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'partners' 
                  ? 'bg-white text-[#606161] shadow-sm' 
                  : 'text-[#606161]/70 hover:bg-[#606161]/05'
              }`}
            >
              Partners ({partners?.length || 0})
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sponsors">
            {(provided) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 gap-4"
              >
                {currentItems?.map((sponsor, index) => (
                  <Draggable 
                    key={sponsor._id}
                    draggableId={sponsor._id}
                    index={index}
                    isDragDisabled={reorderSponsors.isPending}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transition: 'all 0.2s ease-out'
                        }}
                        className={`p-6 rounded-2xl transition-all duration-300 ${
                          activeSponsor?._id === sponsor._id 
                            ? 'border-2 border-[#FBB859] bg-[#FBB859]/05 shadow-lg'
                            : 'border border-[#606161]/10 hover:border-[#81C99C]/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            {...provided.dragHandleProps}
                            className="cursor-move hover:bg-[#606161]/10 p-1 rounded-lg"
                          >
                            {reorderSponsors.isPending ? (
                              <FaSpinner className="w-5 h-5 text-[#606161] animate-spin" />
                            ) : (
                              <FiGrid className="w-5 h-5 text-[#606161]" />
                            )}
                          </div>
                          
                          <div className="flex-1 mx-4">
                            <div className="flex items-center gap-4">
                              <img 
                                src={sponsor.logo.url} 
                                alt={sponsor.logo.alt} 
                                className="w-12 h-12 object-contain"
                              />
                              <div>
                                <h3 className="text-lg font-semibold text-[#606161]">
                                  {sponsor.name}
                                </h3>
                                <a
                                  href={sponsor.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-[#81C99C] hover:underline"
                                >
                                  {new URL(sponsor.website).hostname}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleToggleActive(sponsor._id)}
                              disabled={loadingStates[sponsor._id]}
                              className={`p-2 rounded-lg transition-colors ${
                                sponsor.active
                                  ? 'text-[#81C99C] hover:bg-[#81C99C]/10'
                                  : 'text-[#606161]/50 hover:bg-[#606161]/10'
                              } ${loadingStates[sponsor._id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {loadingStates[sponsor._id] ? (
                                <div className="w-5 h-5 border-2 border-[#606161]/30 border-t-[#81C99C] rounded-full animate-spin" />
                              ) : sponsor.active ? (
                                <FiToggleRight className="w-6 h-6" />
                              ) : (
                                <FiToggleLeft className="w-6 h-6" />
                              )}
                            </button>
                            <button
                              onClick={() => setActiveSponsor(
                                activeSponsor?._id === sponsor._id ? null : sponsor
                              )}
                              className="p-2 rounded-lg hover:bg-[#81C99C]/10 text-[#606161] hover:text-[#FBB859]"
                            >
                              <FiEdit className="w-6 h-6" />
                            </button>
                            <button
                              onClick={() => handleDelete(sponsor._id)}
                              className="p-2 rounded-lg hover:bg-red-100/50 text-[#606161] hover:text-red-500"
                            >
                              <FiTrash className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {activeSponsor?._id === sponsor._id && (
                          <div className="pt-4 mt-4 border-t border-[#606161]/10">
                            <SponsorForm 
                              type={activeTab.slice(0, -1)}
                              initialData={sponsor}
                              updateSponsor={updateSponsor}
                              onSuccess={() => {
                                setActiveSponsor(null);
                              }}
                              onCancel={() => setActiveSponsor(null)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div 
          className={`mt-6 p-6 border-3 border-dashed rounded-2xl transition-all duration-300 ${
            isAddingNew 
              ? 'border-[#FBB859] bg-[#FBB859]/10' 
              : 'border-[#81C99C]/30 hover:border-[#81C99C] cursor-pointer hover:shadow-lg group'
          }`}
          onClick={() => !isAddingNew && setIsAddingNew(true)}
        >
          {isAddingNew ? (
            <div className="col-span-full p-6">
              <SponsorForm 
                type={activeTab.slice(0, -1)}
                initialData={null}
                createSponsor={createSponsor}
                onSuccess={() => {
                  setIsAddingNew(false);
                }}
                onCancel={() => setIsAddingNew(false)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <FiPlus className="w-10 h-10 text-[#81C99C] group-hover:rotate-90 transition-transform" />
              <span className="text-lg font-medium text-[#606161] group-hover:text-[#81C99C]">
                Add New {activeTab.slice(0, -1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SponsorsManager;