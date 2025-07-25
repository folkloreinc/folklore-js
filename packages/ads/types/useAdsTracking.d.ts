import AdSlot from './AdSlot';
export default function useAdsTracking(): (action: string, slot?: AdSlot, renderEvent?: any) => void;
