import Router from '../router/router';
import WS from '../websocket/websocket';
import LoginView from './login/login-view';

export default class AppView {
  private container: HTMLElement;

  public readonly ws: WS;

  private isLogged: boolean;

  private router: Router;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.ws = new WS();
    this.router = new Router();
    this.isLogged = false;
  }

  public async render() {
    this.isLogged = this.ws.getIsLogined();
    const loginPage = new LoginView('div', 'login', this.ws);
    this.router.addRoute([{ path: '/login', page: loginPage }]);
    this.setPage(loginPage.render());
  }

  private setPage(page: HTMLElement) {
    this.container.innerHTML = '';
    this.container.append(page);
  }
}
