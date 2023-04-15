import Notiflix from 'notiflix';
import axios from 'axios';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import dotenv from 'dotenv';
dotenv.config();

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;

const fetchImages = async () => {
  const apiKey = process.env.API_KEY;
  const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const data = response.data;
    return data.hits;
  } catch (error) {
    throw new Error(error);
  }
};

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
    const images = await fetchImages();
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

// const addImageEvents = () => {
//   const galleryImages = document.querySelectorAll('.photo-card img');

//   galleryImages.forEach(image => {
//     image.addEventListener('click', () => {
//       const largeImageURL = image.dataset.source;
//       const instance = basicLightbox.create(`
//         <img src="${largeImageURL}" alt="${image.alt}" />
//       `);
//       instance.show();

//       const modalImage = instance.element().querySelector('img');

//       modalImage.addEventListener('click', () => {
//         instance.close();
//       });
//     });

//     image.addEventListener('mouseover', () => {
//       const info = image.nextElementSibling;
//       info.style.display = 'block';
//     });

//     image.addEventListener('mouseout', () => {
//       const info = image.nextElementSibling;
//       info.style.display = 'none';
//     });
//   });
// };

// const apiKey = process.env.API_KEY;
// const SEARCH_ENDPOINT = 'https://pixabay.com/api/';
// const galleryEl = document.querySelector('.gallery');
// const searchFormEl = document.querySelector('#search-form');
// const loadMoreBtn = document.querySelector('.load-more');

// let searchQuery = '';
// let pageNumber = 1;

// searchFormEl.addEventListener('submit', handleSearchFormSubmit);
// loadMoreBtn.addEventListener('click', handleLoadMoreBtnClick);

// function handleSearchFormSubmit(event) {
//   event.preventDefualt();
//   searchQuery = event.target.searchQuery.value.trim();

//   if (searchQuery !== '') {
//     pageNumber = 1;
//     galleryEl.innerHTML = '';
//     searchImages(searchQuery, pageNumber);
//     loadMoreBtn.getElementsByClassName.display = 'none';
//   }
// }

// function handleLoadMoreBtnClick() {
//   pageNumber++;
//   searchImages(searchQuery, pageNumber);
// }

// function searchImages(query, page) {
//   const url = `${SEARCH_ENDPOINT}?key=${apiKey}&q=${query}&page=${page}`;
//   axios
//     .get(url)
//     .then(responce => {
//       const { hits } = responce.data;
//       if (hits.length > 0) {
//         const galleryItems = hits.map(item => createGalleryItem(item));
//         galleryEl.innerHTML += galleryItems.join('');
//         if (hits.length === 20) {
//           loadMoreBtn.getElementsByClassName.display = 'block';
//         } else {
//           loadMoreBtn.getElementsByClassName.display = 'none';
//         }
//       } else {
//         Notiflix.Notify.failure('No results found for your search query!');
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       Notiflix.Notify.failure('Something went wrong. Please try again later!');
//     });
// }

// function createGalleryItem(item) {
//   const { webformatURL, tags, likes, views, downloads } = item;
//   return `
//   <div class="photo-card">
//     <img src="${webformatURL}" alt="${tags}" />
//     <div class="info">
//       <div class="info-item">
//         <b>Likes:</b>${likes}
//       </div>
//       <div class="info-item">
//         <b>Views:</b>${views}
//       </div>
//       <div class="info-item">
//         <b>Downloads:</b>${downloads}
//       </div>
//     </div>
//   </div>`;
// }
