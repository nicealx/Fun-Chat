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
  }

  static connect() {
    WS.socket = new WebSocket(SERVER_URL);
    WS.socket.onopen = WS.onOpen;
    WS.socket.onerror = WS.onError;
    WS.socket.onclose = WS.onClose;
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
    }, 100);
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
}
