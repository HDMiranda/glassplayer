import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Gallery.css';

const PauseButton = () => {
  return <svg className="Icon PauseIcon " viewBox="0 0 100 100">
    <g className="Icon-group">
      <rect className="Icon-shape" x="53" y="0" width="16" height="58" fill="white"></rect>
      <rect className="Icon-shape" x="17" y="0" width="16" height="58" fill="white"></rect>
    </g>
  </svg>
}

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: false,
      playingUrl: null, 
      audio: null, 
      currentTime: 0
    }
  }
  static propTypes = {
    tracks: PropTypes.array,
  };  

  componentDidMount() {
    this.interval = setInterval(this.isPlaying.bind(this), 8000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  isPlaying() {
    if(!this.state.is_playing) {
      return false;
    } else if(this.state.audio && this.state.audio.currentTime >= 30) {
      this.resetPlayer();
      return false;
    } else {
      return true;
    }
  }

  handlePlayClick(previewUrl) {
    if(this.isPlaying()) {
      if(this.state.playingUrl === previewUrl) {
        this.pausePlayback();
      } else {
        this.resetPlayer();
        this.startPlaying(previewUrl);
      }
    } else {
      this.startPlaying(previewUrl);
    }
  }

  pausePlayback() {
    this.state.audio.pause();
    this.setState({
      playing: false
    });
  }

  resetPlayer() {
    let audio = this.state.audio;
    audio.pause();
    audio.currentTime = 0;
    audio.src = null;
    this.setState({
      playing: false,
      playingUrl: null, 
      audio
    });
  }

  startPlaying(url) {
    if(this.state.playingUrl === url) {
      this.restartPlayback();
    } else {
      let audio = this.state.audio ? this.state.audio : new Audio(url);
      audio.src = url;
      audio.currentTime = 0;
      this.setState({
        playing: true, 
        playingUrl: url, 
        audio
      });
      audio.play();
    }
  }

  restartPlayback() {
    this.state.audio.play();
    this.setState({
      playing: true
    });
  }

  displayIcon(url) {
    if(this.state.playing && this.state.playingUrl === url) {
      return <PauseButton/>;
    } else {
      return "\u25B6";
    }
  }
  
  render() {
    return (
      <div className="gallery--wrapper">
        <ul className="gallery--list">
          {this.props.tracks && this.props.tracks.map((track) => {
            return <li 
                    key={track.id} 
                    className="gallery--track">
                    <div className="gallery--track-wrapper">
                      <img
                        className="track--album-art"
                        alt={`${track.name} album art`}
                        src={track.album.images[1].url} 
                        onClick={() => this.handlePlayClick(track.preview_url)}/>
                      <div className="track--playButton"
                           style={{ top: '50%', left: '50%' }}
                           onClick={() => this.handlePlayClick(track.preview_url)}>
                           {this.displayIcon(track.preview_url)}
                      </div>
                      <span 
                        className="track--name">
                        {track.name}
                      </span>
                    </div>
                    
                  </li>
          })}
        </ul>
    </div>
    );
  }
}

Gallery.defaultProps = {
  tracks: []  
};

export default Gallery
