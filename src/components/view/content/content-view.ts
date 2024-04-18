import './content.css';
import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';

export default class ContentView extends Component {
  private contacts: ElementCreator;

  private dialog: ElementCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.contacts = new ElementCreator('aside', 'contacts', '');
    this.dialog = new ElementCreator('article', 'dialog', '');
    this.createView();
  }

  private createView() {
    const contacts = this.contacts.getElement();
    const dialog = this.dialog.getElement();
    this.container.append(contacts, dialog);
  }
}
