import { ServerURL } from '../../types/enums';
import WS from '../websocket/websocket';
import LoginView from './login/login-view';

export default class AppView {
  private container: HTMLElement;

  public readonly ws: WS;

  private isLogged: boolean;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.ws = new WS(ServerURL.url);
    this.isLogged = false;
  }

  public render() {
    this.checkLogged();
    const loginPage = new LoginView('div', 'login', this.ws);
    this.setPage(loginPage.render());
  }

  private checkLogged() {
    const socket = this.ws;
    socket.getSocket().addEventListener('message', (e) => {
      const { data } = e;
      const message = JSON.parse(data);
      const sessionUser = this.getUser();
      if (!message.payload.error && message.payload.user.isLogined === sessionUser.isLogined) {
        this.isLogged = true;
      } else {
        this.isLogged = false;
      }
    });
  }

  private getUser() {
    let userInfo = null;
    const getInfo = sessionStorage.getItem('user');
    if (getInfo) {
      userInfo = JSON.parse(getInfo);
    }

    return userInfo;
  }

  private setPage(page: HTMLElement) {
    this.container.innerHTML = '';
    this.container.append(page);
  }
}
