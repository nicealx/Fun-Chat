import assertIsDefined from '../../types/asserts';
import ServerURL from '../../types/constants';
import { ModalWindow } from '../../types/enums';
import { WSRequestSuccess } from '../../types/types';
import ModalView from '../view/modal/modal-view';

export default class WS {
  static socket: WebSocket | null;

  static isLogined: boolean;

  constructor() {
    WS.socket = null;
    WS.isLogined = false;
    WS.connect();
  }

  static connect() {
    WS.socket = new WebSocket(ServerURL);
    WS.socket.onerror = WS.onError;
    WS.socket.onopen = WS.onOpen;
    WS.socket.onclose = WS.onClose;
    WS.socket.onmessage = WS.onMessage;
  }

  static onError() {
    console.log('Error connection');
  }

  static onOpen() {
    ModalView.removeClass(ModalWindow.show);
    console.log('WS is ready');
  }

  static onClose() {
    ModalView.modalInfo();
    setTimeout(() => {
      console.log('Wait server');
      WS.connect();
    }, 500);
  }

  static onMessage(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    if (message.payload.error === 'incorrect password') {
      ModalView.modalError('Incorrect password');
    }
  }

  static userAuthentication(data: WSRequestSuccess) {
    assertIsDefined(WS.socket);
    WS.socket.send(JSON.stringify(data));
  }

  static getIsLogined() {
    return WS.isLogined;
  }

  static getSocket() {
    return WS.socket;
  }
}
