export default class Observable {
  /** @type {Set<observerCallback>}  */
  #observers = new Set();

  /**
   * @param {observerCallback} observer
   */
  addObserver(observer) {
    this.#observers.add(observer);
  }

  /**
   * @param {observerCallback} observer
   */
  removeObserver(observer) {
    this.#observers.delete(observer);
  }

  /**
   * @param {*} event
   * @param {*} payload
   */
  _notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}

/**
 * @callback observerCallback
 * @param {*} event
 * @param {*} [payload]
 */
