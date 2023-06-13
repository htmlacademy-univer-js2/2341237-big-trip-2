import {createElement} from '../render.js';
import './abstract-view.css';

/** @const {string} */
const SHAKE_CLASS_NAME = 'shake';

/** @const {number} */
const SHAKE_ANIMATION_TIMEOUT = 600;


export default class AbstractView {
  /** @type {HTMLElement|null} */
  #element = null;

  /** @type {Object} */
  _callback = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  /**
   * @returns {HTMLElement}
   */
  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  /**
   * @abstract
   * @returns {string}
   */
  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement() {
    this.#element = null;
  }

  /**
   * @param {shakeCallback} [callback]
   */
  shake(callback) {
    this.element.classList.add(SHAKE_CLASS_NAME);
    setTimeout(() => {
      this.element.classList.remove(SHAKE_CLASS_NAME);
      callback?.();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

/**
 * @callback shakeCallback
 */
