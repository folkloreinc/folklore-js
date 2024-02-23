import { memoryLocation } from 'wouter/memory-location';

export default function useMemoryLocationHook(opts = {}) {
    const { hook } = memoryLocation(opts);
    return hook;
}
