import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDateTime } from '../utils/point.js';
import { capitalizeValue } from '../utils/common.js';
import { POINT_TYPES } from '../mock/point.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: dayjs(),
  dateTo: dayjs(),
  destinationId: 0,
  isFavorite: false,
  offerIds: [],
  type: POINT_TYPES[0],
};

const renderDestinationPictures = (pictures) => {
  let result = '';
  pictures.forEach((picture) => {
    result = `${result}<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  });
  return result;
};

const renderDestinationNames = (destinations) => {
  let result = '';
  destinations.forEach((destination) => {
    result = `${result}
    <option value="${destination.name}"></option>`;
  });
  return result;
};

const renderOffers = (allOffers, checkedOffers) => {
  let result = '';
  allOffers.forEach((offer) => {
    const checked = checkedOffers.includes(offer.id) ? 'checked' : '';
    result = `${result}
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
      <label class="event__offer-label" for="event-offer-${offer.id}">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;
  });
  return result;
};

const renderEditingPointDateTemplate = (dateFrom, dateTo) => (
  `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getDateTime(dateFrom)}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getDateTime(dateTo)}">
  </div>`
);

const renderEditingPointTypeTemplate = (currentType) => POINT_TYPES.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? 'checked' : ''}>
<label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${capitalizeValue(type)}</label>
</div>`).join('');

const createEditingPointTemplate = (point, destinations, offers, isNewPoint) => {
  const {basePrice, type, destinationId, dateFrom, dateTo, offerIds} = point;
  const allPointTypeOffers = offers.find((offer) => offer.type === type);
  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event ${type} icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${renderEditingPointTypeTemplate(type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${destinationId}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${destinationId}" type="text" name="event-destination" value="${he.encode(destinations[destinationId].name)}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${renderDestinationNames(destinations)}
          </datalist>
        </div>

        ${renderEditingPointDateTemplate(dateFrom, dateTo)}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${isNewPoint ? '<button class="event__reset-btn" type="reset">Cancel</button>' :
      `<button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">`}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${renderOffers(allPointTypeOffers.offers, offerIds)}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destinations[destinationId].description}</p>
          <div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${renderDestinationPictures(destinations[destinationId].pictures)}
                      </div>
                    </div>
        </section>
      </section>
    </form>
  </li>`
  );
};

export default class EditingPointView extends AbstractStatefulView {
  #destination = null;
  #offers = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #isNewPoint = null;

  constructor({point = BLANK_POINT, destination, offers, isNewPoint}) {
    super();
    this._state = EditingPointView.parsePointToState(point);
    this.#destination = destination;
    this.#offers = offers;
    this.#isNewPoint = isNewPoint;
    this.#setInnerHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  get template () {
    return createEditingPointTemplate(this._state, this.#destination, this.#offers, this.#isNewPoint);
  }

  setPreviewClickHandler = (callback) => {
    this._callback.previewClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#previewClickHandler);
  };

  #previewClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.previewClick();
  };

  reset = (point) => {
    this.updateElement(
      EditingPointView.parsePointToState(point),
    );
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setOuterHandlers();
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  };

  #pointDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: dayjs(userDate).toDate(),
    });
  };

  #pointDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate(),
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destination = this.#destination.find((dest) => dest.name === evt.target.value);
    this.updateElement({
      destinationId: destination.id,
    });
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: `${Number(evt.target.value).toString()}`,
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._state.offerIds = [];
    this.updateElement({
      type: evt.target.value,
    });
  };

  #setDatepickerFrom = () => {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          maxDate: this._state.dateTo,
          onChange: this.#pointDateFromChangeHandler,
        },
      );
    }
  };

  #setDatepickerTo = () => {
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          minDate: this._state.dateFrom,
          onChange: this.#pointDateToChangeHandler,
        },
      );
    }
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = Number(evt.target.id.slice(-1));
    const offerIds = this._state.offerIds.filter((n) => n !== offerId);
    let currentOfferIds = [...this._state.offerIds];
    if (offerIds.length !== this._state.offerIds.length) {
      currentOfferIds = offerIds;
    }
    else {
      currentOfferIds.push(offerId);
    }
    this._setState({
      offerIds: currentOfferIds,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditingPointView.parseStateToPoint(this._state));
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offersChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
  };

  #setOuterHandlers = () => {
    if (!this.#isNewPoint) {
      this.setPreviewClickHandler(this._callback.previewClick);
    }
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditingPointView.parseStateToPoint(this._state));
  };

  static parsePointToState = (point) => ({...point,
    dateTo: dayjs(point.dateTo).toDate(),
    dateFrom: dayjs(point.dateFrom).toDate()
  });

  static parseStateToPoint = (state) => {
    const point = {...state};
    return point;
  };
}
