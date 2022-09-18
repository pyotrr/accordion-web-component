import AccordionItemElement from "./AccordionItem";

const template = document.createElement("template");
template.innerHTML = `<style>:host{display:flex;flex-direction:column;}</style><slot></slot>`;

export default class AccordionGroupElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).appendChild(
      template.content.cloneNode(true)
    );
  }

  allowMultipleOpen = false;

  static get observedAttributes() {
    return ["allowmultipleopen"];
  }

  attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
    this.allowMultipleOpen = !(newValue === "false" || !newValue);
    if (!this.allowMultipleOpen) {
      const openedChildAccordions = Array.from(
        this.querySelectorAll<AccordionItemElement>("accordion-item")
      ).filter((accordionElement) => accordionElement.opened);
      if (openedChildAccordions.length < 2) {
        return;
      }
      openedChildAccordions.forEach((accordionElement, i) => {
        if (i === 0) {
          return;
        }
        accordionElement.close();
      });
    }
  }
}
