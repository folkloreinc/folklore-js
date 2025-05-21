import {
    getAdSizes,
    getMinimumAdSize,
    getSizeFromSizeMapping,
    getSizeMappingFromSlot,
} from '../utils';

test('getMinimumAdSize return minimum size', () => {
    expect(getMinimumAdSize(['fluid', [300, 250], [728, 90]])).toEqual({ width: 300, height: 90 });
});

test('getAdSizes return unique sizes', () => {
    expect(getAdSizes(['fluid', [300, 250], [300, 250], [728, 90]])).toEqual([
        'fluid',
        [300, 250],
        [728, 90],
    ]);
});

test('getSizeMappingFromSlot return size mapping', () => {
    const viewports = {
        default: [0, 0],
        mobile: [600, 0],
        desktop: [1200, 0],
    };

    const slot = {
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

test('getSizeFromSizeMapping return size mapping', () => {
    const viewports = {
        default: [0, 0],
        mobile: [600, 0],
        desktop: [1200, 0],
    };

    const slot = {
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
