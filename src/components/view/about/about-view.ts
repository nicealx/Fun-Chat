import ButtonCreator from '../../../utils/button-creator';
import ElementCreator from '../../../utils/element-creator';
import Component from '../../../utils/component';
import './about.css';

export default class AboutView extends Component {
  private title: ElementCreator;

  private text: ElementCreator;

  private button: ButtonCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.title = new ElementCreator('h2', 'about__title', 'About App');
    this.text = new ElementCreator('p', 'about__text', 'Some text');
    this.button = new ButtonCreator('btn about__btn', 'button', 'Back', false);
    this.addCallbacks();
    this.createView();
  }

  private addCallbacks() {
    const button = this.button.getElement();
    button.addEventListener('click', () => {
      window.history.back();
    });
  }

  private createView() {
    const title = this.title.getElement();
    const text = this.text.getElement();
    const button = this.button.getElement();
    this.container.append(title, text, button);
  }
}
