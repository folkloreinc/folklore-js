/**
 * Constants
 */
const TEST_ACTION = 'TEST_ACTION';

/**
 * Actions creator
 */
const testAction = () => ({
    type: TEST_ACTION,
});

/**
 * Exports
 */
const TestActions = {
    testAction,
};

export default TestActions;
export {
    TEST_ACTION,
    testAction,
};
