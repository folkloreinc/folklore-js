import isString from 'lodash-es/isString';
import { pascalCase } from 'pascal-case';
import { ElementType } from 'react';

type ComponentsMap<ComponentType> = Record<string, ComponentType>;

export default function getComponentFromName<ComponentType extends ElementType = ElementType>(
    components: ComponentsMap<ComponentType>,
    name: string | null,
    defaultComponentName: ComponentType | string | null = null,
): ComponentType | null {
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
