import isString from 'lodash/isString';
import { pascalCase } from 'pascal-case';

export default function getComponentFromName(components, name, defaultComponentName = null) {
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
