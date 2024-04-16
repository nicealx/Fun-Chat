import { ModalWindow } from '../../../types/enums';
import ElementCreator from '../../../utils/element-creator';
import './modal.css';

export default class ModalView {
  static overlay: ElementCreator;

  static modal: ElementCreator;

  static modalClose: ElementCreator;

  static modalText: ElementCreator;

  static modalLoading: ElementCreator;

  constructor() {
    ModalView.overlay = new ElementCreator('div', 'overlay', '');
    ModalView.modal = new ElementCreator('div', 'modal', '');
    ModalView.modalClose = new ElementCreator('div', 'modal__close', 'x');
    ModalView.modalText = new ElementCreator('p', 'modal__text', 'Waiting server connection');
    ModalView.modalLoading = new ElementCreator('div', 'modal__loading', '');
  }

  static createView() {
    const modal = this.modalView();
    ModalView.overlay.getElement().append(modal);
  }

  static modalView() {
    const modal = ModalView.modal.getElement();
    const close = ModalView.modalClose.getElement();
    const loading = ModalView.modalLoading.getElement();
    const text = ModalView.modalText.getElement();
    close.addEventListener('click', () => {
      ModalView.removeClass(ModalWindow.show);
    });
    modal.append(close, loading, text);
    return modal;
  }

  static modalInfo() {
    ModalView.removeClass(ModalWindow.error);
    ModalView.updateTextContent('Waiting server connection');
    ModalView.addClass(ModalWindow.show);
  }

  static modalError(text: string) {
    ModalView.addClass(ModalWindow.error);
    ModalView.updateTextContent(text);
    ModalView.addClass(ModalWindow.show);
  }

  static updateTextContent(text: string) {
    ModalView.modalText.setTextContent(text);
  }

  static addClass(className: string) {
    ModalView.overlay.getElement().classList.add(className);
  }

  static removeClass(className: string) {
    ModalView.overlay.getElement().classList.remove(className);
  }

  static getElement() {
    ModalView.createView();
    return ModalView.overlay.getElement();
  }
}
