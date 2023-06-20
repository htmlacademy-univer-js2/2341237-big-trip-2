import AbstractView from '../framework/view/abstract-view.js';

const createEmptyInfoTemplate = () => (
  `<p class="trip-events__msg">
  Sorry, there was an error loading the data
  </p>`);

export default class EmptyInfoView extends AbstractView {
  get template() {
    return createEmptyInfoTemplate();
  }
}

