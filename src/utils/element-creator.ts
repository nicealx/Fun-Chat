export default class ElementCreator {
  public element: HTMLElement;

  constructor(tag: string, className: string, text: string) {
    this.element = document.createElement(tag);
    this.createElement(className, text);
  }

  private createElement(className: string, text: string) {
    this.setClass(className);
    this.setTextContent(text);
  }

  public setTextContent(text: string) {
    this.element.textContent = text;
  }

  public addClass(className: string) {
    this.element.classList.add(className);
  }

  public removeClass(className: string) {
    this.element.classList.remove(className);
  }

  private setClass(className: string) {
    this.element.className = className;
  }

  public clearContent() {
    this.element.innerHTML = '';
  }

  public getElement() {
    return this.element;
  }
}
