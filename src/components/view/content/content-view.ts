import './content.css';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import { RANDOM_ID } from '../../../types/constants';
import { RequestUser } from '../../../types/enums';
import WS from '../../websocket/websocket';

export default class ContentView extends Component {
  private contacts: ElementCreator;

  private dialog: ElementCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.contacts = new ElementCreator('aside', 'contacts', '');
    this.dialog = new ElementCreator('article', 'dialog', '');
    this.createView();
    this.activeUsers();
  }

  private activeUsers() {
    const request = {
      id: RANDOM_ID,
      type: RequestUser.userActive,
      payload: null,
    };

    if (WS.socket) {
      if (WS.socket.readyState === 1) {
        WS.socket.send(JSON.stringify(request));
        WS.socket.onmessage = (e: MessageEvent) => {
          const { data } = e;
          const message = JSON.parse(data);
          console.log(message);
        };
      }
    }
  }

  private createView() {
    const contacts = this.contacts.getElement();
    const dialog = this.dialog.getElement();
    this.container.append(contacts, dialog);
  }
}
