import { program } from 'commander';<% if (commands) { %>

import defaultCommand from './commands/default';

program
    .description('Description')
    .addCommand(defaultCommand, {
        isDefault: true,
    });<% } else { %>

program
    .description('Description')
    .option('-t, --test', 'Test option', 'test')

<% } %>

program.parse();<% if(!commands) { %>

const { test } = program.opts();

console.log(test);
<% } %>
