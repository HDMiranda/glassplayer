import axios from 'axios'

const BASE_URL = 'https://api.spotify.com/v1';

const apiUtils = {
  checkStatus: (response) => {
    if(response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}

const Spotify = {
  getSearchUrl: (query) => {
    return `${BASE_URL}/search?q=${encodeURI(query)}&type=artist&limit=1`;
  },

  getTracksUrl: (artistId) => {
    return `${BASE_URL}/artists/${artistId}/top-tracks?country=US&`;
  },

  search: (query, token) => {
    let searchUrl = Spotify.getSearchUrl(query);

    axios.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    return axios({
      method: 'get',
      url: searchUrl,
    })
      .then(apiUtils.checkStatus)
      .then(response => response)
  },

  getTracks: (artistId, token) => {
    let searchUrl = Spotify.getTracksUrl(artistId);
    return axios({
      method: 'get',
      url: searchUrl,
    })
      .then(apiUtils.checkStatus)
      .then(response => response)
  }
}

export default Spotify;
