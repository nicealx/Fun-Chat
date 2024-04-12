export enum InputValid {
  login = 3,
  password = 4,
}

export enum PagesPath {
  login = '/login',
  chat = '/chat',
  main = '/',
  about = '/about',
}

export enum InputPatterns {
  login = '([a-zA-Z].{3})$',
  password = '([a-zA-Z0-9].{3})$',
}
