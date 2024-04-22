import ButtonCreator from '../../../utils/button-creator';
import ElementCreator from '../../../utils/element-creator';
import Component from '../../../utils/component';
import './about.css';

const ABOUT_TEXT =
  'The Fun Chat application was developed as part of the RSSchool JS/FE 2023Q4 course.';

export default class AboutView extends Component {
  private title: ElementCreator;

  private text: ElementCreator;

  private button: ButtonCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.title = new ElementCreator('h2', 'about__title', 'About Fun Chat App');
    this.text = new ElementCreator('p', 'about__text', ABOUT_TEXT);
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
