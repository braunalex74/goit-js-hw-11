import fetchImages from './api';

import Notiflix from 'notiflix';
// import axios from 'axios';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;

// const fetchImages = async () => {
//   const apiKey = process.env.API_KEY;
//   const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

//   try {
//     const response = await axios.get(URL);
//     const data = response.data;
//     return data.hits;
//   } catch (error) {
//     throw new Error(error);
//   }
// };

const createImageCard = ({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) => {
  return `
  <div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}" />
    <div class="info">
      <p class="info-item">
        <b>Likes:</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views:</b> ${views}
      </p>
      <p class="info-item">
        <b>Comments:</b> ${comments}
      </p>
      <p class="info-item">
        <b>Downloads:</b> ${downloads}
      </p>
    </div>
  </div>`;
};
const renderImageCards = images => {
  const cards = images.map(image => createImageCard(image)).join('');
  gallery.insertAdjacentHTML('beforeend', cards);

  const galleryImages = document.querySelectorAll('.photo-card img');

  galleryImages.forEach(image => {
    image.addEventListener('click', () => {
      const largeImageURL = image.dataset.source;
      const instance = basicLightbox.create(`
        <img src="${largeImageURL}" alt="${image.alt}" />
      `);
      instance.show();

      const modalImage = instance.element().querySelector('img');

      modalImage.addEventListener('click', () => {
        instance.close();
      });
    });

    image.addEventListener('mouseover', () => {
      const info = image.nextElementSibling;
      info.style.display = 'block';
    });

    image.addEventListener('mouseout', () => {
      const info = image.nextElementSibling;
      info.style.display = 'none';
    });
  });
};
const searchImages = async () => {
  try {
    Notiflix.Loading.dots('Searching for images...');
    const images = await fetchImages(searchQuery, page);
    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.getElementsByClassName.display = 'none';
      return;
    }
    Notiflix.Loading.remove();
    renderImageCards(images);
    page += 1;
    loadMoreBtn.getElementsByClassName.display = 'block';

    const galleryImages = document.querySelectorAll('.photo-card img');

    galleryImages.forEach(image => {
      // image.addEventListener('click', () => {
      //   const largeImageURL = image.dataset.source;
      //   window.open(largeImageURL);
      // });

      image.addEventListener('mouseover', () => {
        const info = image.nextElementSibling;
        info.style.display = 'block';
      });

      image.addEventListener('mouseout', () => {
        const info = image.nextElementSibling;
        info.style.display = 'block';
      });
    });
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops, something went wrong. Please try again later.'
    );
    console.error(error);
  }
};
form.addEventListener('submit', event => {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  page = 1;
  searchImages();
  event.currentTarget.reset();
});
