// frontend/src/components/dashboard/pages/home/sections/sponsors/components/SponsorForm.js
import React, { useState } from 'react';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import FileUpload from '../../../../../shared/FileUpload';
import api from '../../../../../../../utils/api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  type: Yup.string().oneOf(['sponsor', 'partner']).required('Required'),
  website: Yup.string().url('Invalid URL').required('Required'),
  logo: Yup.object().shape({
    url: Yup.string().url('Invalid URL').required('Required'),
    alt: Yup.string()
  }),
  active: Yup.boolean()
});

const SponsorForm = ({ type, initialData, onSuccess, onCancel, createSponsor, updateSponsor }) => {
  const isEdit = !!initialData;
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file, setFieldValue) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': undefined // Let axios set the correct multipart/form-data header
        }
      });
      setFieldValue('logo.url', response.data.url);
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
        type: initialData?.type || type,
        website: initialData?.website || '',
        logo: {
          url: initialData?.logo?.url || '',
          alt: initialData?.logo?.alt || ''
        },
        active: initialData?.active || true
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (isEdit) {
            await updateSponsor.mutateAsync({ id: initialData._id, data: values });
            toast.success('Sponsor updated');
          } else {
            await createSponsor.mutateAsync(values);
            toast.success('Sponsor created');
          }
          onSuccess();
        } catch (error) {
          const errorMessage = error?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} sponsor`;
          toast.error(errorMessage);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, setFieldValue, values, dirty }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Organization Name
              </label>
              <Field
                name="name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Website URL
              </label>
              <Field
                name="website"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Logo URL
              </label>
              <div className="flex gap-2">
                <Field
                  name="logo.url"
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
                  disabled={isUploading}
                />
                <FileUpload
                  onUpload={(file) => handleImageUpload(file, setFieldValue)}
                  isUploading={isUploading}
                />
              </div>
            </div>
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
              disabled={!dirty || isSubmitting}
              className={`px-6 py-2 text-white rounded-lg transition-colors ${
                !dirty || isSubmitting 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-[#81C99C] hover:bg-[#6ba986]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </div>
              ) : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default SponsorForm;