// frontend/src/components/home/SponsorsSection/index.js
import React from 'react';
import { useIntersection } from '../../../hooks/useIntersection';
import { useSettings } from '../../../context/BrandSettingsContext';
import LogoScroller from './LogoScroller';
import { useSponsorData } from './hooks/useSponsorData';

const SponsorsSection = () => {
  const [sectionRef, isVisible] = useIntersection({
    triggerOnce: true,
    rootMargin: '0px 0px -25% 0px'
  });
  const { settings } = useSettings();
  const { data, isLoading } = useSponsorData();
  const colors = settings?.sponsorsColors || {};

  if (isLoading) return <div className="h-40 bg-gray-100 animate-pulse" />;

  const validSponsors = (data?.sponsors || []).filter(item => 
    item?.logo?.url && item?.website && item?._id
  );
  
  const validPartners = (data?.partners || []).filter(item =>
    item?.logo?.url && item?.website && item?._id
  );

  if (!validSponsors.length && !validPartners.length) return null;

  return (
    <section
      ref={sectionRef}
      className="py-16"
      style={{ backgroundColor: colors.sectionBackground || '#ffffff' }}
      data-visible={isVisible.toString()}
    >
      <div className="container mx-auto px-4 max-w-content">
        {validSponsors.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-medium text-center mb-12" 
                style={{ color: colors.titleColor || '#606161' }}>
              Our Sponsors
            </h3>
            <div className="logo-scroller-container" 
                 style={{ animationDuration: `${colors.sponsorsSpeed || 80}s` }}>
              <LogoScroller items={validSponsors} speed={colors.sponsorsSpeed || 80} />
            </div>
          </div>
        )}

        {validPartners.length > 0 && (
          <div className="logo-scroller-container" 
               style={{ animationDuration: `${colors.partnersSpeed || 80}s` }}>
            <h3 className="text-2xl font-medium text-center mb-12" 
                style={{ color: colors.titleColor || '#606161' }}>
              Our Partners
            </h3>
            <LogoScroller items={validPartners} speed={colors.partnersSpeed || 80} />
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(SponsorsSection);