import { render, RenderPosition, remove } from '../framework/render.js';
import PointsListView from '../view/point-list-view.js';
import SortingView from '../view/sorting-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './points-presenter.js';
import PointNewPresenter from './new-presenter.js';
import { sorting } from '../utils/sorting.js';
import { filter } from '../utils/filter.js';
import { UpdateType, UserAction, SortType, FilterType } from '../const.js';

export default class BoardPresenter {

  #tripContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #noPointComponent = null;
  #sortComponent = null;
  #pointListComponent = new PointsListView();

  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor(tripContainer, pointsModel, filterModel) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointNewPresenter = new PointNewPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#pointsModel);

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    sorting[this.#currentSortType](filteredPoints);
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
  }

  createPoint = (callback) => {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#pointNewPresenter.init(callback);
  };

  #handleModeChange = () => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort = () => {
    this.#sortComponent = new SortingView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#pointsModel, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints = () => {
    this.#noPointComponent = new NoPointView(this.#filterType);
    render(this.#noPointComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#tripContainer);
    this.#renderPoints(this.points);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    const points = this.points;
    const pointCount = points.length;

    if (pointCount === 0) {
      this.#renderNoPoints();
      return;
    }
    this.#renderSort();
    this.#renderPointList();
  };
}

