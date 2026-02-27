import {
    buildSizeMappingFromViewports,
    getAdSizes,
    getMinimumAdSize,
    getSizeFromSizeMapping,
    getSizeMappingFromSlot,
    getSortedViewports,
    normalizeAdSizes,
    sizeFitsInViewport,
} from '../utils';

import { SlotDefinition, Viewports } from '../types';

test('getMinimumAdSize returns minimum size', () => {
    expect(getMinimumAdSize(['fluid', [300, 250], [728, 90]])).toEqual({ width: 300, height: 90 });
});

test('getAdSizes returns unique sizes', () => {
    expect(getAdSizes(['fluid', [300, 250], [300, 250], [728, 90]])).toEqual([
        'fluid',
        [300, 250],
        [728, 90],
    ]);
});

test('getSizeMappingFromSlot returns size mapping from viewport map', () => {
    const viewports: Viewports = {
        default: [0, 0],
        mobile: [600, 0],
        desktop: [1200, 0],
    };

    const slot: SlotDefinition = {
        sizeMapping: {
            default: [[300, 250]],
            mobile: [[300, 250]],
            desktop: [
                [728, 90],
                [970, 250],
            ],
        },
    };

    const sizeMapping = getSizeMappingFromSlot(slot, viewports);

    expect(sizeMapping).toEqual([
        [viewports.desktop, slot.sizeMapping.desktop],
        [viewports.mobile, slot.sizeMapping.mobile],
        [viewports.default, slot.sizeMapping.default],
    ]);
});

test('getSizeFromSizeMapping returns merged sorted sizes', () => {
    const viewports: Viewports = {
        default: [0, 0],
        mobile: [600, 0],
        desktop: [1200, 0],
    };

    const slot: SlotDefinition = {
        sizeMapping: {
            default: [[300, 250], 'fluid'],
            mobile: [[300, 250]],
            desktop: [
                [728, 90],
                [970, 250],
            ],
        },
    };

    const sizeMapping = getSizeMappingFromSlot(slot, viewports);
    const size = getSizeFromSizeMapping(sizeMapping);

    expect(size).toEqual([[300, 250], [728, 90], [970, 250], 'fluid']);
});

test('normalizeAdSizes handles null, nested arrays and single values', () => {
    expect(normalizeAdSizes(null)).toEqual([]);
    expect(
        normalizeAdSizes([
            [300, 250],
            [728, 90],
        ]),
    ).toEqual([
        [300, 250],
        [728, 90],
    ]);
    expect(normalizeAdSizes('fluid')).toEqual(['fluid']);
});

test('sizeFitsInViewport supports fluid and fixed sizes', () => {
    expect(sizeFitsInViewport('fluid', [601, 0])).toBe(true);
    expect(sizeFitsInViewport('fluid', [600, 0])).toBe(false);
    expect(sizeFitsInViewport([300, 250], [320, 0])).toBe(true);
    expect(sizeFitsInViewport([728, 90], [320, 0])).toBe(false);
});

test('getSortedViewports returns viewports sorted by width descending', () => {
    const sorted = getSortedViewports({
        default: [0, 0],
        desktop: [1200, 0],
        tablet: [768, 0],
    });

    expect(sorted.map((viewport) => viewport.name)).toEqual(['desktop', 'tablet', 'default']);
});

test('buildSizeMappingFromViewports returns the same value for array input', () => {
    const sizeMapping = [
        [[1200, 0], [[728, 90]]],
        [[0, 0], [[300, 250]]],
    ];

    expect(buildSizeMappingFromViewports(sizeMapping, { default: [0, 0] })).toBe(sizeMapping);
});

test('getSizeMappingFromSlot builds mapping from sizes when sizeMapping is true', () => {
    const viewports: Viewports = {
        default: [0, 0],
        desktop: [1200, 0],
    };

    const slot: SlotDefinition = {
        size: ['fluid', [300, 250], [970, 250]],
        sizeMapping: true,
    };

    const sizeMapping = getSizeMappingFromSlot(slot, viewports);

    expect(sizeMapping).toEqual([
        [
            [1200, 0],
            ['fluid', [300, 250], [970, 250]],
        ],
        [[0, 0], [[300, 250]]],
    ]);
});
