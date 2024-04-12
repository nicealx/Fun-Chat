export default class InputCreator {
  private element: HTMLInputElement;

  constructor(
    className: string,
    type: string,
    placeholder: string,
    state: boolean,
    name: string,
    value: string,
  ) {
    this.element = document.createElement('input');
    this.element.required = true;
    this.createElement(className, type, placeholder, state, name, value);
  }

  private createElement(
    className: string,
    type: string,
    placeholder: string,
    state: boolean,
    name: string,
    value: string,
  ) {
    this.setClass(className);
    this.setType(type);
    this.setPlaceholder(placeholder);
    this.setState(state);
    this.setName(name);
    this.setValue(value);
  }

  private setClass(className: string) {
    this.element.className = className;
  }

  private setType(type: string) {
    this.element.type = type;
  }

  private setPlaceholder(placeholder: string) {
    this.element.placeholder = placeholder;
  }

  private setName(name: string) {
    this.element.name = name;
  }

  public setValue(value: string) {
    this.element.value = value;
  }

  public setState(state: boolean) {
    this.element.disabled = state;
  }

  public getElement() {
    return this.element;
  }
}
