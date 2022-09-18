import "./style.css";
import AccordionItemElement from "./AccordionItem";
import AccordionGroupElement from "./AccordionGroup";

if (!customElements.get("accordion-group")) {
  customElements.define("accordion-group", AccordionGroupElement);
}
if (!customElements.get("accordion-item")) {
  customElements.define("accordion-item", AccordionItemElement);
}

document.addEventListener("accordionexpand", () => {
  console.log("expand");
});
document.addEventListener("accordionclose", () => {
  console.log("close");
});

const buttonElement =
  document.querySelector<HTMLButtonElement>("button#add-child")!;
buttonElement.addEventListener("click", () => {
  const div = document.createElement("div");
  div.textContent = "New child";
  document.querySelector("accordion-item")!.appendChild(div);
});

const toggleButton = document.querySelector("button#toggle")!;
const lastAccordion = Array.from(
  document.querySelectorAll<AccordionItemElement>("accordion-item")
).at(-1)!;
toggleButton.addEventListener("click", () => {
  if (lastAccordion.opened) {
    lastAccordion.close();
  } else {
    lastAccordion.open();
  }
});

const accordionGroup =
  document.querySelector<AccordionGroupElement>("accordion-group")!;

const checkbox = document.querySelector<HTMLInputElement>("input#checkbox")!;
checkbox.addEventListener("change", (e) => {
  accordionGroup.setAttribute(
    "allowmultipleopen",
    (e.target as HTMLInputElement).checked.toString()
  );
});
