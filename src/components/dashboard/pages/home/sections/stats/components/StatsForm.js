// frontend/src/components/dashboard/pages/home/sections/stats/components/StatsForm.js
import React from 'react';
import { Formik, Field } from 'formik';
import { toast } from 'react-hot-toast';
import { 
  FaUsers, FaChalkboardTeacher, FaChartLine, FaAward, 
  FaBriefcase, FaBook, FaBrain, FaClock, FaGlobe,
  FaGraduationCap, FaHandshake, FaLaptopCode, 
  FaMicroscope, FaMoneyBillAlt, FaRocket, 
  FaTrophy, FaUniversity, FaChartPie
} from 'react-icons/fa';

// Update the iconSet in your StatsForm component
const iconSet = {
  FaUsers: { component: FaUsers, label: 'Users' },
  FaGraduationCap: { component: FaGraduationCap, label: 'Alumni' },
  FaRocket: { component: FaRocket, label: 'Growth' },
  FaChartLine: { component: FaChartLine, label: 'Metrics' },
  FaGlobe: { component: FaGlobe, label: 'Global' },
  FaBriefcase: { component: FaBriefcase, label: 'Partners' },
  FaClock: { component: FaClock, label: 'Experience' },
  FaBrain: { component: FaBrain, label: 'Skills' },
  FaTrophy: { component: FaTrophy, label: 'Achievements' },
  FaMoneyBillAlt: { component: FaMoneyBillAlt, label: 'Funds' },
  FaBook: { component: FaBook, label: 'Courses' },
  FaLaptopCode: { component: FaLaptopCode, label: 'Tech' },
  FaHandshake: { component: FaHandshake, label: 'Collaborations' },
  FaChartPie: { component: FaChartPie, label: 'Analytics' },
  FaUniversity: { component: FaUniversity, label: 'Institutions' },
  FaMicroscope: { component: FaMicroscope, label: 'Research' },
  FaChalkboardTeacher: { component: FaChalkboardTeacher, label: 'Workshops' },
  FaAward: { component: FaAward, label: 'Achievements' }
};

const StatsForm = ({ initialData, onSuccess, onCancel, createStat, updateStat }) => {
  const isEdit = !!initialData;

  return (
    <Formik
      initialValues={{
        number: initialData?.number || '',
        label: initialData?.label || '',
        icon: initialData?.icon || 'FaUsers'
      }}
      validate={values => {
        const errors = {};
        if (!values.number) errors.number = 'Required';
        if (!values.label) errors.label = 'Required';
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          if (isEdit) {
            await updateStat.mutateAsync({ id: initialData._id, data: values });
            toast.success('Stat updated');
          } else {
            await createStat.mutateAsync(values);
            toast.success('Stat created');
          }
          onSuccess();
          resetForm();
        } catch (error) {
          const errorMessage = error?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} stat`;
          toast.error(errorMessage);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleSubmit, isSubmitting, dirty, setFieldValue, values }) => (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Number
              </label>
              <Field
                name="number"
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#606161] mb-1">
                Label
              </label>
              <Field
                name="label"
                type="text"
                className="w-full px-3 py-2 border rounded-lg focus:ring-[#81C99C] focus:border-[#81C99C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#606161] mb-4">
              Icon Selection
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(iconSet).map(([key, { component: Icon, label }]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setFieldValue('icon', key)}
                  className={`p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                    ${values.icon === key 
                      ? 'border-[#FBB859] bg-[#FBB859]/10' 
                      : 'border-[#606161]/20 hover:border-[#81C99C]'}
                    hover:shadow-md`}
                >
                  <Icon className={`w-6 h-6 ${values.icon === key ? 'text-[#FBB859]' : 'text-[#606161]'}`} />
                  <span className="text-xs font-medium text-[#606161] text-center">
                    {label}
                  </span>
                </button>
              ))}
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
              className={`px-6 py-2 rounded-lg transition-colors ${
                dirty 
                  ? 'bg-[#81C99C] text-white hover:bg-[#6ba986]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isEdit ? 'Update Stat' : 'Add Stat'}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default StatsForm;