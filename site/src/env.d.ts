/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    slideDrawer: {
      open: () => void;
      close: () => void;
      toggle: () => void;
      isOpen: () => boolean;
    };
    slideOverview: {
      show: () => void;
      hide: () => void;
      toggle: () => void;
      isVisible: () => boolean;
    };
  }
}

export {};
