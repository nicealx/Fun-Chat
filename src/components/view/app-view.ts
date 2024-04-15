import Router from '../router/router';
import WS from '../websocket/websocket';
import LoginView from './login/login-view';
import ModalView from './modal/modal-view';

export default class AppView {
  private container: HTMLElement;

  public readonly ws: WS;

  private isLogged: boolean;

  private router: Router;

  private modal: ModalView;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.ws = new WS();
    this.router = new Router();
    this.isLogged = false;
    this.modal = new ModalView('div', 'overlay', '');
  }

  public async render() {
    const modal = this.modal.getElement();
    this.container.append(modal);
    const loginPage = new LoginView('div', 'login', this.ws);
    this.router.addRoute([{ path: '/login', page: loginPage }]);
    this.setPage(loginPage.render(), null);
  }

  private setPage(currentPage: HTMLElement, prevPage: HTMLElement | null) {
    if (prevPage) this.container.removeChild(prevPage);
    this.container.append(currentPage);
  }
}
