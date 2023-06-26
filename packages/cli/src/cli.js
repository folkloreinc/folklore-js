import { Command } from 'commander';

import buildCommand from './commands/build';
import intlCommand from './commands/intl';
// import imagesCommand from './commands/images';
import serveCommand from './commands/serve';
import { version } from '../package.json';

const program = new Command();

program
    .version(version)
    .description('CLI to build and serve javascript projects')
    .addCommand(buildCommand)
    .addCommand(intlCommand)
    // .addCommand(imagesCommand)
    .addCommand(serveCommand, {
        isDefault: true,
    });

program.parse(process.argv);
