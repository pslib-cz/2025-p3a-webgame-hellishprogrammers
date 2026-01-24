// Polyfill for crypto.randomUUID in non-secure contexts
if (!window.crypto.randomUUID) {
  // @ts-expect-error - Adding polyfill
  window.crypto.randomUUID = function randomUUID() {
    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: string) => {
      const num = parseInt(c, 10);
      return (
        num ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))
      ).toString(16);
    });
  };
}
