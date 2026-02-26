import isString from 'lodash/isString';
import { pascalCase } from 'pascal-case';

type ComponentsMap = Record<string, unknown>;

export default function getComponentFromName(
    components: ComponentsMap,
    name: string | null,
    defaultComponentName: string | unknown = null,
): unknown {
    const defaultComponent =
        (isString(defaultComponentName)
            ? components[pascalCase(defaultComponentName)]
            : defaultComponentName) || null;
    if (name === null) {
        return defaultComponent;
    }
    const componentName = pascalCase(name);
    return components[componentName] || defaultComponent;
}
