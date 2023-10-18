import { searchCities, getWeatherByCity } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon /* , url */ } = cityInfo;

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);

  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */

function showData(data) {
  const ul = document.querySelector('#cities');
  data.forEach((element) => {
    const div = document.createElement('div');
    div.className = 'city';
    const divHeader = document.createElement('div');
    divHeader.className = 'city-heading';
    const title = document.createElement('p');
    title.className = 'city-name';
    title.innerHTML = element.name;
    divHeader.appendChild(title);
    const country = document.createElement('p');
    country.innerHTML = element.country;
    divHeader.appendChild(country);
    div.appendChild(divHeader);
    const btnForecast = document.createElement('button');
    btnForecast.className = 'city-forecast-button';
    btnForecast.innerHTML = 'Show Forecast';
    div.appendChild(btnForecast);
    ul.appendChild(div);
  });
}

function showForest(data) {
  data.forEach(async (element, index) => {
    const dataForest = await getWeatherByCity(element.url);
    const cityHeading = document.querySelectorAll('.city-heading');
    const cityInfoContainer = document.createElement('div');
    cityInfoContainer.classList = 'city-info-container';
    const cityTempContainer = document.createElement('div');
    cityTempContainer.classList = 'city-temp-container';
    const condition = document.createElement('p');
    condition.innerHTML = dataForest.condition;
    cityTempContainer.appendChild(condition);
    const temp = document.createElement('p');
    temp.innerHTML = `${dataForest.temp}°C`;
    temp.classList = 'city-temp';
    cityTempContainer.appendChild(temp);
    cityInfoContainer.appendChild(cityTempContainer);
    const img = document.createElement('img');
    img.src = dataForest.icon;
    cityInfoContainer.appendChild(img);
    cityHeading[index].insertAdjacentElement('afterend', cityInfoContainer);
  });
}
export async function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');

  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  const data = await searchCities(searchValue);
  if (data.length === 0) {
    alert('Nenhuma cidade encontrada');
  } else {
    showData(data);
    showForest(data);
  }
}
