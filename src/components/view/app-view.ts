import { PagesPath } from '../../types/enums';
import ElementCreator from '../../utils/element-creator';
import Router from '../router/router';
import WS from '../websocket/websocket';
import AboutView from './about/about-view';
import LoginView from './login/login-view';
import ChatView from './chat/chat-view';
import ModalView from './modal/modal-view';
import Session from '../session/session';
import ErrorView from './error/error-view';
import SetPage from '../set-page/set-page';
import { PATH } from '../../types/constants';

export default class AppView {
  private container: HTMLElement;

  public main: ElementCreator;

  public readonly ws: WS;

  private isLogged: boolean;

  private router: Router;

  private modal: ModalView;

  private loginPage: LoginView;

  private aboutPage: AboutView;

  private chatPage: ChatView;

  private errorPage: ErrorView;

  private setPage: SetPage;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.main = new ElementCreator('main', 'main', '');
    this.modal = new ModalView();
    this.ws = new WS();
    this.router = new Router();
    this.setPage = new SetPage(this.main.getElement());
    this.isLogged = false;
    this.loginPage = new LoginView('div', 'login');
    this.aboutPage = new AboutView('div', 'about');
    this.chatPage = new ChatView('section', 'chat');
    this.errorPage = new ErrorView('div', 'error');
    Router.addRoute([
      { path: PagesPath.main, page: this.loginPage },
      { path: PagesPath.login, page: this.loginPage },
      { path: PagesPath.about, page: this.aboutPage },
      { path: PagesPath.chat, page: this.chatPage },
    ]);
  }

  public render() {
    const modal = ModalView.getElement();
    const main = this.main.getElement();
    this.container.append(modal, main);
    this.listeners();
  }

  private listeners() {
    window.addEventListener('load', () => {
      const paths: string[] = Object.values(PagesPath);
      if (paths.includes(PATH)) {
        this.currentPage(PATH);
        this.checkLogined(PATH);
      } else {
        SetPage.setPage(this.errorPage.render());
      }
    });
    window.addEventListener('popstate', () => {
      this.checkLogined(PATH);
    });
  }

  private checkLogined(path: string) {
    const request = Session.getSessionInfo();
    if (path === PagesPath.about) return;
    if (request?.isLogined) {
      this.chatPage.updateUserName(request.login);
      Router.addHistory(PagesPath.chat);
      this.currentPage(PagesPath.chat);
    } else {
      Router.addHistory(PagesPath.login);
      this.currentPage(PagesPath.login);
    }
  }

  private currentPage(path: string) {
    const view = Router.getView(path);
    SetPage.setPage(view.render());
  }
}
