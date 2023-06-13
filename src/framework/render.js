import AbstractView from './view/abstract-view.js';

/** @enum {string} */
const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

/**
 * @param {string} template
 * @returns {HTMLElement}
 */
function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

/**
 * @param {AbstractView} component
 * @param {HTMLElement} container
 * @param {string} place
 */
function render(component, container, place = RenderPosition.BEFOREEND) {
  if (!(component instanceof AbstractView)) {
    throw new Error('Can render only components');
  }

  if (container === null) {
    throw new Error('Container element doesn\'t exist');
  }

  container.insertAdjacentElement(place, component.element);
}

/**
 * @param {AbstractView} newComponent
 * @param {AbstractView} oldComponent
 */
function replace(newComponent, oldComponent) {
  if (!(newComponent instanceof AbstractView && oldComponent instanceof AbstractView)) {
    throw new Error('Can replace only components');
  }

  const newElement = newComponent.element;
  const oldElement = oldComponent.element;

  const parent = oldElement.parentElement;

  if (parent === null) {
    throw new Error('Parent element doesn\'t exist');
  }

  parent.replaceChild(newElement, oldElement);
}

/**
 * @param {AbstractView} component
 */
function remove(component) {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can remove only components');
  }

  component.element.remove();
  component.removeElement();
}

export {RenderPosition, createElement, render, replace, remove};
