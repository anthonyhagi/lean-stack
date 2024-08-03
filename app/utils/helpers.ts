export function assert<TValue>(value: TValue) {
  if (value == null) {
    throw new Error('Expected a value but received undefined or null');
  }

  return value;
}
