import Component from '../../../utils/component';
import ContentView from '../content/content-view';
import FooterView from '../footer/footer-view';
import HeaderView from '../header/header-view';
import './chat.css';

export default class ChatView extends Component {
  private header: HeaderView;

  private content: ContentView;

  private footer: FooterView;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.header = new HeaderView('header', 'header');
    this.content = new ContentView('section', 'content');
    this.footer = new FooterView('footer', 'footer');
    this.createView();
  }

  private createView() {
    const header = this.header.render();
    const content = this.content.render();
    const footer = this.footer.render();
    this.container.append(header, content, footer);
  }
}
