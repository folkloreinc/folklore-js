#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies */
const program = require('commander');
const modernizr = require('customizr');
const config = require('./config');
/* eslint-enable import/no-extraneous-dependencies */

const settings = config.modernizr;
program
    .option('-d, --dist', 'Production build')
    .parse(process.argv);

if (program.dist) {
    settings.dest = 'public/js/modernizr.js';
    settings.uglify = true;
    settings.cache = false;
}

modernizr(settings, () => {

});
