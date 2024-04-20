import { RANDOM_ID, SERVER_URL } from '../../types/constants';
import { ModalWindow, RequestUser } from '../../types/enums';
import { WSRequest } from '../../types/types';
import Session from '../session/session';
import ModalView from '../view/modal/modal-view';

export default class WS {
  static socket: WebSocket;

  constructor() {
    WS.socket = new WebSocket(SERVER_URL);
    WS.socket.onopen = WS.onOpen;
    WS.socket.onerror = WS.onError;
    WS.socket.onclose = WS.onClose;
    WS.socket.onmessage = WS.onMessage;
  }

  static connect() {
    WS.socket = new WebSocket(SERVER_URL);
    WS.socket.onopen = WS.onOpen;
  }

  static onError() {
    console.log('Error connection');
  }

  static onOpen() {
    ModalView.removeClass(ModalWindow.show);
    WS.socket.onerror = WS.onError;
    WS.socket.onclose = WS.onClose;
    WS.socket.onmessage = WS.onMessage;
    WS.reLoginUser();
    console.log('WS is ready');
  }

  static onClose() {
    ModalView.modalInfo('Waiting server connection');
    WS.socket.onopen = null;
    WS.socket.onerror = null;
    WS.socket.onclose = null;
    WS.socket.onmessage = null;
    setTimeout(() => {
      console.log('Wait server');
      WS.connect();
    }, 500);
  }

  static onMessage(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);

    if (message.type === RequestUser.userLogin) {
      WS.userLogin(e);
    }

    if (message.type === RequestUser.userLogout) {
      WS.userLogout(e);
    }

    if (message.type === RequestUser.userActive) {
      WS.getActiveUsers(e);
    }

    if (message.type === RequestUser.userInactive) {
      WS.getActiveUsers(e);
    }

    if (message.type === RequestUser.userExLogin) {
      WS.getExternalLoginUsers(e);
    }

    if (message.type === RequestUser.userExLogout) {
      WS.getExternalLogoutUsers(e);
    }
  }

  static userLogin(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }

  static userLogout(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }

  static reLoginUser() {
    const request = Session.getSessionInfo();
    if (request && request.isLogined) {
      const userInformation: WSRequest = {
        id: RANDOM_ID,
        type: RequestUser.userLogin,
        payload: {
          user: {
            login: request.login,
            password: request.password,
          },
        },
      };
      WS.socket.send(JSON.stringify(userInformation));
    }
  }

  static getActiveUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }

  static getInActiveUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }

  static getExternalLoginUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }

  static getExternalLogoutUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
  }
}
