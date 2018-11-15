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
  
  static get observedAttributes () {
    return [
      "main-panel-height",
      "main-panel-width"
    ];
  }

  connectedCallback() {   
    this.attachShadow({ mode: 'open' });

    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'splitview');
  }

  sashCurrentx:number;

  sashCurrenty:number;

  get layout(): SplitViewLayout {     
    return this.classList.contains("vertical") 
    ? SplitViewLayout.vertical 
    : SplitViewLayout.horizontal; 
  }

  get mainPanel():HTMLElement { return <HTMLElement>this.querySelector('[slot=main]'); }

  private _mainPanelWidth:number;

  private _mainPanelHeight:number;

  get mainPanelWidth(): number { 
    if(!this._mainPanelWidth) {
      const style = getComputedStyle(this);
      this._mainPanelWidth = +style.getPropertyValue("--grid-main-panel-width").replace('px','');       
    }
      
    return this._mainPanelWidth;   
  }

  set mainPanelWidth(value:number) { 
    this.style.setProperty("--grid-main-panel-width",`${this.mainPanelWidth}px`);
    this._mainPanelWidth = value; 
  }

  get mainPanelHeight():number { 
    if(!this._mainPanelHeight) {   
      const style = getComputedStyle(this); 
      this._mainPanelHeight = +style.getPropertyValue("--grid-main-panel-height").replace('px','');   
    }

    return this._mainPanelHeight; 
  } 

  set mainPanelHeight(value:number) { 
    this.style.setProperty("--grid-main-panel-height",`${this.mainPanelHeight}px`);
    this._mainPanelHeight = value; 
  }

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

    if(this.layout == SplitViewLayout.vertical)
      this.mainPanelWidth = this.mainPanelWidth - this.sashCurrentx + currentx;
    
    if(this.layout == SplitViewLayout.horizontal)  {     
      console.log(this._mainPanelHeight);
      this.mainPanelHeight = this.mainPanelHeight - this.sashCurrenty + currenty;
    }

    this.sashCurrentx = currentx;

    this.sashCurrenty = currenty;
  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
       
    }
  }
}

customElements.define(`ce-split-view`,SplitViewComponent);
