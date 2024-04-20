export default class SetPage {
  static main: HTMLElement;

  constructor(container: HTMLElement) {
    SetPage.main = container;
  }

  static currentPage(currentPage: HTMLElement) {
    const { main } = SetPage;
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.append(currentPage);
  }
}
