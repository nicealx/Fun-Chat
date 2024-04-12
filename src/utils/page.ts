export default abstract class Page {
  protected container: HTMLElement;

  constructor(tag: string, className: string) {
    this.container = document.createElement(tag);
    this.container.classList.add(className);
  }

  render() {
    return this.container;
  }
}
