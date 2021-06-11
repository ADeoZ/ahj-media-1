import GEO from './Geo';

export default class Timeline {
  constructor(element) {
    this.parentElement = element;
    this.formElement = this.parentElement.querySelector('.timeline_form_textarea');
    this.timelineElement = this.parentElement.querySelector('.timeline_container');

    this.addPost = this.addPost.bind(this);
  }

  init() {
    this.formElement.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.onKeyUp();
      }
    });
  }

  onKeyUp() {
    if (this.formElement.value.trim() === '') {
      const error = document.createElement('div');
      error.classList.add('timeline_form_error');
      error.innerText = 'Введите текст в поле';
      this.formElement.after(error);
      this.formElement.value = '';
      this.formElement.addEventListener('keyup', () => error.remove());
      return;
    }

    this.geoAPI = new GEO(this.addPost);
    this.geoAPI.geo();
  }

  addPost(coords) {
    const postElement = document.createElement('li');
    postElement.classList.add('timeline_post');
    const postContainerElement = document.createElement('div');
    postContainerElement.classList.add('timeline_post_container');
    const postMessageElement = document.createElement('div');
    postMessageElement.classList.add('timeline_post_message');
    postMessageElement.innerText = this.formElement.value.trim();
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
    this.formElement.value = '';
  }
}
