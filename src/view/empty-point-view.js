import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

const createEmptyPointTemplate = (filterType) => {
  const EmptyPointTextValue = EmptyPointsTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${EmptyPointTextValue}
    </p>`);
};

const EmptyPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.FUTURE]: 'There are no future events now',
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
