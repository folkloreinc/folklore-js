import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import { Command } from 'commander';
import { extractAndWrite, extract, compileAndWrite, compile } from '@formatjs/cli-lib';
import isArray from 'lodash/isArray';
import getPathsFromGlob from '../getPathsFromGlob';
import POFile from '../POFile';
import getOptionsFromPackage from '../getOptionsFromPackage';
import getAbsolutePath from '../getAbsolutePath';

const command = new Command('intl');

const generateCommand = new Command('generate');
generateCommand
    .description('Generate translations files')
    .argument('<paths...>')
    .option('-l, --locale <locale...>', 'Locales to generate')
    .option('--source-locale <locale>', 'Locale used in source code')
    .option('--po', 'Generate PO file')
    .option('--ast', 'Generate AST file')
    .option('-o, --output-path <path>', 'Path where the messages will be outputed')
    .option(
        '--id-interpolation-pattern <pattern>',
        'Pattern used to created auto-generated id',
        '[sha512:contenthash:base64:6]',
    )
    .option('--without-id-only', 'Extract only messages without id')
    .action(async (srcPaths) => {
        const {
            outputPath,
            locale = null,
            sourceLocale = null,
            po = false,
            ast = false,
            idInterpolationPattern,
            withoutIdOnly,
        } = generateCommand.opts();

        const packageJson = path.join(process.cwd(), './package.json');
        const { supportedLocales = null } =
            getOptionsFromPackage(packageJson, ['supportedLocales']) || {};
        const locales = (!isArray(locale) && locale !== null ? [locale] : locale) ||
            supportedLocales || ['en'];
        const defaultLocale = sourceLocale || (locales.length > 0 ? locales[0] : null);
        const generatedIdPrefix = '__GENERATED__';
        const generatedIdPrefixRegExp = new RegExp(`^${generatedIdPrefix}(.*)$`);

        // Get extracted messages
        const files = getPathsFromGlob(srcPaths);
        let extractedMessages = JSON.parse(
            await extract(files, {
                throws: false,
                idInterpolationPattern: withoutIdOnly
                    ? `${generatedIdPrefix}${idInterpolationPattern}`
                    : idInterpolationPattern,
                extractFromFormatMessageCall: true,
            }),
        );

        // Filter messages with generated id only
        if (withoutIdOnly) {
            extractedMessages = Object.keys(extractedMessages).reduce((messagesMap, key) => {
                const matches = key.match(generatedIdPrefixRegExp);
                return matches !== null
                    ? {
                          ...messagesMap,
                          [matches[1]]: extractedMessages[key],
                      }
                    : messagesMap;
            }, {});
        }

        for (let i = 0; i < locales.length; i += 1) {
            const currentLocale = locales[i];
            const isDefaultLocale = currentLocale === defaultLocale;
            const localePath = path.join(outputPath, `${currentLocale}.json`);
            const currentLocaleMessages = fs.existsSync(localePath)
                ? fsExtra.readJsonSync(localePath) || {}
                : {};
            if (po) {
                const poPath = path.join(outputPath, `${currentLocale}.po`);
                const poFile = new POFile(poPath, {
                    useDefaultMessage: isDefaultLocale,
                });
                poFile.update(extractedMessages);
                poFile.save();
                fsExtra.outputJsonSync(localePath, poFile.toJSON(), {
                    spaces: 4,
                });
                compileAndWrite([localePath], {
                    ast,
                    throws: true,
                    idInterpolationPattern,
                    outFile: localePath,
                });
            } else {
                const newMessages = Object.keys(extractedMessages).reduce(
                    (map, messageId) => ({
                        ...map,
                        [messageId]:
                            currentLocaleMessages[messageId] ||
                            (isDefaultLocale
                                ? extractedMessages[messageId].defaultMessage
                                : null) ||
                            null,
                    }),
                    {},
                );

                fsExtra.outputJsonSync(localePath, newMessages, {
                    spaces: 4,
                });
            }
        }
    });

const extractCommand = new Command('extract');
extractCommand
    .description('Extract intl messages')
    .argument('<paths...>')
    .option('-o, --output-path <path>', 'Path where the messages will be outputed')
    .option(
        '--id-interpolation-pattern <pattern>',
        'Pattern used to created auto-generated id',
        '[sha512:contenthash:base64:6]',
    )
    .action(async (srcPaths) => {
        const { outputPath = null, idInterpolationPattern } = extractCommand.opts();
        const absOutputPath = getAbsolutePath(outputPath);
        const files = getPathsFromGlob(srcPaths);

        if (outputPath !== null) {
            await extractAndWrite(files, {
                throws: false,
                idInterpolationPattern,
                outFile: absOutputPath,
                extractFromFormatMessageCall: true,
            });
        } else {
            const messages = await extract(files, {
                throws: false,
                idInterpolationPattern,
                extractFromFormatMessageCall: true,
            });
            console.log(messages);
        }
    });

const compileCommand = new Command('compile');
compileCommand
    .description('Compile intl messages')
    .argument('<paths...>')
    .option('-o, --output-path <path>', 'Path where the messages will be outputed')
    .option(
        '--id-interpolation-pattern <pattern>',
        'Pattern used to created auto-generated id',
        '[sha512:contenthash:base64:6]',
    )
    .option('--ast', 'Compile with ast')
    .action(async (srcPaths) => {
        const { outputPath = null, idInterpolationPattern, ast = false } = compileCommand.opts();
        const absOutputPath = getAbsolutePath(outputPath);
        const files = getPathsFromGlob(srcPaths);
        if (outputPath !== null) {
            files.forEach((file) =>
                compileAndWrite([getAbsolutePath(file)], {
                    ast,
                    throws: true,
                    idInterpolationPattern,
                    outFile: path.join(absOutputPath, path.basename(file)),
                }),
            );
        } else {
            files.forEach(async (file) => {
                const messages = await compile([getAbsolutePath(file)], {
                    ast,
                    throws: true,
                    idInterpolationPattern,
                });
                console.log(messages);
            });
        }
    });

const json2poCommand = new Command('json2po');
json2poCommand
    .description('Update PO file from JSON intl messages file')
    .argument('<src>')
    .argument('<dest>')
    .option('--use-default-message', 'Use defaultMessage to populate the translation')
    .action(async (srcPath, destPath) => {
        const { useDefaultMessage = false } = json2poCommand.opts();
        const absSrcPath = getAbsolutePath(srcPath);
        const absDestPath = getAbsolutePath(destPath);

        const messages = fsExtra.readJsonSync(absSrcPath);
        const poFile = new POFile(absDestPath, {
            useDefaultMessage,
        });
        poFile.update(messages);
        poFile.save();
    });

const po2jsonCommand = new Command('po2json');
po2jsonCommand
    .description('Update JSON file from PO file')
    .argument('<src>')
    .argument('<dest>')
    .action(async (srcPath, destPath) => {
        const absSrcPath = getAbsolutePath(srcPath);
        const absDestPath = getAbsolutePath(destPath);
        const poFile = new POFile(absSrcPath);
        fsExtra.outputJsonSync(absDestPath, poFile.toJSON(), {
            spaces: 4,
        });
    });

command
    .description('Tools to deal with translations and @formatjs')
    .addCommand(generateCommand, {
        isDefault: true,
    })
    .addCommand(extractCommand)
    .addCommand(compileCommand)
    .addCommand(json2poCommand)
    .addCommand(po2jsonCommand);

export default command;
