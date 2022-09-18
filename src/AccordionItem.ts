import AccordionGroupElement from "./AccordionGroup";

const template = document.createElement("template");
template.innerHTML = `<style>:host{--accordion-padding: 1rem; --accordion-animation-time: 0.25s; display: flex; flex-direction: column; background-color: #ffffff; border-radius: 10px; padding: 0; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16); width: 15rem; margin-bottom: 1rem;}button#accordion-header{display: flex; justify-content: space-between; align-items: center; width: 100%; padding: var(--accordion-padding); background-color: transparent; border: none; font-size: 1rem; font-family: inherit; cursor: pointer;}button#accordion-header > svg{transform: rotateX(180deg); transition: var(--accordion-animation-time) ease-in-out transform;}div#accordion-content{display: flex; flex-direction: column; will-change: max-height; max-height: 0; transition: var(--accordion-animation-time) ease-in-out max-height; overflow-y: hidden; padding: 0 var(--accordion-padding);}::slotted(*:last-child){margin-bottom: var(--accordion-padding);}@media (prefers-reduced-motion){div#accordion-content{transition: none;}}</style>
<button id="accordion-header">
  <slot name="header"></slot>
  <svg id="accordion-expander" width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.885 11L9 4.64257L2.115 11L0 9.0428L9 0.714286L18 9.0428L15.885 11Z" fill="#686569"/>
  </svg>
</button>
<div id="accordion-content" inert="true">
  <slot id="content-slot"></slot>
</div>`;

export default class AccordionItemElement extends HTMLElement {
  #id = self.crypto.randomUUID();

  #isOpened = false;

  get opened() {
    return this.#isOpened;
  }

  #parentAccordionGroupElement =
    this.closest<AccordionGroupElement>("accordion-group");
  #headerElement: HTMLButtonElement;
  #contentElement: HTMLDivElement;
  #expanderIconElement: SVGElement;
  #contentSlot: HTMLSlotElement;

  #getExpandEvent() {
    return new CustomEvent<string>("accordionexpand", {
      bubbles: true,
      cancelable: true,
      detail: this.#id,
    });
  }

  #getCloseEvent() {
    return new CustomEvent<string>("accordionclose", {
      bubbles: true,
      cancelable: true,
      detail: this.#id,
    });
  }

  close() {
    this.#contentElement.style.maxHeight = "0";
    this.#expanderIconElement.style.transform = "rotateX(180deg)";
    this.#contentElement.setAttribute("aria-expanded", "true");
    this.#contentElement.setAttribute("inert", "true");
    this.#isOpened = false;
    this.dispatchEvent(this.#getCloseEvent());
  }

  open(): void {
    this.#contentElement.style.maxHeight = `${
      this.#contentElement.scrollHeight
    }px`;
    this.#expanderIconElement.style.transform = "rotateX(0)";
    this.#contentElement.setAttribute("aria-expanded", "false");
    this.#contentElement.removeAttribute("inert");
    this.#isOpened = true;
    this.dispatchEvent(this.#getExpandEvent());
  }

  #onHeaderClick(e: Event): void {
    e.stopPropagation();
    if (this.#isOpened) {
      this.close();
    } else {
      this.open();
    }
  }

  #onAnotherAccordionOpen(event: CustomEvent<string>): void {
    const { detail: id, defaultPrevented } = event;
    if (
      defaultPrevented ||
      id === this.#id ||
      !this.#isOpened ||
      this.#parentAccordionGroupElement?.allowMultipleOpen
    ) {
      return;
    }
    this.close();
  }

  #onContentChange(): void {
    if (this.#isOpened) {
      this.#contentElement.style.maxHeight = `${
        this.#contentElement.scrollHeight
      }px`;
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    if (this.#parentAccordionGroupElement) {
      this.#parentAccordionGroupElement.addEventListener<"accordionexpand">(
        "accordionexpand",
        this.#onAnotherAccordionOpen.bind(this)
      );
    }

    // save shadow dom elements to private properties so that they can be
    // manipulated in open() and close() functions
    this.shadowRoot!.appendChild(template.content.cloneNode(true));
    this.#headerElement = this.shadowRoot!.querySelector(
      "button#accordion-header"
    )!;
    this.#contentElement = this.shadowRoot!.querySelector(
      "div#accordion-content"
    )!;
    this.#expanderIconElement = this.shadowRoot!.querySelector(
      "svg#accordion-expander"
    )!;
    this.#contentSlot = this.shadowRoot!.querySelector("slot#content-slot")!;

    this.#contentSlot.onslotchange = this.#onContentChange.bind(this);
    this.#headerElement.onclick = this.#onHeaderClick.bind(this);
  }
}
