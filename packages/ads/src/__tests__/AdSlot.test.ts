import AdSlot from '../AdSlot';

test('setAdSlot updates GPT slot settings from options', () => {
    const mockSlot = {
        defineSizeMapping: jest.fn(),
        setTargeting: jest.fn(),
        clearTargeting: jest.fn(),
        setCategoryExclusion: jest.fn(),
        clearCategoryExclusions: jest.fn(),
        updateTargetingFromMap: jest.fn(),
    };

    const slot = new AdSlot('id', '/path', [[300, 250]], {
        sizeMapping: [[[1200, 0], [[300, 250]]]],
        targeting: {
            section: 'news',
            lang: 'fr',
        },
        categoryExclusions: ['exclude-a'],
    });

    slot.setAdSlot(mockSlot as unknown as googletag.Slot);

    expect(mockSlot.defineSizeMapping).toHaveBeenCalledWith([[[1200, 0], [[300, 250]]]]);
    expect(mockSlot.setTargeting).toHaveBeenCalledWith('section', 'news');
    expect(mockSlot.setTargeting).toHaveBeenCalledWith('lang', 'fr');
    expect(mockSlot.setCategoryExclusion).toHaveBeenCalledWith('exclude-a');
});

test('setTargeting updates options before ad slot definition and GPT slot after definition', () => {
    const mockSlot = {
        defineSizeMapping: jest.fn(),
        setTargeting: jest.fn(),
        clearTargeting: jest.fn(),
        setCategoryExclusion: jest.fn(),
        clearCategoryExclusions: jest.fn(),
        updateTargetingFromMap: jest.fn(),
    };

    const slot = new AdSlot('id', '/path', [[300, 250]]);

    slot.setTargeting({ category: 'sports' });
    expect(slot.getTargeting()).toEqual({ category: 'sports' });

    slot.setAdSlot(mockSlot as unknown as googletag.Slot);
    slot.setTargeting({ category: 'tech' });

    expect(mockSlot.updateTargetingFromMap).toHaveBeenCalledWith({ category: 'tech' });
});

test('setVisible updates visibility and emits visible event', () => {
    const slot = new AdSlot('id', '/path', [[300, 250]], { visible: false });
    const listener = jest.fn();

    slot.on('visible', listener);
    slot.setVisible(true);

    expect(slot.isVisible()).toBe(true);
    expect(slot.wasVisible).toBe(true);
    expect(listener).toHaveBeenCalledWith({ visible: true, slot });
});

test('setRenderEvent marks slot rendered and exposes rendered size', () => {
    const slot = new AdSlot('id', '/path', [[300, 250]]);
    const event = {
        isEmpty: false,
        size: [300, 250],
    };

    slot.setRenderEvent(event as unknown as googletag.events.SlotRenderEndedEvent);

    expect(slot.isRendered()).toBe(true);
    expect(slot.getRenderedSize()).toEqual({ width: 300, height: 250, isFluid: false });
    expect(slot.isEmpty()).toBe(false);
});

test('destroy is idempotent and clears runtime state', () => {
    const slot = new AdSlot('id', '/path', [[300, 250]]);
    const listener = jest.fn();

    slot.on('destroy', listener);
    slot.setDisplayed(true);
    slot.destroy();
    slot.destroy();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(slot.isDestroyed()).toBe(true);
    expect(slot.isDisplayed()).toBe(false);
    expect(slot.getAdSlot()).toBeNull();
});
