import './content.css';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import WS from '../../websocket/websocket';
import { RANDOM_ID } from '../../../types/constants';
import { RequestMessage, RequestUser } from '../../../types/enums';
import { GetUsers, MessageData, WSRequestMessage } from '../../../types/types';
import Session from '../../session/session';
import InputCreator from '../../../utils/input-creator';
import ButtonCreator from '../../../utils/button-creator';

const requestUserActive = {
  id: RANDOM_ID,
  type: RequestUser.userActive,
  payload: null,
};
const requestUserInactive = {
  id: RANDOM_ID,
  type: RequestUser.userInactive,
  payload: null,
};

export default class ContentView extends Component {
  private contacts: ElementCreator;

  private searchField: InputCreator;

  private dialogHeader: ElementCreator;

  private dialogUserName: ElementCreator;

  private dialogUserStatus: ElementCreator;

  private dialogContent: ElementCreator;

  private dialogForm: ElementCreator;

  private messageInput: InputCreator;

  private messageButton: ButtonCreator;

  private dialog: ElementCreator;

  private userCollection: HTMLElement[];

  private usersList: ElementCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.contacts = new ElementCreator('aside', 'contacts', '');
    this.dialog = new ElementCreator('article', 'dialog', '');
    this.userCollection = [];
    this.searchField = new InputCreator(
      'input contacts__search',
      'text',
      'Enter search name',
      false,
      'search',
      '',
    );
    this.dialogHeader = new ElementCreator('div', 'dialog__header', '');
    this.dialogUserName = new ElementCreator('span', 'dialog__user-name', '');
    this.dialogUserStatus = new ElementCreator('span', 'dialog__user-status', '');
    this.dialogContent = new ElementCreator(
      'div',
      'dialog__content',
      'Select user and write your first message.',
    );
    this.dialogForm = new ElementCreator('form', 'dialog__field', '');
    this.messageInput = new InputCreator(
      'input dialog__text',
      'text',
      'Enter your message',
      true,
      'message',
      '',
    );
    this.messageButton = new ButtonCreator('btn dialog__send', 'submit', 'Send', true);
    this.usersList = new ElementCreator('ul', 'users__list', '');
    this.listeners();
    this.contactsContent();
    this.dialogContents();
    this.createView();
  }

  private sortUserList() {
    return this.userCollection.sort((first, second) => {
      if (
        first.classList.contains('users__item-active') >
        second.classList.contains('users__item-active')
      ) {
        return -1;
      }
      if (
        first.classList.contains('users__item-active') <
        second.classList.contains('users__item-active')
      ) {
        return 1;
      }
      return 0;
    });
  }

  private changeStatus(user: GetUsers, li: HTMLElement) {
    if (user.isLogined) {
      li.classList.add('users__item-active');
    } else {
      li.classList.remove('users__item-active');
    }
    if (user.login === this.dialogUserName.getElement().textContent && user.isLogined) {
      this.dialogUserStatus.setTextContent('online');
      this.dialogUserStatus.addClass('dialog__status--online');
    } else if (user.login === this.dialogUserName.getElement().textContent) {
      this.dialogUserStatus.setTextContent('offline');
      this.dialogUserStatus.removeClass('dialog__status--online');
    }
  }

  private createUserItem(e: MessageEvent) {
    const data = JSON.parse(e.data);
    if (data.payload.users) {
      const userCollection: GetUsers[] = data.payload.users;
      const userSession = Session.getSessionInfo();
      userCollection.forEach((user) => {
        if (userSession && user.login !== userSession.login) {
          const check = this.userCollection.some((el) => el.textContent === user.login);
          if (!check) {
            const li = new ElementCreator('li', 'user users__item', '');
            const status = new ElementCreator('span', 'user__status', '');
            const name = new ElementCreator('span', 'user__name', user.login);
            this.changeStatus(user, li.getElement());
            li.getElement().append(status.getElement(), name.getElement());
            this.userCollection.push(li.getElement());
          }
        }
      });
    }
    if (data.payload.user) {
      const { user } = data.payload;
      const check = this.userCollection.some((el) => el.textContent === user.login);
      if (!check) {
        const li = new ElementCreator('li', 'user users__item', '');
        const status = new ElementCreator('span', 'user__status', '');
        const name = new ElementCreator('span', 'user__name', user.login);
        this.changeStatus(user, li.getElement());
        li.getElement().append(status.getElement(), name.getElement());
        this.userCollection.push(li.getElement());
      }
    }
  }

  private userLogin() {
    WS.socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (data.type === RequestUser.userLogin) {
        this.userActive();
        this.userInactive();
        this.userExLogin();
        this.userExLogout();
      }
    });
  }

  private userLogout() {
    WS.socket.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      if (data.type === RequestUser.userLogout) {
        this.usersList.clearContent();
      }
    });
  }

  private userActive() {
    if (WS.socket.readyState === 1) {
      WS.socket.send(JSON.stringify(requestUserActive));
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userActive) {
          this.createUserItem(e);
          this.usersList.getElement().append(...this.sortUserList());
        }
      });
    }
  }

  private userInactive() {
    if (WS.socket.readyState === 1) {
      WS.socket.send(JSON.stringify(requestUserInactive));
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userInactive) {
          this.createUserItem(e);
          this.usersList.getElement().append(...this.sortUserList());
        }
      });
    }
  }

  private userExLogin() {
    if (WS.socket.readyState === 1) {
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userExLogin) {
          this.userCollection.forEach((li) => {
            const userName = data.payload.user.login;
            if (li.textContent === userName) {
              this.changeStatus(data.payload.user, li);
            }
          });
          this.createUserItem(e);
          this.usersList.getElement().append(...this.sortUserList());
        }
      });
    }
  }

  private userExLogout() {
    if (WS.socket.readyState === 1) {
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userExLogout) {
          this.userCollection.forEach((li) => {
            const userName = data.payload.user.login;
            if (li.textContent === userName) {
              this.changeStatus(data.payload.user, li);
            }
          });
          this.createUserItem(e);
          this.usersList.getElement().append(...this.sortUserList());
        }
      });
    }
  }

  private searchUser(string: string) {
    let char = '';
    char += string;
    const userList = this.userCollection.filter((el) => {
      if (!el.textContent) return '';
      return el.textContent.toLowerCase().startsWith(char.toLowerCase());
    });
    this.usersList.clearContent();
    this.usersList.getElement().append(...userList);
  }

  private contactsContent() {
    const contacts = this.contacts.getElement();
    const searchField = this.searchField.getElement();
    const userCollection = this.usersList.getElement();
    this.userLogin();
    this.userLogout();
    contacts.append(searchField, userCollection);
  }

  private dialogContents() {
    const dialog = this.dialog.getElement();
    const dialogUserName = this.dialogUserName.getElement();
    const dialogUserStatus = this.dialogUserStatus.getElement();
    const dialogHeader = this.dialogHeader.getElement();
    const dialogContent = this.dialogContent.getElement();
    const messageInput = this.messageInput.getElement();
    const messageButton = this.messageButton.getElement();
    const dialogForm = this.dialogForm.getElement();
    dialogHeader.append(dialogUserName, dialogUserStatus);
    dialogForm.append(messageInput, messageButton);
    dialog.append(dialogHeader, dialogContent, dialogForm);
  }

  private sendMessage(userData: MessageData) {
    const messageInformation: WSRequestMessage = {
      id: RANDOM_ID,
      type: RequestMessage.msgSend,
      payload: {
        message: {
          to: userData.to,
          text: userData.text,
        },
      },
    };
    WS.socket.send(JSON.stringify(messageInformation));
    if (WS.socket.readyState === 1) {
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestMessage.msgSend) {
          console.log(data);
        }
      });
    }
  }

  private contactsHandler(e: Event) {
    const target = (e.target as HTMLElement).closest('.users__item');
    const inputForm = this.messageInput.getElement();
    if (!target) return;
    this.usersList.getElement().childNodes.forEach((el) => {
      (el as HTMLElement).classList.remove('users__item--select');
    });
    target.classList.add('users__item--select');
    if (target.textContent) {
      const userName = target.textContent;
      this.dialogUserName.setTextContent(userName);
      this.messageInput.setState(false);
      this.dialogContent.setTextContent('');
      inputForm.value = '';
      this.stateMessageButton(inputForm.value);
    } else {
      this.messageInput.setState(true);
      this.messageButton.setState(true);
    }
    const userStatus = target.classList.contains('users__item-active');
    if (userStatus) {
      this.dialogUserStatus.setTextContent('online');
      this.dialogUserStatus.addClass('dialog__status--online');
    } else {
      this.dialogUserStatus.setTextContent('offline');
      this.dialogUserStatus.removeClass('dialog__status--online');
    }
  }

  private stateMessageButton(value: string) {
    if (value.length === 0) {
      this.messageButton.setState(true);
    } else {
      this.messageButton.setState(false);
    }
  }

  private listeners() {
    const searchField = this.searchField.getElement();
    const usersList = this.usersList.getElement();
    const inputForm = this.messageInput.getElement();
    const dialogForm = this.dialogForm.getElement();
    searchField.addEventListener('keyup', () => {
      this.searchUser(searchField.value);
    });
    usersList.addEventListener('click', (e: Event) => this.contactsHandler(e));
    dialogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userNameTo = this.dialogUserName.getElement().textContent;
      if (userNameTo) {
        const messageData: MessageData = {
          to: userNameTo,
          text: inputForm.value,
        };
        this.sendMessage(messageData);
        inputForm.value = '';
        this.messageButton.setState(true);
      }
    });
    inputForm.addEventListener('keyup', () => {
      this.stateMessageButton(inputForm.value);
    });
  }

  private createView() {
    const contacts = this.contacts.getElement();
    const dialog = this.dialog.getElement();
    this.container.append(contacts, dialog);
  }
}
