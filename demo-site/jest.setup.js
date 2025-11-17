import '@testing-library/jest-dom';

globalThis.matchMedia =
  globalThis.matchMedia ||
  function matchMedia(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    };
  };

Element.prototype.scrollTo = jest.fn();

jest.mock('react-toastify', () => {
  const toast = {
    success: jest.fn(),
    error: jest.fn()
  };
  return {
    toast,
    ToastContainer: () => null
  };
});
