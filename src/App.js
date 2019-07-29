import React, { Component } from 'react';
import icons from 'glyphicons'
import Spotify from './lib/Spotify'
import Player from './components/Player/Player'
import Gallery from './components/Gallery/Gallery'
import axios from 'axios'
import logo from './assets/logo.png';
import './App.css';

export const authUri = 'https://accounts.spotify.com/authorize';

const clientId = '48918592cdc744e9a5dadec59fe1e2cb';
const clientSecret = '7a64ca84bf464f00811b6aec995763e6'
const redirectUri = 'http://localhost:3000';
const scopes = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-private',
  'user-read-email'
];

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce((initial, item) => {
    if (item) {
      var steps = item.split('=');
      initial[steps[0]] = decodeURIComponent(steps[1]);
    }
    return initial;
  }, {});

window.location.hash = '';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: null,
      query: '',
      item: {
        album: {
          images: [{ url: '' }],
        },
        name: '',
        artists: [{ name: '' }],
        duration_ms: 0,
        tracks: undefined,
      },
      is_playing: false,
      progress_ms: 0
    };

    this.getPlayingNow = this.getPlayingNow.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.search = this.search.bind(this);
  }

  search() {
    const result = Spotify.search(this.state.query, this.state.token)
      .then(search => {
        this.handleSearch(search.data, this.state.token)})
      .catch(e => {
        this.displayError('Input a valid query')
      })
  }

  handleSearch(artistData, token) {
    const artist = artistData.artists.items[0];
    if(artist) {
      this.loadTracks(artist.id, token);
      return this.updateProfile(artist);
    } else {
      this.displayError('Artist not found');
      return false;
    }
  }

  loadTracks(artistId, token) {
    Spotify.getTracks(artistId, token)
      .then(spotify => {
        this.setState({
          tracks: spotify.data.tracks
        })
      })
  }

  updateProfile(artistData) {
    const artist = artistData.artists.items[0];
    this.setState({
      artist: artist,
      errorMessage: ''
    })
    return artistData;
  }

  displayError(message) {
    this.setState({
      errorMessage: message
    })
  }

  poolingPlayingNow(time) {
      setInterval(function () {
        this.getPlayingNow(this.state.token)
      }.bind(this), time)
  }

  getPlayingNow(token) {
    axios.interceptors.request.use((config) => {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/player',
    })
      .then(function (response) {
        this.setState({
          item: response.data.item,
          is_playing: response.data.is_playing,
          progress_ms: response.data.progress_ms,
        });
      }.bind(this))
  }

  componentDidMount() {
    let _token = hash.access_token;
    return _token ? this.setState({token: _token}) : ''
  }

  render() {
    return (
      <div className="App">
        <script src="https://sdk.scdn.co/spotify-player.js"></script>
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>GlassPlayer</h2>
        </div>
        {!this.state.token && (
          <a className='btn btn--login'
            href=
            {`${authUri}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`}
          >
            Login
          </a>
        )}
        {this.state.token && (
          <div>
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />
            <button 
              className="btn playingNow--input"
              onClick={() => this.getPlayingNow(this.state.token)}>
              Check what is playing
            </button>

          <form onSubmit={ (e) => { e.preventDefault(); this.search(); } }>
            <div>
              <input 
                className="search--input" 
                type="text" 
                placeholder="Search for an artist"
                value={this.state.query}
                onChange={event => {this.setState({query: event.target.value }) }} />
              <button 
                className="btn search--submit"
                type="submit"
              >
                {icons.magnifyingGlass}
              </button>
            </div>
          </form>
          <Gallery tracks={this.state.tracks}/>
          </div>
        )}
      </div>
    );
  }
}

export default App;
