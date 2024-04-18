import './header.css';
import ButtonCreator from '../../../utils/button-creator';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import WS from '../../websocket/websocket';
import assertIsDefined from '../../../types/asserts';
import { SessionStorage, WSRequest } from '../../../types/types';
import { ModalWindow, PagesPath, RequestUser } from '../../../types/enums';
import ModalView from '../modal/modal-view';
import Session from '../../session/session';
import Router from '../../router/router';
import SetPage from '../../set-page/set-page';

export default class HeaderView extends Component {
  static user: ElementCreator;

  private btnInfo: ButtonCreator;

  private btnLogout: ButtonCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    HeaderView.user = new ElementCreator('label', 'header__user', 'User: ');
    this.btnInfo = new ButtonCreator('btn header__info', 'button', 'About', false);
    this.btnLogout = new ButtonCreator('btn header__logout', 'button', 'Logout', false);
    this.createView();
  }

  private createView() {
    const user = HeaderView.user.getElement();
    const btnInfo = this.btnInfo.getElement();
    const btnLogout = this.btnLogout.getElement();
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      assertIsDefined(WS.socket);
      const request = Session.getSessionInfo();
      if (request?.isLogined) {
        this.logoutUser(request);
      }
    });

    btnInfo.addEventListener('click', (e) => {
      e.preventDefault();
      Router.addHistory(PagesPath.about);
      SetPage.setPage(Router.getView(PagesPath.about).render());
    });
    this.container.append(user, btnInfo, btnLogout);
  }

  private logoutUser(userData: SessionStorage) {
    const userInformation: WSRequest = {
      id: crypto.randomUUID(),
      type: RequestUser.userLogout,
      payload: {
        user: {
          login: userData.login,
          password: userData.password,
        },
      },
    };
    assertIsDefined(WS.socket);
    WS.socket.send(JSON.stringify(userInformation));
    WS.socket.onmessage = (e) => {
      const { data } = e;
      const message = JSON.parse(data);
      console.log(message);
      if (!message.payload.error) {
        console.log('Logout');
        ModalView.modalInfo('Logout');
        ModalView.addClass(ModalWindow.show);
        const userSession = {
          login: userData.login,
          password: userData.password,
          isLogined: message.payload.user.isLogined,
        };
        Session.setSessionInfo(userSession);
      }
      if (message.payload.error) {
        ModalView.modalError(message.payload.error);
        ModalView.addClass(ModalWindow.error);
      }
    };
  }

  static updateUserName(userName: string) {
    HeaderView.user.setTextContent(`User: ${userName}`);
  }
}
