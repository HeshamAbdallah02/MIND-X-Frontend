import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../../../../../../utils/api';
import { toast } from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  position: Yup.string().required('Required'),
  feedback: Yup.string().required('Required'),
  image: Yup.object().shape({
    url: Yup.string().url('Invalid URL').required('Required'),
    alt: Yup.string()
  }),
  profileUrl: Yup.string().url('Invalid URL'),
  active: Yup.boolean()
});

const TestimonialForm = ({ initialData, onSuccess, onCancel }) => {
  const isEdit = !!initialData;
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData);
      setFieldValue('image.url', response.data.url);
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: initialData?.name || '',
        position: initialData?.position || '',
        feedback: initialData?.feedback || '',
        image: {
          url: initialData?.image?.url || '',
          alt: initialData?.image?.alt || ''
        },
        profileUrl: initialData?.profileUrl || '',
        active: initialData?.active || false
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const method = isEdit ? 'put' : 'post';
          const url = isEdit ? `/testimonials/${initialData._id}` : '/testimonials';
          
          await api[method](url, values);
          onSuccess();
          toast.success(`Testimonial ${isEdit ? 'updated' : 'created'}`);
        } catch (error) {
          toast.error('Operation failed');
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Full Name
              </label>
              <Field
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Position/Role
              </label>
              <Field
                name="position"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#606161] mb-1">
              Feedback
            </label>
            <Field
              as="textarea"
              name="feedback"
              rows="3"
              className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Profile Image URL
              </label>
              <div className="flex gap-2">
                <Field
                  name="image.url"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
                  disabled={isUploading}
                />
                <label className={`px-4 py-2 ${
                  isUploading ? 'bg-[#81C99C]/70' : 'bg-[#81C99C]'
                } text-white rounded-lg cursor-pointer ${
                  isUploading ? 'pointer-events-none' : 'hover:bg-[#6ba986]'
                } transition-colors flex items-center gap-2`}>
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiUpload className="inline mr-2" />
                  )}
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleImageUpload(e.target.files[0], setFieldValue);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Image Alt Text
              </label>
              <Field
                name="image.alt"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#606161] mb-1">
              Profile URL
            </label>
            <Field
              name="profileUrl"
              className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Field
              type="checkbox"
              name="active"
              className="w-4 h-4 text-[#81C99C] rounded focus:ring-[#81C99C]"
            />
            <label className="text-sm text-[#606161]">
              Active (Max 5)
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-[#606161] hover:text-[#81C99C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#81C99C] text-white rounded-lg hover:bg-[#6ba986] transition-colors"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default TestimonialForm;