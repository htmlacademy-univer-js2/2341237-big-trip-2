import AbstractView from './abstract-view.js';

export default class AbstractStatefulView extends AbstractView {
  /** @type {Object} */
  _state = {};

  /**
   * @param {Object} update
   */
  updateElement(update) {
    if (!update) {
      return;
    }

    this._setState(update);

    this.#rerenderElement();
  }

  /**
   * @abstract
   */
  _restoreHandlers() {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }

  /**
   * @param {Object} update
   */
  _setState(update) {
    this._state = structuredClone({...this._state, ...update});
  }

  #rerenderElement() {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }
}
