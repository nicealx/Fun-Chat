import { RouterData, RouterEntry } from '../../types/interfaces';
import Component from '../../utils/component';

export default class Router {
  static routes: RouterEntry<Component>;

  constructor() {
    Router.routes = {};
  }

  static addRoute(components: RouterData<Component>[]) {
    components.forEach((component) => {
      const { path, page } = component;
      Router.routes[path] = page;
    });
  }

  static addHistory(path: string) {
    window.history.pushState(
      {},
      '',
      window.location.origin.replace(window.location.href, '') + path,
    );
  }

  static getView(path: string) {
    return Router.routes[path];
  }

  static getRoute() {
    return Router.routes;
  }
}
