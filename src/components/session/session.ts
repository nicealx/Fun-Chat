import { SessionStorage } from '../../types/types';

export default class Session {
  static getSessionInfo(): SessionStorage | undefined {
    const userInfo = sessionStorage.getItem('user');
    let res;
    if (userInfo) {
      res = JSON.parse(userInfo);
    } else {
      res = undefined;
    }
    console.log(res);
    return res;
  }

  static setSessionInfo(data: SessionStorage) {
    sessionStorage.setItem('user', JSON.stringify(data));
  }
}
