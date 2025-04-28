// frontend/src/hooks/useInitialLoad.js
import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/BrandSettingsContext';
import { useHeaderConfig } from '../context/HeaderConfigContext';

export const useInitialLoad = () => {
    const { loading: authLoading } = useAuth();
    const { isLoading: settingsLoading } = useSettings();
    const { loading: headerLoading } = useHeaderConfig();

    return useMemo(() => {
    const loadersCompleted = [authLoading, settingsLoading, headerLoading]
        .filter(loading => !loading).length;

    return {
        isLoading: authLoading || settingsLoading || headerLoading,
        progress: Math.floor((loadersCompleted / 3) * 100)
    };
    }, [authLoading, settingsLoading, headerLoading]);
};