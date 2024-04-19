import assertIsDefined from '../../types/asserts';
import { RANDOM_ID, SERVER_URL } from '../../types/constants';
import { ModalWindow, RequestUser } from '../../types/enums';
import { SessionStorage, WSRequest } from '../../types/types';
import ModalView from '../view/modal/modal-view';

export default class WS {
  static socket: WebSocket | null;

  constructor() {
    WS.socket = null;
    WS.connect();
  }

  static connect() {
    WS.socket = new WebSocket(SERVER_URL);
    WS.socket.onerror = WS.onError;
    WS.socket.onopen = WS.onOpen;
    WS.socket.onclose = WS.onClose;
  }

  static onError() {
    console.log('Error connection');
  }

  static onOpen() {
    ModalView.removeClass(ModalWindow.show);
    console.log('WS is ready');
  }

  static onClose() {
    ModalView.modalInfo('Waiting server connection');
    setTimeout(() => {
      console.log('Wait server');
      WS.connect();
    }, 500);
  }

  static getActiveUser() {
    const request = {
      id: RANDOM_ID,
      type: RequestUser.userActive,
      payload: null,
    };
    if (WS.socket) {
      WS.socket.send(JSON.stringify(request));
      WS.socket.onmessage = (e: MessageEvent) => {
        console.log(e);
      };
    }
  }

  static getInactiveUser() {
    const request = {
      id: RANDOM_ID,
      type: RequestUser.userInactive,
      payload: null,
    };
    if (WS.socket) {
      WS.socket.send(JSON.stringify(request));
      WS.socket.onmessage = (e: MessageEvent) => {
        console.log(e);
      };
    }
  }

  static reLoginUser(userData: SessionStorage) {
    const userInformation: WSRequest = {
      id: RANDOM_ID,
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
  }

  static getSocket() {
    return WS.socket;
  }
}
