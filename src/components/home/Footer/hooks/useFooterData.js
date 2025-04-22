// frontend/src/components/home/Footer/hooks/useFooterData.js
import { useSettings } from '../../../../context/BrandSettingsContext';

export const useFooterData = () => {
  const { settings } = useSettings();

  return {
    logoUrl:    settings?.footerLogo?.url,
    logoAlt:    settings?.footerLogo?.alt,
    slogan:     settings?.footerSlogan,
    colors:     settings?.footerColors || {},
  };
};
