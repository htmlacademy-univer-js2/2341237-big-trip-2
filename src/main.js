import { render } from './framework/render.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import NewPointBtnPresenter from './presenter/new-point-btn-presenter.js';
import MenuView from './view/menu-view.js';
import PointModel from './model/point-model.js';
import FiltersModel from './model/filters-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import PointApiService from './api-service/point-api-service.js';
import DestinationApiService from './api-service/destination-api-service.js';
import OfferApiService from './api-service/offer-api-service.js';
import { END_POINT, AUTHORIZATION } from './const.js';

const siteHeaderElement = document.querySelector('.trip-main');
const siteMainElement = document.querySelector('.page-main');

const pointsModel = new PointModel(new PointApiService(END_POINT, AUTHORIZATION));
const destinationsModel = new DestinationsModel(new DestinationApiService(END_POINT, AUTHORIZATION));
const offersModel = new OffersModel(new OfferApiService(END_POINT, AUTHORIZATION));

const filterModel = new FiltersModel();
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement.querySelector('.trip-controls__filters'),
  pointsModel: pointsModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel,
  filterModel: filterModel
});
filterPresenter.init();

const boardPresenter = new BoardPresenter({
  tripInfoContainer: siteHeaderElement.querySelector('.trip-main__trip-info'),
  tripContainer: siteMainElement.querySelector('.trip-events'),
  pointsModel: pointsModel,
  filterModel: filterModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});
boardPresenter.init();

const newPointButtonPresenter = new NewPointBtnPresenter({
  newPointButtonContainer: siteHeaderElement,
  destinationsModel: destinationsModel,
  pointsModel: pointsModel,
  offersModel: offersModel,
  boardPresenter: boardPresenter
});
newPointButtonPresenter.init();

offersModel.init().finally(() => {
  destinationsModel.init().finally(() => {
    pointsModel.init().finally(() => {
      newPointButtonPresenter.renderNewPointButton();
    });
  });
});

render(new MenuView(), siteHeaderElement.querySelector('.trip-controls__navigation'));
