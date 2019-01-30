export const TEST_AUTH_ACTION = 'TEST_AUTH_ACTION';

export function testAuthAction(something: any) {
  return {
    type: TEST_AUTH_ACTION,
    something,
  };
}
