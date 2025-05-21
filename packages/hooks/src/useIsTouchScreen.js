import { isTouchScreen } from '@folklore/utils';

const touchScreen = isTouchScreen();

export default function useIsTouchScreen() {
    return touchScreen;
}
