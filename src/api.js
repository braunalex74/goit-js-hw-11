// import axios from 'axios';

const fetchImages = async (searchQuery, page, perPage) => {
  const apiKey = '35196803-673541e2c14d14661bda49ca7';
  const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    throw new Error(error);
  }
};

export default fetchImages;
