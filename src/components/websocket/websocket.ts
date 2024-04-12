import { ServerURL } from '../../types/enums';
import { WSRequestSuccess } from '../../types/types';

export default class WS {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.onOpen();
  }

  public onOpen() {
    this.socket.addEventListener('close', this.onClose);
    this.socket.addEventListener('open', () => {
      console.log('WS is ready');
    });
  }

  private onClose() {
    this.socket.removeEventListener('open', this.onOpen);
    this.socket.removeEventListener('close', this.onClose);
    this.socket = new WebSocket(ServerURL.url);
    this.socket.addEventListener('open', this.onOpen);
  }

  public userAuthentication(data: WSRequestSuccess) {
    this.socket.send(JSON.stringify(data));
  }

  public getSocket() {
    return this.socket;
  }
}
