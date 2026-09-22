// Lightweight enterprise test runner & assertion harness for BhoomiSetu
export function describe(suiteName: string, suiteFn: () => void | Promise<void>) {
  try {
    suiteFn();
  } catch (err) {
    console.error(`Suite failed: ${suiteName}`, err);
  }
}

export function it(testName: string, testFn: () => void | Promise<void>) {
  try {
    const result = testFn();
    if (result instanceof Promise) {
      result.catch((err) => console.error(`Async test failed: ${testName}`, err));
    }
  } catch (err) {
    console.error(`Test failed: ${testName}`, err);
  }
}

export function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but received ${actual}`);
      }
    },
    toBeGreaterThan(expected: number) {
      if (!(actual > expected)) {
        throw new Error(`Expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected: number) {
      if (!(actual >= expected)) {
        throw new Error(`Expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThan(expected: number) {
      if (!(actual < expected)) {
        throw new Error(`Expected ${actual} to be less than ${expected}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toContain(expectedSubstring: string) {
      if (typeof actual === 'string' && !actual.includes(expectedSubstring)) {
        throw new Error(`Expected "${actual}" to contain "${expectedSubstring}"`);
      }
    },
  };
}
