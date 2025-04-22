// frontend/src/components/dashboard/pages/home/sections/testimonials/TestimonialsManager.js
import React, { useState } from 'react';
import { useSettings } from '../../../../../../context/BrandSettingsContext';
import useTestimonialsData from './hooks/useTestimonialsData';
import TestimonialForm from './components/TestimonialForm';
import ColorSettingsForm from '../../../../shared/ColorSettingsForm';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../../../../../utils/api';
import { toast } from 'react-hot-toast';
import { FiPlus, FiEdit, FiTrash, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const TestimonialsManager = () => {
  const { settings, updateSettings } = useSettings();
  const { testimonials, mutate } = useTestimonialsData();
  const [activeTestimonial, setActiveTestimonial] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const activeCount = testimonials?.filter(t => t.active).length || 0;

  const handleSaveColors = async (newColors) => {
    try {
      const newSettings = { testimonialsColors: newColors };
      await api.put('/settings', newSettings);
      updateSettings(newSettings);
      toast.success('Color scheme updated');
    } catch (error) {
      toast.error('Failed to save color changes');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        await mutate();
        toast.success('Testimonial deleted');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    if (!currentActive && activeCount >= 5) {
      toast.error('Maximum 5 active testimonials allowed');
      return;
    }

    try {
      await api.patch(`/testimonials/${id}/active`, { 
        active: !currentActive 
      });
      await mutate();
      toast.success('Status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      await Promise.all(
        items.map((testimonial, index) => 
          api.patch(`/testimonials/${testimonial._id}/order`, { order: index })
        )
      );
      await mutate();
    } catch (error) {
      toast.error('Failed to save new order');
    }
  };

  return (
    <div className="space-y-8 max-w-content mx-auto px-4">
      {/* Style Controls Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <ColorSettingsForm 
          initialValues={settings?.testimonialsColors || {}}
          onSave={handleSaveColors}
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
              label: 'Circle Color',
              name: 'circleBorderColor',
              type: 'color'
            },
            {
              label: 'Quote Icon Color',
              name: 'quoteIconColor',
              type: 'color'
            },
            {
              label: 'Quote Icon Background',
              name: 'quoteIconBackground',
              type: 'color'
            },
            {
              label: 'Name Color',
              name: 'nameColor',
              type: 'color'
            },
            {
              label: 'Position Color',
              name: 'positionColor',
              type: 'color'
            },
            {
              label: 'Feedback Background',
              name: 'feedbackBackground',
              type: 'color'
            },
            {
              label: 'Feedback Border Color',
              name: 'feedbackBorderColor',
              type: 'color'
            },
            {
              label: 'Feedback Text Color',
              name: 'feedbackTextColor',
              type: 'color'
            }
          ]}
        />
      </div>

      {/* Content Management Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-[#606161]">
          Manage Testimonials
          <span className="block mt-1 w-12 h-1 bg-[#FBB859] rounded-full" />
        </h2>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="testimonials">
            {(provided, snapshot) => (
              <div 
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 gap-4"
              >
                {testimonials?.map((testimonial, index) => (
                  <Draggable 
                    key={testimonial._id}
                    draggableId={testimonial._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={provided.draggableProps.style}
                        className={`p-6 rounded-2xl transition-all duration-300 ${
                          activeTestimonial?._id === testimonial._id 
                            ? 'border-2 border-[#FBB859] bg-[#FBB859]/05 shadow-lg'
                            : 'border border-[#606161]/10 hover:border-[#81C99C]/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div 
                            {...provided.dragHandleProps}
                            className="cursor-move hover:bg-[#606161]/10 p-1 rounded-lg"
                          >
                            <svg className="w-5 h-5 text-[#606161]" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M9,5H11V7H9V5M13,5H15V7H13V5M9,9H11V11H9V9M13,9H15V11H13V9M9,13H11V15H9V13M13,13H15V15H13V13M9,17H11V19H9V17M13,17H15V19H13V17Z" />
                            </svg>
                          </div>
                          
                          <div className="flex-1 mx-4">
                            <h3 className="text-lg font-semibold text-[#606161]">
                              {testimonial.name}
                            </h3>
                            <p className="text-sm text-[#606161]/70">
                              {testimonial.position}
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleToggleActive(testimonial._id, testimonial.active)}
                              className={`p-2 rounded-lg transition-colors ${
                                testimonial.active
                                  ? 'text-[#81C99C] hover:bg-[#81C99C]/10'
                                  : 'text-[#606161]/50 hover:bg-[#606161]/10'
                              }`}
                            >
                              {testimonial.active ? (
                                <FiToggleRight className="w-6 h-6" />
                              ) : (
                                <FiToggleLeft className="w-6 h-6" />
                              )}
                            </button>
                            <button
                              onClick={() => setActiveTestimonial(
                                activeTestimonial?._id === testimonial._id ? null : testimonial
                              )}
                              className="p-2 rounded-lg hover:bg-[#81C99C]/10 text-[#606161] hover:text-[#FBB859]"
                            >
                              <FiEdit className="w-6 h-6" />
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial._id)}
                              className="p-2 rounded-lg hover:bg-red-100/50 text-[#606161] hover:text-red-500"
                            >
                              <FiTrash className="w-6 h-6" />
                            </button>
                          </div>
                        </div>

                        {activeTestimonial?._id === testimonial._id && (
                          <div className="pt-4 mt-4 border-t border-[#606161]/10">
                            <TestimonialForm 
                              initialData={testimonial}
                              onSuccess={() => {
                                setActiveTestimonial(null);
                                mutate();
                              }}
                              onCancel={() => setActiveTestimonial(null)}
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

        {/* Add New Card */}
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
              <TestimonialForm 
                initialData={null}
                onSuccess={() => {
                  setIsAddingNew(false);
                  mutate();
                }}
                onCancel={() => setIsAddingNew(false)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3">
              <FiPlus className="w-10 h-10 text-[#81C99C] group-hover:rotate-90 transition-transform" />
              <span className="text-lg font-medium text-[#606161] group-hover:text-[#81C99C]">
                Add New Testimonial
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsManager;