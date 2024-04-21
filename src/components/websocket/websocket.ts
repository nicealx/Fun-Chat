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
    WS.socket.onerror = WS.onError;
    WS.socket.onclose = WS.onClose;
    WS.socket.onmessage = WS.onMessage;
  }

  static onError() {
    console.log('Error connection');
  }

  static onOpen() {
    ModalView.removeClass(ModalWindow.show);
    WS.reLoginUser();
    console.log('WS is ready');
  }

  static onClose() {
    ModalView.modalInfo('Waiting server connection');
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
      return;
    }

    if (message.type === RequestUser.userLogout) {
      WS.userLogout(e);
      return;
    }

    if (message.type === RequestUser.userActive) {
      WS.activeUsers(e);
      return;
    }

    if (message.type === RequestUser.userInactive) {
      WS.inactiveUsers(e);
      return;
    }

    if (message.type === RequestUser.userExLogin) {
      WS.externalLoginUsers(e);
      return;
    }

    if (message.type === RequestUser.userExLogout) {
      WS.externalLogoutUsers(e);
    }
  }

  static getActiveUsers() {
    const request = {
      id: RANDOM_ID,
      type: RequestUser.userActive,
      payload: null,
    };
    WS.socket.send(JSON.stringify(request));
  }

  static getInactiveUsers() {
    const request = {
      id: RANDOM_ID,
      type: RequestUser.userInactive,
      payload: null,
    };
    WS.socket.send(JSON.stringify(request));
  }

  static userLogin(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
    WS.getActiveUsers();
    WS.getInactiveUsers();
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

  static activeUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    if (!message.payload.error) {
      console.log(message);
    }
  }

  static inactiveUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    if (!message.payload.error) {
      console.log(message);
    }
  }

  static externalLoginUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    WS.getActiveUsers();
    console.log(message);
  }

  static externalLogoutUsers(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    WS.getInactiveUsers();
    console.log(message);
  }
}
