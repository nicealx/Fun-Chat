import './login.css';
import { UserInfo, UserValid } from '../../../types/interfaces';
import InputCreator from '../../../utils/input-creator';
import Page from '../../../utils/page';
import { InputPatterns, InputValid, ResponseUser } from '../../../types/enums';
import ButtonCreator from '../../../utils/button-creator';
import { UserData, WSRequestSuccess } from '../../../types/types';
import WS from '../../websocket/websocket';

export default class LoginView extends Page {
  private userInfo: UserInfo;

  private userValid: UserValid;

  private title;

  private login: InputCreator;

  private password: InputCreator;

  private spanLogin;

  private spanPassword;

  private btn: ButtonCreator;

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
    this.login = new InputCreator('input login__input', 'text', 'Enter login', false, 'login', '');
    this.password = new InputCreator(
      'input password__input',
      'password',
      'Enter password',
      false,
      'password',
      '',
    );
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

    this.btn = new ButtonCreator('btn login__btn', 'button', 'Confirm', true);
    this.ws = ws;
    this.addCallbacks();
  }

  private addCallbacks() {
    const login = this.login.getElement();
    const password = this.password.getElement();
    const btn = this.btn.getElement();

    this.inputHandler(login, new RegExp(InputPatterns.login, 'm'));
    this.inputHandler(password, new RegExp(InputPatterns.password, 'm'));
    btn.addEventListener('click', () => {
      this.setUser({
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
        nextElement.classList.remove('show');
        elem.classList.remove('error');
        this.userValid[inputName] = true;
        this.userInfo[inputName] = elem.value;
        this.btn.setState(this.checkInput());
      } else {
        nextElement.classList.add('show');
        elem.classList.add('error');
        this.btn.setState(this.checkInput());
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
      isLogined: true,
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

  render() {
    this.container.append(
      this.title,
      this.login.getElement(),
      this.spanLogin,
      this.password.getElement(),
      this.spanPassword,
      this.btn.getElement(),
    );

    return this.container;
  }
}
