import ButtonCreator from '../../../utils/button-creator';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import './error.css';

export default class ErrorView extends Component {
  private title: ElementCreator;

  private text: ElementCreator;

  private button: ButtonCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.title = new ElementCreator('h2', 'error__title', 'Error 404');
    this.text = new ElementCreator('p', 'error__text', 'Page is not found');
    this.button = new ButtonCreator('btn error__btn', 'button', 'Back', false);
    this.createView();
  }

  private createView() {
    const title = this.title.getElement();
    const text = this.text.getElement();
    const button = this.button.getElement();
    button.addEventListener('click', () => {
      window.history.back();
    });
    this.container.append(title, text, button);
  }
}
