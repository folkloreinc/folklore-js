import isArray from 'lodash/isArray';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';

export const getAdSizes = sizes => {
    if (isArray(sizes)) {
        return uniqBy(
            isArray(sizes[0]) || sizes[0] === 'fluid'
                ? sizes
                      .filter(size => size !== 'fluid')
                      .reduce((allSizes, size) => [...allSizes, ...getAdSizes(size)], [])
                : [sizes].filter(size => size !== 'fluid'),
            size => size.join('x'),
        );
    }
    return sizes.split('x').map(it => parseInt(it, 10));
};

export const getMinimumAdSize = sizes =>
    getAdSizes(sizes).reduce(
        (minimumSize, size) => ({
            width: Math.min(minimumSize.width, size[0]),
            height: Math.min(minimumSize.height, size[1]),
        }),
        {
            width: Infinity,
            height: Infinity,
        },
    );

export const sizeFitsInViewport = (size, viewport) =>
    (size === 'fluid' && viewport[0] > 600) ||
    (size !== 'fluid' &&
        (viewport[0] === 0 || size[0] <= viewport[0]) &&
        (viewport[1] === 0 || size[1] <= viewport[1]));

export const getSortedViewports = viewports =>
    sortBy(
        Object.keys(viewports).map(name => ({
            name,
            size: viewports[name],
        })),
        [viewport => viewport.size[0]],
    ).reverse();

export const buildSizeMappingFromViewports = (sizeMapping, viewports) =>
    getSortedViewports(viewports).reduce(
        (newSizeMapping, { name, size: viewPortSize }) =>
            typeof sizeMapping[name] !== 'undefined'
                ? [...newSizeMapping, [viewPortSize, sizeMapping[name]]]
                : newSizeMapping,
        [],
    );

export const buildSizeMappingFromSizes = (sizes, viewports) =>
    getSortedViewports(viewports).map(({ name, size: viewPortSize }) => [
        viewPortSize,
        sizes.filter(size =>
            sizeFitsInViewport(size, name === 'default' ? [300, 300] : viewPortSize),
        ),
    ]);

export const getSizeMappingFromSlot = ({ size: allSizes = [], sizeMapping = null }, viewports) => {
    if (sizeMapping === true) {
        return buildSizeMappingFromSizes(allSizes, viewports);
    }
    return sizeMapping !== null ? buildSizeMappingFromViewports(sizeMapping, viewports) : null;
};
