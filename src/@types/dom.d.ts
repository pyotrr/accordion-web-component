interface CustomEventMap {
  accordionexpand: CustomEvent<string>;
  accordionclose: CustomEvent<string>;
}
declare global {
  interface HTMLElement {
    addEventListener<K extends keyof CustomEventMap>(
      type: K,
      listener: (this: Document, ev: CustomEventMap[K]) => void
    ): void;
  }
}
export {};
