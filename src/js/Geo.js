/* eslint-disable class-methods-use-this */
export default class Geo {
  constructor(callback) {
    this.callback = callback;

    this.checkValidity = this.checkValidity.bind(this);
  }

  geo() {
    this.promiseThroughAPI().then((coords) => {
      this.callback(coords);
    }).catch(() => {
      this.askCoords();
    });
  }

  promiseThroughAPI() {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        }, (error) => {
          reject(error);
        });
      });
    }

    return new Promise((resolve, reject) => reject(new Error('No Geolocation API')));
  }

  askCoords() {
    this.modal = document.createElement('div');
    this.modal.classList.add('timeline_geo');
    this.modal.innerHTML = `
      <form class="timeline_geo_form">
        <div>
          <p>Нам не удалось определить Ваше местоположение. Предоставьте разрешение на определение геолокации, либо
            введите координаты вручную.</p>
          <p>Широта и долгота через запятую:</p>
        </div>
        <div class="timeline_geo_container">
          <input name="geo_input" class="timeline_geo_input" placeholder="00.00000, 00.00000">
        </div>
        <div class="timeline_geo_controls">
          <button type="submit">OK</button>
          <button type="button" class="timeline_geo_close">Отмена</button>
        </div>
      </form>`;
    document.body.append(this.modal);
    this.modal.querySelector('.timeline_geo_input').focus();
    this.modal.querySelector('.timeline_geo_close').addEventListener('click', () => this.modal.remove());
    this.modal.querySelector('form.timeline_geo_form').addEventListener('submit', this.checkValidity);
  }

  checkValidity(event) {
    event.preventDefault();
    const geoInput = this.geoInputFormat(this.modal.querySelector('.timeline_geo_input').value);
    if (geoInput.error) {
      this.geoShowError(this.modal.querySelector('.timeline_geo_input'), 'Введите значение в формате 00.00, 00.00');
      return;
    }

    this.callback(geoInput);
    this.modal.remove();
  }

  geoInputFormat(value) {
    const position = value.split(',').map((coord) => coord.match(/[+|−|-|—|-]?\d{1,3}\.\d+/));

    if (!position[0] || !position[1]) {
      return { error: 'incorrect' };
    }
    return { latitude: position[0][0], longitude: position[1][0] };
  }

  geoShowError(targetNode, message) {
    const error = document.createElement('div');
    error.classList.add('timeline_geo_error');
    error.innerText = message;
    targetNode.closest('div').append(error);
    error.style.left = `${targetNode.offsetLeft + targetNode.offsetWidth / 2 - error.offsetWidth / 2}px`;
    error.style.top = `${targetNode.offsetTop + targetNode.offsetHeight}px`;

    targetNode.addEventListener('focus', () => error.remove());
  }
}
