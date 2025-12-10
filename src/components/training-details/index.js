// frontend/src/components/training-details/index.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import TrainingDetailsHero from './components/TrainingDetailsHero';
import TrainingAbout from './components/TrainingAbout';
import TrainingTopics from './components/TrainingTopics';
import TrainingObjectives from './components/TrainingObjectives';
import TrainingPrerequisites from './components/TrainingPrerequisites';
import TrainingAudience from './components/TrainingAudience';
import TrainingInstructors from './components/TrainingInstructors';
import TrainingGallery from './components/TrainingGallery';
import RegistrationCard from './components/sidebar/RegistrationCard';
import DetailsCard from './components/sidebar/DetailsCard';
import IncludesCard from './components/sidebar/IncludesCard';
import ContactCard from './components/sidebar/ContactCard';
import useTrainingDetails from './hooks/useTrainingDetails';
import Footer from '../home/Footer';

const TrainingDetailsPage = () => {
    const { training, isLoading, error, registrationLink, isRegistrationOpen } = useTrainingDetails();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#FBB859]"></div>
                    <p className="mt-4 text-gray-600">Loading training details...</p>
                </div>
            </div>
        );
    }

    if (error || !training) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Not Found</h2>
                    <p className="text-gray-600 mb-6">The training you're looking for doesn't exist or has been removed.</p>
                    <Link to="/trainings" className="text-[#FBB859] hover:underline">
                        View All Trainings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>MIND-X: {training.title}</title>
                <meta name="description" content={training.shortDescription || training.description} />
            </Helmet>

            <TrainingDetailsHero training={training} />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-12">
                        <TrainingAbout description={training.description} />
                        <TrainingTopics topics={training.topics} />
                        <TrainingObjectives objectives={training.objectives} />
                        <TrainingPrerequisites prerequisites={training.prerequisites} />
                        <TrainingAudience targetAudience={training.targetAudience} />
                        <TrainingInstructors instructors={training.instructors} />
                        <TrainingGallery galleryImages={training.galleryImages} />
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <RegistrationCard
                                training={training}
                                registrationLink={registrationLink}
                                isRegistrationOpen={isRegistrationOpen}
                            />
                            <DetailsCard training={training} />
                            <IncludesCard
                                certificate={training.certificate}
                                materials={training.materials}
                            />
                            <ContactCard contactInfo={training.contactInfo} />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default TrainingDetailsPage;
