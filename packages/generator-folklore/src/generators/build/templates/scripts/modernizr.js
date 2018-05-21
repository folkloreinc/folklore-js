#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const program = require('commander');
const modernizr = require('customizr');
const config = require('./config').modernizr || {};

program
    .option('-d, --dist', 'Production build')
    .parse(process.argv);

let settings = {
    ...config,
};
if (program.dist) {
    settings.dest = '<%= outputPath %>';
    settings.uglify = true;
    settings.cache = false;
}

modernizr(settings, () => {

});
