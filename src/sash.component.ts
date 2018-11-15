import { html, TemplateResult, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./sash.component.css")}<style>`);

export class SashComponent extends HTMLElement {  
  constructor() {
    super();
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  connectedCallback() {   
    this.attachShadow({ mode: 'open' });
    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'sash');

    this._setEventListeners();
  }

  get template(): TemplateResult {
    return html`
      ${styles}
    `;
  }

  private _setEventListeners() {
    this.addEventListener("mousedown",this.onMouseDown);    
  }

  disconnectedCallback() {
    this.removeEventListener("mousedown",this.onMouseDown);
  }

  private _isActive:boolean;

  set isActive(value:boolean) { this._isActive = value; }

  get isActive() { return this._isActive; }

  onMouseDown(e: MouseEvent) {
    e.stopPropagation();
    
    this.isActive = true;

    this.dispatchEvent(new CustomEvent("didStart",{
      composed:true,
      detail: {
        startx:e.clientX,
        currentx:e.clientX,
        starty:e.clientY,
        currenty:e.clientY
      }  
    }));

    const onMouseMove = (e: MouseEvent) => {
      
      e.stopPropagation();
      
      this.dispatchEvent(new CustomEvent("didChange",{
        composed:true,
        detail: {          
          currentx:e.clientX,
          currenty:e.clientY
        }
      }));
    }
  
    const onMouseUp = (e: MouseEvent) => {
      e.stopPropagation();
      
      this.isActive = false;
  
      this.dispatchEvent(new CustomEvent("didEnd"));

      window.removeEventListener("mouseup", onMouseUp);

      window.removeEventListener("mousemove", onMouseMove);
    }
    
    window.addEventListener("mousemove", onMouseMove);

    window.addEventListener("mouseup", onMouseUp);
  }
}

customElements.define(`ce-sash`,SashComponent);
