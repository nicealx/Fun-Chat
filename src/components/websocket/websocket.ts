import assertIsDefined from '../../types/asserts';
import ServerURL from '../../types/constants';
import { WSRequestSuccess } from '../../types/types';

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
    console.log('WS is ready');
  }

  static onClose() {
    setTimeout(() => {
      console.log('Wait server');
      WS.connect();
    }, 1000);
  }

  static onMessage(e: MessageEvent) {
    const { data } = e;
    const message = JSON.parse(data);
    console.log(message);
    this.onClose();
  }

  public userAuthentication(data: WSRequestSuccess) {
    assertIsDefined(WS.socket);
    WS.socket.send(JSON.stringify(data));
  }

  public getIsLogined() {
    return WS.isLogined;
  }

  public getSocket() {
    return WS.socket;
  }
}
