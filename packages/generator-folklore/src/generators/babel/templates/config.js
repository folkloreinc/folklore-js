module.exports = {
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                useBuiltIns: false
            },
        ],
    ],

    plugins: [
        <% if (transformRuntime) { %>
        [require.resolve('@babel/plugin-transform-runtime'), {}],
        <% } %>
    ],
};
