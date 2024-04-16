import { PagesPath } from '../../types/enums';
import ElementCreator from '../../utils/element-creator';
import Router from '../router/router';
import WS from '../websocket/websocket';
import AboutView from './about/about-view';
import LoginView from './login/login-view';
import ModalView from './modal/modal-view';

export default class AppView {
  private container: HTMLElement;

  private main: ElementCreator;

  public readonly ws: WS;

  private isLogged: boolean;

  private router: Router;

  private modal: ModalView;

  private loginPage: LoginView;

  private aboutPage: AboutView;

  private currentPage: LoginView | AboutView;

  private prevPage: LoginView | AboutView;

  constructor() {
    this.container = document.body;
    this.container.className = 'body';
    this.main = new ElementCreator('main', 'main', '');
    this.ws = new WS();
    this.router = new Router();
    this.isLogged = false;
    this.modal = new ModalView();
    this.loginPage = new LoginView('div', 'login');
    this.aboutPage = new AboutView('div', 'about');
    this.currentPage = this.loginPage;
    this.prevPage = this.loginPage;
    this.router.addRoute([
      { path: PagesPath.login, page: this.loginPage },
      { path: PagesPath.about, page: this.aboutPage },
    ]);
    this.listeners();
  }

  public render() {
    const modal = ModalView.getElement();
    const main = this.main.getElement();
    this.container.append(modal, main);
    if (window.location.pathname === PagesPath.about) {
      this.setPage(this.loginPage.render(), null);
    }
    this.setPage(this.loginPage.render(), null);
  }

  private listeners() {
    document.addEventListener('press-about', () => {
      // this.router.addHistory(PagesPath.about);
      this.currentPage = this.aboutPage;
      this.prevPage = this.loginPage;
      this.setPage(this.currentPage.render(), this.prevPage.render());
    });
    document.addEventListener('press-back', () => {
      // this.router.addHistory(PagesPath.login);
      this.currentPage = this.loginPage;
      this.prevPage = this.aboutPage;
      this.setPage(this.currentPage.render(), this.prevPage.render());
    });
  }

  private setPage(currentPage: HTMLElement, prevPage: HTMLElement | null) {
    const main = this.main.getElement();
    if (prevPage) main.removeChild(prevPage);
    main.append(currentPage);
  }
}
