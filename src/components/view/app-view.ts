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

  private currentPath: string;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.main = new ElementCreator('main', 'main', '');
    this.modal = new ModalView();
    this.ws = new WS();
    this.router = new Router();
    this.isLogged = false;
    this.loginPage = new LoginView('div', 'login');
    this.aboutPage = new AboutView('div', 'about');
    this.chatPage = new ChatView('section', 'chat');
    this.errorPage = new ErrorView('div', 'error');
    this.currentPath = '';
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

    const request = Session.getSessionInfo();
    if (request?.isLogined) {
      this.chatPage.updateUserName(request.login);
      this.setPage(this.chatPage.render());
    } else {
      this.setPage(this.loginPage.render());
    }
    this.listeners();
  }

  private listeners() {
    document.addEventListener('press-about', ((e: CustomEvent) => {
      const { view } = e.detail;
      if (view) {
        this.setPage(this.aboutPage.render());
      }
    }) as EventListener);

    window.addEventListener('popstate', () => {
      this.currentPage(this.currentPath);
    });

    window.addEventListener('load', () => {
      this.currentPath = window.location.href.replace(`${window.location.origin}/`, '');
      const paths: string[] = Object.values(PagesPath);
      if (paths.includes(this.currentPath)) {
        this.currentPage(this.currentPath);
      } else {
        this.setPage(this.errorPage.render());
      }
    });
  }

  private currentPage(path: string) {
    const view = Router.getView(path);
    this.setPage(view.render());
  }

  private setPage(currentPage: HTMLElement) {
    const main = this.main.getElement();
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }
    main.append(currentPage);
  }
}
