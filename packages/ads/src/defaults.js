export const viewports = {
    default: [0, 0],
    tablet: [728, 0],
    desktop: [1024, 0],
    laptop: [1400, 700],
};

export const positions = {
    top: {
        size: [
            [320, 50],
            [1382, 600],
            [320, 100],
            [970, 90],
            [1024, 300],
            [970, 250],
            [300, 150],
            [1382, 300],
            [300, 100],
            [250, 250],
            [300, 250],
        ],
        sizeMapping: {
            default: [
                [320, 50],
                [320, 100],
                [300, 150],
                [300, 100],
                [250, 250],
                [300, 250],
            ],
            tablet: [
                [320, 100],
                [300, 150],
                [300, 100],
            ],
            desktop: [
                [320, 100],
                [970, 90],
                [1024, 300],
                [970, 250],
                [300, 150],
                [300, 100],
            ],
            laptop: [
                [320, 100],
                [1382, 600],
                [320, 100],
                [970, 90],
                [1024, 300],
                [970, 250],
                [300, 150],
                [1382, 300],
                [300, 100],
            ],
        },
    },

    grid: {
        size: [[250, 250], [300, 250], 'fluid'],
    },

    sidebar: {
        size: [
            [300, 600],
            [300, 250],
            [160, 600],
        ],
        sizeMapping: {
            default: [[300, 250]],
            laptop: [
                [300, 250],
                [300, 600],
                [160, 600],
            ],
        },
    },

    fullwidth: {
        size: [
            [300, 250],
            [728, 90],
            [970, 250],
        ],
        sizeMapping: {
            default: [[300, 250]],
            tablet: [
                [300, 250],
                [728, 90],
            ],
            desktop: [
                [300, 250],
                [728, 90],
                [970, 250],
            ],
            laptop: [
                [300, 250],
                [728, 90],
                [970, 250],
            ],
        },
    },

    content: {
        size: [
            [300, 600],
            [300, 100],
            [728, 90],
            [300, 250],
            [320, 100],
            [320, 50],
            [336, 280],
        ],
        sizeMapping: {
            default: [
                [300, 600],
                [300, 100],
                [300, 250],
                [320, 100],
                [320, 50],
            ],
            tablet: [
                [300, 100],
                [728, 90],
                [300, 250],
                [320, 100],
                [320, 50],
                [336, 280],
            ],
            desktop: [
                [300, 100],
                [728, 90],
                [300, 250],
                [320, 100],
                [336, 280],
            ],
            laptop: [
                [300, 100],
                [728, 90],
                [300, 250],
                [320, 100],
                [336, 280],
            ],
        },
    },
};
