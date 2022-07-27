import { Command } from 'commander';

const command = new Command('default');

command
    .description('Description of default command')
    .argument('<arg>', 'Argument 1')
    .option('-t, --test', 'Test option', 'test')
    .action(async (arg) => {
        const { test } = program.opts();
        console.log('This is default command');
        console.log(`Argument: ${arg}`);
        console.log(`Option: ${test}`);
    });

export default command;
