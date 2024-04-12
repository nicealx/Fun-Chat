import AppView from '../view/app-view';

export default class App {
  private view: AppView;

  constructor() {
    this.view = new AppView();
  }

  public run() {
    this.view.render();
  }
}
