import { RouterData, RouterEntry } from '../../types/interfaces';
import Page from '../../utils/page';

export default class Router {
  private routes: RouterEntry<Page>;

  constructor() {
    this.routes = {};
  }

  public addRoute(components: RouterData<Page>[]) {
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
