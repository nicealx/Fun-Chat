import ElementCreator from '../../../utils/element-creator';
import './modal.css';

export default class ModalView extends ElementCreator {
  static overlay: HTMLElement;

  private modal: ElementCreator;

  private modalText: ElementCreator;

  private modalLoading: ElementCreator;

  constructor(tag: string, className: string, text: string) {
    super(tag, className, text);
    ModalView.overlay = this.getElement();
    this.modal = new ElementCreator('div', 'modal', '');
    this.modalText = new ElementCreator('p', 'modal__text', 'Waiting server connection');
    this.modalLoading = new ElementCreator('div', 'modal__loading', '');
    this.createView();
  }

  private createView() {
    const modal = this.modalView();
    ModalView.overlay.append(modal);
  }

  private modalView() {
    const modal = this.modal.getElement();
    const loading = this.modalLoading.getElement();
    const textContent = this.modalText.getElement();
    modal.append(loading, textContent);
    return modal;
  }

  public static addClass(className: string) {
    ModalView.overlay.classList.add(className);
  }

  public static removeClass(className: string) {
    ModalView.overlay.classList.remove(className);
  }
}
