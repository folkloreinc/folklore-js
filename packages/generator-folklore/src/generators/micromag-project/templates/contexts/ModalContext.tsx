import { useConsent } from '@micromag/core/contexts';
import { useCallback, useContext, useEffect, useMemo, useState, createContext, ReactNode } from 'react';

type ModalContextType = {
    modal: any;
    setModal: ((val: any) => void) | null;
    unsetModal: (() => void) | null;
};

export const ModalContext = createContext<ModalContextType>({
    modal: null,
    setModal: null,
    unsetModal: null,
});

export const useModalContext = (): ModalContextType => useContext(ModalContext);

export const useModal = () => {
    const { modal = null, setModal = null, unsetModal = null } = useModalContext() || {};
    return { modal, setModal, unsetModal };
};

interface ModalProviderProps {
    children: ReactNode;
    modal?: any;
}

export const ModalProvider = ({ children = null, modal: initialModal = null }: ModalProviderProps) => {
    const [modal, setModalState] = useState(initialModal);
    const { consented = null } = useConsent();

    useEffect(() => {
        if (!consented) {
            setModalState('consent');
        }
    }, [consented]);

    const setModal = useCallback(
        (val) => {
            setModalState(val);
        },
        [setModalState],
    );

    const unsetModal = useCallback(() => {
        setModalState(null);
    }, [setModalState]);

    const value = useMemo(
        () => ({
            modal,
            setModal,
            unsetModal,
        }),
        [modal, setModalState, setModal, unsetModal],
    );
    return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};
