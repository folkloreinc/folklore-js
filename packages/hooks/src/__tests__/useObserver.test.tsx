import { act, useState } from 'react';
import { Root, createRoot } from 'react-dom/client';

import { useResizeObserver } from '../useObserver';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

const observed = new Set<Element>();
let resizeObserverCallback: ((entries: unknown[]) => void) | null = null;

class FakeResizeObserver {
    constructor(callback) {
        resizeObserverCallback = callback;
    }

    observe(element: Element) {
        observed.add(element);
    }

    unobserve(element: Element) {
        observed.delete(element);
    }

    disconnect() {
        observed.clear();
    }
}

function resize(element: Element, height: number) {
    act(() => {
        resizeObserverCallback?.([{ target: element, contentRect: { height } }]);
    });
}

function Measured({ show, version = 1 }: { show: boolean; version?: number }) {
    const { ref, entry } = useResizeObserver();
    const { contentRect } = entry;
    return (
        <div>
            <span data-height>{contentRect !== null ? contentRect.height : 'none'}</span>
            {show ? <div key={version} data-measured ref={ref as any} /> : null}
        </div>
    );
}

function LateChild() {
    const { ref, entry } = useResizeObserver();
    const [show, setShow] = useState(false);
    const { contentRect } = entry;
    return (
        <div>
            <button type="button" onClick={() => setShow(true)} />
            <span data-height>{contentRect !== null ? contentRect.height : 'none'}</span>
            {show ? <Child innerRef={ref} /> : null}
        </div>
    );
}

function Child({ innerRef }) {
    return <div data-measured ref={innerRef} />;
}

describe('useResizeObserver', () => {
    let container: HTMLDivElement;
    let root: Root;

    beforeAll(() => {
        (globalThis as any).ResizeObserver = FakeResizeObserver;
    });

    beforeEach(() => {
        observed.clear();
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);
    });

    afterEach(() => {
        act(() => root.unmount());
        container.remove();
    });

    const measured = () => container.querySelector('[data-measured]');
    const height = () => container.querySelector('[data-height]')?.textContent;

    it('observes an element rendered from the start', () => {
        act(() => root.render(<Measured show />));
        expect(observed.has(measured())).toBe(true);
        resize(measured(), 100);
        expect(height()).toBe('100');
    });

    it('observes an element that appears after the first render', () => {
        act(() => root.render(<Measured show={false} />));
        act(() => root.render(<Measured show />));
        expect(observed.has(measured())).toBe(true);
        resize(measured(), 120);
        expect(height()).toBe('120');
    });

    it('observes the new element when it is replaced', () => {
        act(() => root.render(<Measured show version={1} />));
        const first = measured();
        act(() => root.render(<Measured show version={2} />));
        const second = measured();
        expect(second).not.toBe(first);
        expect(observed.has(second)).toBe(true);
        expect(observed.has(first)).toBe(false);
    });

    it('observes an element mounted by a child component later', () => {
        act(() => root.render(<LateChild />));
        act(() => container.querySelector('button')?.click());
        expect(observed.has(measured())).toBe(true);
        resize(measured(), 80);
        expect(height()).toBe('80');
    });

    it('stops observing when the element is removed', () => {
        act(() => root.render(<Measured show />));
        const element = measured();
        act(() => root.render(<Measured show={false} />));
        expect(observed.has(element)).toBe(false);
    });

    it('keeps exposing the element on ref.current', () => {
        let refValue = null;
        function Reader() {
            const { ref } = useResizeObserver();
            refValue = ref;
            return <div data-measured ref={ref as any} />;
        }
        act(() => root.render(<Reader />));
        expect(refValue.current).toBe(measured());
    });
});
