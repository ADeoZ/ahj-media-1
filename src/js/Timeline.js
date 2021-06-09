/* eslint-disable class-methods-use-this */
export default class Timeline {
  constructor(element) {
    this.parentElement = element;
    this.formElement = this.parentElement.querySelector('.timeline_form_textarea');
    this.timelineElement = this.parentElement.querySelector('.timeline_container');

    this.checkValidity = this.checkValidity.bind(this);
  }

  init() {
    this.formElement.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.onKeyUp();
      }
    });
  }

  onKeyUp() {
    if (this.formElement.value.trim() === '' && !this.formElement.closest('form').querySelector('.timeline_form_error')) {
      const error = document.createElement('div');
      error.classList.add('timeline_form_error');
      error.innerText = 'Введите текст в поле';
      this.formElement.after(error);
      setTimeout(() => error.remove(), 3000);
      this.formElement.value = '';
      return;
    }

    this.geo().then((coords) => {
      this.addPost(this.formElement.value.trim(), coords);
      this.formElement.value = '';
    }).catch(() => this.askCoords());
  }

  addPost(message, coords) {
    const postElement = document.createElement('li');
    postElement.classList.add('timeline_post');
    const postContainerElement = document.createElement('div');
    postContainerElement.classList.add('timeline_post_container');
    const postMessageElement = document.createElement('div');
    postMessageElement.classList.add('timeline_post_message');
    postMessageElement.innerText = message;
    const postTimeElement = document.createElement('div');
    postTimeElement.classList.add('timeline_post_time');
    const timeNow = new Date();
    const dateOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    const timeOptions = { minute: '2-digit', hour: '2-digit' };
    postTimeElement.innerText = `${timeNow.toLocaleString('ru-RU', dateOptions)} ${timeNow.toLocaleString('ru-RU', timeOptions)} `;
    const postGeoElement = document.createElement('div');
    postGeoElement.classList.add('timeline_post_geo');
    postGeoElement.innerText = `[${coords.latitude}, ${coords.longitude}]`;
    postContainerElement.append(postMessageElement, postTimeElement);
    postElement.append(postContainerElement, postGeoElement);
    this.timelineElement.prepend(postElement);
  }

  geo() {
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
    this.parentElement.append(this.modal);
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
    this.addPost(this.formElement.value.trim(), geoInput);
    this.modal.remove();
    this.formElement.value = '';
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
