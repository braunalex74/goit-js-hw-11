import fetchImages from './api';

import Notiflix from 'notiflix';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let perPage = 40;

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

form.addEventListener('submit', event => {
  event.preventDefault();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  page = 1;
  searchImages();
  event.currentTarget.reset();
});

const loadMoreImages = async () => {
  try {
    Notiflix.Loading.dots('Loading more images...');
    const images = await fetchImages(searchQuery, page, perPage);
    if (images.length === 0) {
      loadMoreBtn.style.display = 'none';
      return;
    }
    Notiflix.Loading.remove();
    renderImageCards(images);
    page += 1;

    if (images.length < perPage) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops, something went wrong. Please try again later.'
    );
    console.error(error);
  }
};

loadMoreBtn.addEventListener('click', loadMoreImages);

const updateLoadMoreBtn = images => {
  if (images.length >= perPage) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
};

const searchImages = async () => {
  try {
    Notiflix.Loading.dots('Searching for images...');
    const images = await fetchImages(searchQuery, page, perPage);
    if (images.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
      return;
    }
    Notiflix.Loading.remove();
    renderImageCards(images);
    page += 1;
    updateLoadMoreBtn(images);
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops, something went wrong. Please try again later.'
    );
    console.error(error);
  }
};
