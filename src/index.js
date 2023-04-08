import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '';
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
// let isLastPage = false;

// form.addEventListener('submit', handleSubmit);
// loadMoreBtn.addEventListener('click', handleMore);

// function handleSubmit(event) {
//   event.preventDefault();
//   searchQuery = event.target.elements.searchQuery.value.trim();
//   if (!searchQuery) {
//     return;
//   }
//   clearGallery();
//   page = 1;
//   isLastPage = false;
//   fetchImages();
// }

// function handleMore() {
//   page += 1;
//   fetchImages();
// }

// function fetchImages() {
//   const url = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&emage_type=photo&orientation=horizontal&safesearch=true&page=${page}`;
//   fetch(url)
//     .then(responce => responce.json())
//     .then(data => {
//       const images = data.hits;
//       const totalHits = data.totalHits;
//       const totalPages = Math.ceil(totalHits / 40);
//       if (images.length === 0) {
//         Notiflix.Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         );
//         return;
//       }

//       if (page === totalPages) {
//         isLastPage = true;
//         loadMoreBtn.classList.add('is-hidden');
//       } else {
//         isLastPage = false;
//         loadMoreBtn.classList.remove('is-hidden');
//       }
//       renderGallery(images);
//       if (page === 1) {
//         Notiflix.Notify.info(`We found ${totalHits} images. `);
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       Notiflix.Notify.failure(
//         'Oops! Something went wrong. Please try again later.'
//       );
//     });
// }

// function renderGallery(images) {
//   images.forEach(image => {
//     const photoCard = document.createElement('div');
//     photoCard.classList.add('photo-card');
//     photoCard.innerHTML = `
//         <img src='${image.webformatURL}' alt='${image.tags}' loading='lazy' /> <div class='info'><p class='info-item'><b>Likes:</b> ${image.likes}</p><p class='info-item'><b>Views:</b> ${image.views}</p></div>`;
//     gallery.appendChild(photoCard);
//   });
// }

// function clearGallery() {
//   gallery.innerHTML = '';
// }

const fetchImages = async () => {
  const API_KEY = '';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const responce = await axios.get(URL);
    const data = responce.data;
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
    <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}"/>
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
  } catch (error) {
    Notiflix.Notify.failure(
      'Oops, something went wrong. Please try again later.'
    );
    console.error(error);
  }
};
