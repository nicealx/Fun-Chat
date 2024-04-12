export default class ButtonCreator {
  private element: HTMLButtonElement;

  constructor(
    className: string,
    type: 'submit' | 'reset' | 'button',
    text: string,
    state: boolean,
  ) {
    this.element = document.createElement('button');
    this.createElement(className, type, text, state);
  }

  private createElement(
    className: string,
    type: 'submit' | 'reset' | 'button',
    text: string,
    state: boolean,
  ) {
    this.setClass(className);
    this.setType(type);
    this.setTextContent(text);
    this.setState(state);
  }

  private setClass(className: string) {
    this.element.className = className;
  }

  private setType(type: 'submit' | 'reset' | 'button') {
    this.element.type = type;
  }

  private setTextContent(text: string) {
    this.element.textContent = text;
  }

  public setState(state: boolean) {
    this.element.disabled = state;
  }

  public getElement() {
    return this.element;
  }
}
