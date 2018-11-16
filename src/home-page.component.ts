import { html, TemplateResult, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { SplitViewComponent } from "./split-view.component";

const styles = unsafeHTML(`<style>${require("./home-page.component.css")}<style>`);

export class HomePageComponent extends HTMLElement {
  constructor() {
    super();
    this._toggle = this._toggle.bind(this);
  }
  
  connectedCallback() {   
    this.attachShadow({ mode: 'open' });
    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'homepage');
  }

  get template(): TemplateResult {
    return html`
      ${styles}
      <ce-split-view>                
        <div slot="secondary">
            <h1>Secondary</h1>
        </div>

        <div slot="main">
            <h1>Main</h1>
            <a @click=${this._toggle}>Toggle</a>        
        </div>             
      </ce-split-view>      
    `;
  }

  get splitView():SplitViewComponent { return this.shadowRoot.querySelector("ce-split-view") as SplitViewComponent; }

  private _toggle($event) {    
    if(this.splitView.getAttribute("show-secondary-panel") != "true") {
      this.splitView.setAttribute("show-secondary-panel","true");
    } else {
      this.splitView.removeAttribute("show-secondary-panel");
    }
  }
}

customElements.define(`ce-home-page`,HomePageComponent);
