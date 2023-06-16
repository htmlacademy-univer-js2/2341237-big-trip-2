import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const EmptyPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
};

const createEmptyPointTemplate = (filterType) => {
  const noPointTextValue = EmptyPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${noPointTextValue}
    </p>`);
};

export default class EmptyPointView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyPointTemplate(this.#filterType);
  }
}
