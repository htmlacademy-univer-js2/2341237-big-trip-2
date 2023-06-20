import { render, remove, RenderPosition } from '../framework/render.js';
import PointView from '../view/point-view.js';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #destinationsModel = null;
  #offersModel = null;
  #destinations = null;
  #offers = null;
  #pointListContainer = null;
  #creatingPointComponent = null;
  #changeData = null;
  #destroyCallback = null;

  destroy = () => {
    if (this.#creatingPointComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#creatingPointComponent);
    this.#creatingPointComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  constructor({pointListContainer, changeData, destinationsModel, offersModel}) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#creatingPointComponent !== null) {
      return;
    }
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#creatingPointComponent = new PointView({
      destinations: this.#destinations,
      offers: this.#offers,
      isNewPoint: true
    });
    this.#creatingPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#creatingPointComponent.setResetClickHandler(this.#handleResetClick);

    render(this.#creatingPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  };



  setSaving = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    this.#creatingPointComponent.shake(this.#resetFormState);
  };

  #handleResetClick = () => {
    this.destroy();
  };

  #resetFormState = () => {
    this.#creatingPointComponent.updateElement({
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    });
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };



  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}

