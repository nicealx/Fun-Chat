export enum InputValid {
  login = 3,
  password = 4,
}

export enum InputErrorClass {
  error = 'error',
}

export enum PagesPath {
  main = '/',
  login = '/login',
  chat = '/chat',
  about = '/about',
}

export enum InputPatterns {
  login = '([a-zA-Z].{3})$',
  password = '([a-zA-Z0-9].{3})$',
}

export enum ServerURL {
  url = 'ws://localhost:4000',
}

export enum ResponseUser {
  userLogin = 'USER_LOGIN',
  userLogout = 'USER_LOGOUT',
  userExLogin = 'USER_EXTERNAL_LOGIN',
  userExLogout = 'USER_EXTERNAL_LOGOUT',
  userActive = 'USER_ACTIVE',
}

export enum ResponseMessage {
  msgFromUser = 'MSG_FROM_USER',
  msgDeliver = 'MSG_DELIVER',
  msgRead = 'MSG_READ',
  msgDelete = 'MSG_DELETE',
  msgEdit = 'MSG_EDIT',
}

export enum ResponseError {
  error = 'ERROR',
}

export enum ModalWindow {
  show = 'show',
  error = 'error',
}
