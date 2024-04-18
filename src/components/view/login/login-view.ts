import './login.css';
import { UserInfo, UserValid } from '../../../types/interfaces';
import InputCreator from '../../../utils/input-creator';
import Component from '../../../utils/component';
import {
  InputErrorClass,
  InputPatterns,
  InputValid,
  ModalWindow,
  PagesPath,
  RequestUser,
} from '../../../types/enums';
import ButtonCreator from '../../../utils/button-creator';
import { SessionStorage, WSRequest } from '../../../types/types';
import WS from '../../websocket/websocket';
import assertIsDefined from '../../../types/asserts';
import ElementCreator from '../../../utils/element-creator';
import ModalView from '../modal/modal-view';
import Session from '../../session/session';
import Router from '../../router/router';

export default class LoginView extends Component {
  private userInfo: UserInfo;

  private userValid: UserValid;

  private title;

  private form: ElementCreator;

  private login: InputCreator | null;

  private password: InputCreator | null;

  private spanLogin;

  private spanPassword;

  private loginBtn: ButtonCreator | null;

  private btnInfo: ButtonCreator | null;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.userInfo = {
      login: '',
      password: '',
    };

    this.userValid = {
      login: false,
      password: false,
    };
    this.title = this.createTitle('h2', 'login__title', 'Authorization');
    this.spanLogin = this.createSpan(
      'login__msg',
      `The field cannot be empty,
      must be longer than
      ${InputValid.login}
      characters.`,
    );
    this.spanPassword = this.createSpan(
      'login__msg',
      `The field cannot be empty
      must be longer than ${InputValid.password}
      characters and contain at least one capital letter`,
    );
    this.form = new ElementCreator('form', 'login__form', '');
    this.login = null;
    this.password = null;
    this.loginBtn = null;
    this.btnInfo = null;
    this.createElements();
    this.addCallbacks();
    this.createView();
  }

  private createElements() {
    this.login = new InputCreator('input login__input', 'text', 'Enter login', false, 'login', '');
    this.password = new InputCreator(
      'input password__input',
      'password',
      'Enter password',
      false,
      'password',
      '',
    );

    this.loginBtn = new ButtonCreator('btn login__btn', 'submit', 'Confirm', true);

    this.btnInfo = new ButtonCreator('btn info__btn', 'button', 'About', false);
  }

  private addCallbacks() {
    const form = this.form.getElement();
    assertIsDefined(this.login);
    const login = this.login.getElement();
    assertIsDefined(this.password);
    const password = this.password.getElement();
    assertIsDefined(this.btnInfo);
    const btnInfo = this.btnInfo.getElement();

    this.inputHandler(login, new RegExp(InputPatterns.login, 'm'));
    this.inputHandler(password, new RegExp(InputPatterns.password, 'm'));
    btnInfo.addEventListener('click', (e) => {
      e.preventDefault();
      Router.addHistory(PagesPath.about);
      btnInfo.dispatchEvent(
        new CustomEvent('press-about', {
          bubbles: true,
          detail: {
            view: window.location.pathname,
          },
        }),
      );
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.loginUser({
        login: login.value,
        password: password.value,
      });
    });
  }

  private createTitle(tag: string, className: string, text: string) {
    const title = document.createElement(tag);
    title.className = className;
    title.textContent = text;

    return title;
  }

  private inputHandler(elem: HTMLInputElement, regexp: RegExp) {
    elem.addEventListener('input', () => {
      const nextElement = elem.nextSibling as HTMLElement;
      const inputName = elem.name;
      if (elem.value.match(regexp)) {
        nextElement.classList.remove(InputErrorClass.show);
        elem.classList.remove(InputErrorClass.error);
        this.userValid[inputName] = true;
        this.userInfo[inputName] = elem.value;
        assertIsDefined(this.loginBtn);
        this.loginBtn.setState(this.checkInput());
      } else {
        nextElement.classList.add(InputErrorClass.show);
        elem.classList.add(InputErrorClass.error);
        assertIsDefined(this.loginBtn);
        this.loginBtn.setState(this.checkInput());
        this.userValid[inputName] = false;
      }
    });
  }

  private createSpan(className: string, text: string) {
    const span = document.createElement('span');
    span.className = className;
    span.textContent = text;

    return span;
  }

  private loginUser(userData: SessionStorage) {
    const userInformation: WSRequest = {
      id: crypto.randomUUID(),
      type: RequestUser.userLogin,
      payload: {
        user: {
          login: userData.login,
          password: userData.password,
        },
      },
    };
    assertIsDefined(WS.socket);
    WS.socket.send(JSON.stringify(userInformation));
    WS.socket.onmessage = (e) => {
      const { data } = e;
      const message = JSON.parse(data);
      console.log(message);
      if (!message.payload.error) {
        ModalView.modalInfo('Authorization');
        ModalView.addClass(ModalWindow.show);
        const userSession = {
          login: userData.login,
          password: userData.password,
          isLogined: message.payload.user.isLogined,
        };
        Session.setSessionInfo(userSession);
        // this.successLogin();
      }
      if (message.payload.error) {
        ModalView.modalError(message.payload.error);
        ModalView.addClass(ModalWindow.error);
      }
    };
  }

  // private successLogin() {
  //   const request = Session.getSessionInfo();
  //   if (!request?.isLogined) {
  //     SetPage.setPage(this.prevPage.render(), this.chatPage.render());
  //     const t = setTimeout(() => {
  //       ModalView.removeClass(ModalWindow.show);
  //       clearTimeout(t);
  //     }, 500);
  //   }
  // }

  private checkInput() {
    let check = true;
    const loginLength = this.userInfo.login.length;
    const passLength = this.userInfo.password.length;
    const inputValid = Object.values(this.userValid).every((el) => el === true);
    if (loginLength >= InputValid.login && passLength >= InputValid.password && inputValid) {
      check = false;
    }
    return check;
  }

  private createForm() {
    const form = this.form.getElement();
    assertIsDefined(this.login);
    const login = this.login.getElement();
    assertIsDefined(this.password);
    const password = this.password.getElement();
    assertIsDefined(this.loginBtn);
    const loginBtn = this.loginBtn.getElement();
    assertIsDefined(this.btnInfo);
    const btnInfo = this.btnInfo.getElement();
    form.append(login, this.spanLogin, password, this.spanPassword, loginBtn, btnInfo);
    return form;
  }

  private createView() {
    const form = this.createForm();
    this.container.append(this.title, form);
  }
}
