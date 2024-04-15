import './login.css';
import { UserInfo, UserValid } from '../../../types/interfaces';
import InputCreator from '../../../utils/input-creator';
import Page from '../../../utils/page';
import { InputPatterns, InputValid, ResponseUser } from '../../../types/enums';
import ButtonCreator from '../../../utils/button-creator';
import { UserData, WSRequestSuccess } from '../../../types/types';
import WS from '../../websocket/websocket';
import assertIsDefined from '../../../types/asserts';

export default class LoginView extends Page {
  private userInfo: UserInfo;

  private userValid: UserValid;

  private title;

  private login: InputCreator | null;

  private password: InputCreator | null;

  private spanLogin;

  private spanPassword;

  private loginBtn: ButtonCreator | null;

  private infoBtn: ButtonCreator | null;

  private ws: WS;

  constructor(tag: string, className: string, ws: WS) {
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
      `The field cannot be empty, 
      must be longer than
      ${InputValid.password}
      characters.`,
    );
    this.login = null;
    this.password = null;
    this.loginBtn = null;
    this.infoBtn = null;
    this.ws = ws;
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

    this.loginBtn = new ButtonCreator('btn login__btn', 'button', 'Confirm', true);

    this.infoBtn = new ButtonCreator('btn info__btn', 'button', 'About', false);
  }

  private addCallbacks() {
    assertIsDefined(this.login);
    const login = this.login.getElement();
    assertIsDefined(this.password);
    const password = this.password.getElement();
    assertIsDefined(this.loginBtn);
    const loginBtn = this.loginBtn.getElement();
    assertIsDefined(this.infoBtn);
    const infoBtn = this.infoBtn.getElement();

    this.inputHandler(login, new RegExp(InputPatterns.login, 'm'));
    this.inputHandler(password, new RegExp(InputPatterns.password, 'm'));
    loginBtn.addEventListener('click', async () => {
      this.setUser({
        login: login.value,
        password: password.value,
      });
    });
    infoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      infoBtn.dispatchEvent(new CustomEvent('press-about', { bubbles: true }));
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
        nextElement.classList.remove('show');
        elem.classList.remove('error');
        this.userValid[inputName] = true;
        this.userInfo[inputName] = elem.value;
        assertIsDefined(this.loginBtn);
        this.loginBtn.setState(this.checkInput());
      } else {
        nextElement.classList.add('show');
        elem.classList.add('error');
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

  private setUser(userData: UserData) {
    const userInformation: WSRequestSuccess = {
      id: crypto.randomUUID(),
      type: ResponseUser.userLogin,
      payload: {
        user: {
          login: userData.login,
          password: userData.password,
        },
      },
    };

    const userSession = {
      login: userData.login,
      password: userData.password,
      isLogined: this.ws.getIsLogined(),
    };
    this.ws.userAuthentication(userInformation);
    sessionStorage.setItem('user', JSON.stringify(userSession));
  }

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

  private createView() {
    assertIsDefined(this.login);
    const login = this.login.getElement();
    assertIsDefined(this.password);
    const password = this.password.getElement();
    assertIsDefined(this.loginBtn);
    const loginBtn = this.loginBtn.getElement();
    assertIsDefined(this.infoBtn);
    const infoBtn = this.infoBtn.getElement();
    this.container.append(
      this.title,
      login,
      this.spanLogin,
      password,
      this.spanPassword,
      loginBtn,
      infoBtn,
    );
  }
}
