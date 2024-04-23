import Component from '../../../utils/component';
import ElementCreator from '../../../utils/element-creator';
import './footer.css';

export default class FooterView extends Component {
  private className: string;

  private author: ElementCreator;

  private school: ElementCreator;

  constructor(tag: string, className: string) {
    super(tag, className);
    this.className = className;
    this.author = new ElementCreator('div', `${this.className}__author`, '');
    this.school = new ElementCreator('div', `${this.className}__school`, '');
    this.createView();
  }

  private authorContent() {
    const avatarElement = new ElementCreator('span', `${this.className}__author-avatar`, '');
    const linkElement = new ElementCreator('a', `${this.className}__author-link`, 'nicealx');
    const avatar = avatarElement.getElement();
    const link = linkElement.getElement();
    link.setAttribute('href', 'https://github.com/nicealx');
    link.append(avatar);
    return link;
  }

  private yearContent() {
    const yearElement = new ElementCreator('span', `${this.className}__year`, '2024');
    const year = yearElement.getElement();
    return year;
  }

  private schoolContent() {
    const linkElement = new ElementCreator('a', `${this.className}__school-link`, '');
    const logoElement = new ElementCreator('span', `${this.className}__school-logo`, '');

    const schoolLogo = logoElement.getElement();
    const schoolLink = linkElement.getElement();
    schoolLink.setAttribute('href', 'https://rs.school');
    schoolLink.append(schoolLogo);

    return schoolLink;
  }

  private createView() {
    const author = this.author.getElement();
    const school = this.school.getElement();
    const link = this.authorContent();
    const year = this.yearContent();
    const schoolLink = this.schoolContent();
    const schoolText = new ElementCreator(
      'span',
      `${this.className}__school-name`,
      'Rolling Scopes School',
    );
    const schoolName = schoolText.getElement();
    author.append(link);
    school.append(schoolLink, schoolName);
    this.container.append(author, year, school);
  }
}
