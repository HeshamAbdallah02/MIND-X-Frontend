// frontend/src/components/trainings/index.js
import React from 'react';
import { Helmet } from 'react-helmet-async';
import TrainingsHero from './components/TrainingsHero';
import TrainingsFilter from './components/TrainingsFilter';
import TrainingsList from './components/TrainingsList';
import TrainingsCTA from './components/TrainingsCTA';
import { useTrainingsPage } from './hooks/useTrainingsPage';
import Footer from '../home/Footer';

const TrainingsPage = () => {
    const { hero, trainings, cta, isLoading, filter, setFilter, scrollToTrainings } = useTrainingsPage();

    return (
        <>
            <Helmet>
                <title>MIND-X: Training Programs</title>
                <meta name="description" content="Discover our specialized training programs designed to enhance your personal and professional growth" />
            </Helmet>

            <TrainingsHero hero={hero} onScrollToTrainings={scrollToTrainings} />

            {/* Trainings Section */}
            <div id="trainings-section" className="py-16 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Our Training Programs
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Browse through our comprehensive training programs designed for all skill levels
                        </p>
                    </div>

                    <TrainingsFilter filter={filter} onFilterChange={setFilter} />
                    <TrainingsList
                        trainings={trainings}
                        isLoading={isLoading}
                        filter={filter}
                    />
                </div>
            </div>

            <TrainingsCTA cta={cta} />
            <Footer />
        </>
    );
};

export default TrainingsPage;
