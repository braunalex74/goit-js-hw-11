import axios from 'axios';

const fetchImages = async (searchQuery, page) => {
  const apiKey = '35196803-673541e2c14d14661bda49ca7';
  const URL = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(URL);
    const data = response.data;
    return data.hits;
  } catch (error) {
    throw new Error(error);
  }
};

export default fetchImages;
