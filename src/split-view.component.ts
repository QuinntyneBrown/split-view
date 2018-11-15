import { html, TemplateResult, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./split-view.component.css")}<style>`);

export const enum SplitViewLayout {
  vertical, 
  horizontal
}

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

    
      if(this.classList.contains("vertical"))
        this.style.setProperty("--grid-main-panel-width",`${this.mainPanelWidth}px`);
      
      if(this.classList.contains("horizontal"))
        this.style.setProperty("--grid-main-panel-height",`${this.mainPanelHeight}px`);
  }

  sashCurrentx:number;

  sashCurrenty:number;

  get layout(): SplitViewLayout { 
    return this.classList.contains("vertical") 
    ? SplitViewLayout.vertical 
    : SplitViewLayout.horizontal; 
  }

  get mainPanel():HTMLElement { return <HTMLElement>this.querySelector('[slot=main]'); }

  get mainPanelWidth(): number { return +this.mainPanel.offsetWidth; }

  get mainPanelHeight():number { return +this.mainPanel.offsetHeight; } 

  get template(): TemplateResult {
    return html`
      ${styles}
      <slot name='main'></slot>
      <ce-sash @didStart=${this.onSashDidStart} 
        @didChange=${this.onSashDidChange}></ce-sash>
      <slot name='secondary'></slot>
    `;
  }

  onSashDidStart(e:CustomEvent) {    
    this.sashCurrentx = +e.detail["startx"];
    this.sashCurrenty = +e.detail["starty"];
  }

  onSashDidChange(e:CustomEvent) {

    const currentx = +e.detail["currentx"];
    const currenty = +e.detail["currenty"];
    
    console.log(`${this.mainPanelWidth - this.sashCurrentx - currentx}px`);

    if(this.layout == SplitViewLayout.vertical) {
      this.style.setProperty("--grid-main-panel-width",`${this.mainPanelWidth - this.sashCurrentx + currentx}px`);
    }
    
    if(this.layout == SplitViewLayout.horizontal) {       
      this.style.setProperty("--grid-main-panel-height",`${this.mainPanelHeight - this.sashCurrenty + currenty}px`);
    }

    this.sashCurrentx = currentx;

    this.sashCurrenty = currenty;
  }
}

customElements.define(`ce-split-view`,SplitViewComponent);
