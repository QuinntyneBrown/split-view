import { html, TemplateResult, render } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./split-view-panel.component.css")}<style>`);

export class SplitViewPanelComponent extends HTMLElement {
  
  static get observedAttributes () {
    return [];
  }

  connectedCallback() {   

    this.attachShadow({ mode: 'open' });
    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'splitviewpanel');

    this._bind();
    this._setEventListeners();
  }

  get template(): TemplateResult {
    return html`
      ${styles}
      <slot></slot> 
    `;
  }

  private async _bind() {

  }

  private _setEventListeners() {

  }

  disconnectedCallback() {

  }

  attributeChangedCallback (name, oldValue, newValue) {
    switch (name) {
      default:
        break;
    }
  }
}

customElements.define(`ce-split-view-panel`,SplitViewPanelComponent);
