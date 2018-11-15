import { html, TemplateResult, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./split-view.component.css")}<style>`);

export class SplitViewComponent extends HTMLElement {
  
  constructor() {
    super();
    this.onSashDidStart = this.onSashDidStart.bind(this);
    this.onSashDidChange = this.onSashDidChange.bind(this);
  }
  
  connectedCallback() {   
    this.attachShadow({ mode: 'open' });
    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'splitview');

    this.style.setProperty("--grid-left-column-width",`${this.leftPanelWidth}px`); 
  }

  sashCurrentx:number;

  get leftPanelWidth() {
    return +(<HTMLElement>this.children[1]).offsetWidth;
  }

  get template(): TemplateResult {
    return html`
      ${styles}
      <slot name='left'></slot>
      <ce-sash @didStart=${this.onSashDidStart} 
        @didChange=${this.onSashDidChange}></ce-sash>
      <slot name='right'></slot>
    `;
  }

  onSashDidStart(e:CustomEvent) {    
    this.sashCurrentx = +e.detail["startx"];
  }

  onSashDidChange(e:CustomEvent) {
    const change = this.sashCurrentx - (+e.detail["currentx"]);
    
    this.style.setProperty("--grid-left-column-width",`${this.leftPanelWidth - change}px`);

    this.sashCurrentx = (+e.detail["currentx"]);
  }
}

customElements.define(`ce-split-view`,SplitViewComponent);
