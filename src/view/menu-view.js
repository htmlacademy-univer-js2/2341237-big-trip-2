import AbstractView from '../framework/view/abstract-view.js';

const createMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
</nav>`
);

export default class MenuView extends AbstractView {
  get template () {
    return createMenuTemplate();
  }
}
