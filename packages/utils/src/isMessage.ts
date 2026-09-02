import isObject from 'lodash-es/isObject';
import { type MessageDescriptor } from 'react-intl';

export default function isMessage(
    message: MessageDescriptor | unknown,
): message is MessageDescriptor {
    return message !== null && isObject(message) && typeof message.id !== 'undefined';
}
