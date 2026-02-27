import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';

import { AdSize, AdSizeMapping, Size, Slot, SlotDefinition, Viewport, Viewports } from './types';

export function normalizeAdSizes(size): AdSize[] {
    if (size === null) {
        return [];
    }
    if (isArray(size) && size.length > 0 && isArray(size[0])) {
        return size;
    }
    return [size];
}

export function getAdSizes(sizes): AdSize[] {
    return uniqBy(sizes, (size) => (isArray(size) ? size.join('x') : size));
}

export function getMinimumAdSize(sizes): Size {
    return getAdSizes(sizes)
        .filter((size) => size !== 'fluid' && !(isArray(size) && size[0] === 'fluid'))
        .reduce<Size>(
            (minimumSize, size) => ({
                width: Math.min(minimumSize.width, size[0]),
                height: Math.min(minimumSize.height, size[1]),
            }),
            {
                width: Infinity,
                height: Infinity,
            },
        );
}

export function sizeFitsInViewport(size: AdSize, viewport: Viewport): boolean {
    const isFluid = size === 'fluid' || (isArray(size) && size[0] === 'fluid');
    return (
        (isFluid && viewport[0] > 600) ||
        (!isFluid &&
            (viewport[0] === 0 || size[0] <= viewport[0]) &&
            (viewport[1] === 0 || size[1] <= viewport[1]))
    );
}

export function getSortedViewports(viewports: Viewports) {
    return sortBy(
        Object.keys(viewports).map((name) => ({
            name,
            size: viewports[name],
        })),
        [(viewport) => viewport.size[0]],
    ).reverse();
}

export function buildSizeMappingFromViewports(sizeMapping, viewports): AdSizeMapping[] {
    return isObject(sizeMapping) && !isArray(sizeMapping)
        ? getSortedViewports(viewports).reduce(
              (newSizeMapping, { name, size: viewPortSize }) =>
                  typeof sizeMapping[name] !== 'undefined'
                      ? [...newSizeMapping, [viewPortSize, sizeMapping[name]]]
                      : newSizeMapping,
              [],
          )
        : sizeMapping;
}

export function buildSizeMappingFromSizes(sizes, viewports): AdSizeMapping[] {
    return getSortedViewports(viewports).map(({ name, size: viewPortSize }) => [
        viewPortSize,
        sizes.filter((size) =>
            sizeFitsInViewport(size, name === 'default' ? [300, 300] : viewPortSize),
        ),
    ]);
}

export function getSizeMappingFromSlot(
    { size: allSizes = [], sizeMapping = null }: Slot | SlotDefinition,
    viewports: Viewports,
): AdSizeMapping[] | null {
    if (sizeMapping === true) {
        return buildSizeMappingFromSizes(allSizes, viewports);
    }
    return sizeMapping !== null ? buildSizeMappingFromViewports(sizeMapping, viewports) : null;
}

export function getSizeFromSizeMapping(sizeMapping): AdSize[] | null {
    if (sizeMapping === null) {
        return null;
    }
    return getAdSizes(
        sizeMapping.reduce((allSizes, sizeMap) => [...allSizes, ...sizeMap[1]], []),
    ).sort((a, b) => {
        if (a === 'fluid') {
            return 1;
        }
        if (b === 'fluid') {
            return -1;
        }
        if (a[0] === b[0]) {
            return a[1] > b[1] ? 1 : -1;
        }
        return a[0] > b[0] ? 1 : -1;
    });
}
