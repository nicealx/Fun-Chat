import './content.css';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import WS from '../../websocket/websocket';
import { RANDOM_ID } from '../../../types/constants';
import { RequestUser } from '../../../types/enums';
import { GetUsers } from '../../../types/types';
import Session from '../../session/session';
import InputCreator from '../../../utils/input-creator';

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

  private search: InputCreator;

  private dialog: ElementCreator;

  private usersList: HTMLElement[];

  private ul: ElementCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.contacts = new ElementCreator('aside', 'contacts', '');
    this.dialog = new ElementCreator('article', 'dialog', '');
    this.usersList = [];
    this.search = new InputCreator(
      'input contacts__search',
      'text',
      'Enter search name',
      false,
      'search',
      '',
    );
    this.ul = new ElementCreator('ul', 'users__list', '');
    this.contactsContent();
    this.createView();
  }

  private sortUserList() {
    return this.usersList.sort((first, second) => {
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
  }

  private createUserItem(e: MessageEvent) {
    const data = JSON.parse(e.data);
    if (data.payload.users) {
      const usersList: GetUsers[] = data.payload.users;
      const userSession = Session.getSessionInfo();
      usersList.forEach((user) => {
        if (userSession && user.login !== userSession.login) {
          const check = this.usersList.some((el) => el.textContent === user.login);
          if (!check) {
            const li = new ElementCreator('li', 'user users__item', '');
            const status = new ElementCreator('span', 'user__status', '');
            const name = new ElementCreator('span', 'user__name', user.login);
            this.changeStatus(user, li.element);
            li.element.append(status.element, name.element);
            this.usersList.push(li.element);
          }
        }
      });
    }
    if (data.payload.user) {
      const { user } = data.payload;
      const check = this.usersList.some((el) => el.textContent === user.login);
      if (!check) {
        const li = new ElementCreator('li', 'user users__item', '');
        const status = new ElementCreator('span', 'user__status', '');
        const name = new ElementCreator('span', 'user__name', user.login);
        this.changeStatus(user, li.element);
        li.element.append(status.element, name.element);
        this.usersList.push(li.element);
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
        this.ul.clearContent();
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
          this.ul.element.append(...this.sortUserList());
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
          this.ul.element.append(...this.sortUserList());
        }
      });
    }
  }

  private userExLogin() {
    if (WS.socket.readyState === 1) {
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userExLogin) {
          this.usersList.forEach((li) => {
            const userName = data.payload.user.login;
            if (li.textContent === userName) {
              this.changeStatus(data.payload.user, li);
            }
          });
          this.createUserItem(e);
          this.ul.element.append(...this.sortUserList());
        }
      });
    }
  }

  private userExLogout() {
    if (WS.socket.readyState === 1) {
      WS.socket.addEventListener('message', (e) => {
        const data = JSON.parse(e.data);
        if (data.type === RequestUser.userExLogout) {
          this.usersList.forEach((li) => {
            const userName = data.payload.user.login;
            if (li.textContent === userName) {
              this.changeStatus(data.payload.user, li);
            }
          });
          this.createUserItem(e);
          this.ul.element.append(...this.sortUserList());
        }
      });
    }
  }

  private searchUser(string: string) {
    let char = '';
    char += string;
    const userList = this.usersList.filter((el) => {
      if (!el.textContent) return '';
      return el.textContent.toLowerCase().startsWith(char.toLowerCase());
    });
    this.ul.clearContent();
    this.ul.element.append(...userList);
  }

  private contactsContent() {
    const contacts = this.contacts.element;
    const search = this.search.getElement();
    const usersList = this.ul.element;
    search.addEventListener('keyup', () => {
      this.searchUser(search.value);
    });
    this.userLogin();
    this.userLogout();
    contacts.append(search, usersList);
  }

  private createView() {
    const contacts = this.contacts.element;
    const dialog = this.dialog.element;
    this.container.append(contacts, dialog);
  }
}
