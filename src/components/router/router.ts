import { RouterData, RouterEntry } from '../../types/interfaces';
import Component from '../../utils/component';

export default class Router {
  private routes: RouterEntry<Component>;

  constructor() {
    this.routes = {};
  }

  public addRoute(components: RouterData<Component>[]) {
    components.forEach((component) => {
      const { path, page } = component;
      this.routes[path] = page;
    });
  }

  public addHistory(path: string) {
    window.history.pushState({}, '', window.location.origin + path);
  }

  public getRoute() {
    return this.routes;
  }
}
