import './content.css';
import Component from '../../../utils/component';
import ContactsView from './contacts/contacts-view';
import DialogView from './dialog/dialog-view';

export default class ContentView extends Component {
  private contacts: ContactsView;

  private dialog: DialogView;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.contacts = new ContactsView('aside', 'contacts');
    this.dialog = new DialogView('article', 'dialog');
    this.createView();
  }

  private createView() {
    const contacts = this.contacts.render();
    const dialog = this.dialog.render();
    this.container.append(contacts, dialog);
  }
}
