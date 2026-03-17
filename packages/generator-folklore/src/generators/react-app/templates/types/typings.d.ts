export * from '@folklore/auth';

declare module '@folklore/auth' {
    // import { useUser } from '@folklore/auth';
    declare function useUser(): User | null;
}

export * from '@folklore/tracking';

declare module '@folklore/tracking' {
    import CustomTracking from '../lib/Tracking';
    declare function useTracking(): CustomTracking | null;
}
