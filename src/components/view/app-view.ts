import LoginView from './login/login-view';

export default class AppView {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
  }

  public render() {
    const loginPage = new LoginView('div', 'login');
    this.setPage(loginPage.render());
  }

  private setPage(page: HTMLElement) {
    this.container.innerHTML = '';
    this.container.append(page);
  }
}
