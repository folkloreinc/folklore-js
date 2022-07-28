import { isString } from 'lodash';
import path from 'path';

export function ensureLeadingDotSlash(filePath) {
    return isString(filePath) && !path.isAbsolute(filePath) && filePath.match(/^\./) === null
    ? `./${filePath}`
    : filePath;;
}
