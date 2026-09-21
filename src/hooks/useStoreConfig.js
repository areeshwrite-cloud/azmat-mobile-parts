import { useSettings } from '../context/SettingsContext.jsx';

export { DEFAULT_STORE_CONFIG } from '../context/SettingsContext.jsx';

export function useStoreConfig() {
  return useSettings();
}
