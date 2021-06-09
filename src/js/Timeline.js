export default class Timeline {
  constructor(element) {
    this.parentElement = element;
    this.formElement = this.parentElement.querySelector('.timeline_form_textarea');
    this.timelineElement = this.parentElement.querySelector('.timeline_container');
  }

  init() {
    this.formElement.addEventListener('keyup', (event) => {
      if (event.keyCode === 13) {
        this.addPost();
      }
    });
  }

  addPost() {
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
      postGeoElement.innerText = `[${coords.latidude}, ${coords.longitude}]`;
      postContainerElement.append(postMessageElement, postTimeElement);
      postElement.append(postContainerElement, postGeoElement);
      this.timelineElement.prepend(postElement);

      this.formElement.value = '';
    }).catch((error) => console.log(error));
  }

  // eslint-disable-next-line class-methods-use-this
  async geo() {
    if (navigator.geolocation) {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve({ latidude: position.coords.latitude, longitude: position.coords.longitude });
        }, (error) => {
          reject(error);
        });
      });
    }
    return new Promise((resolve, reject) => reject(new Error('No Geolocation API')));
  }
}
