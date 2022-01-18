const getEntryFromArgs = (args) =>
    args.length > 1
        ? args.reduce((entriesMap, entryArg) => {
              const [entryKey, entryPath = null] = entryArg.split(':');
              const key = entryPath !== null ? entryKey : 'main';
              return {
                  ...entriesMap,
                  [key]: [...(entriesMap[key] || []), entryPath],
              };
          }, {})
        : args[0];

export default getEntryFromArgs;
