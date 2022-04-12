import React from 'react';
import './App.css';
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [],
      playlistName: '',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.ID === track.ID)) {
      return;
    } else {
      let newPlaylist = this.state.playlistTracks;
      newPlaylist.push(track);
      this.setState({
        playlistTracks: newPlaylist
      })
    }
  }

  removeTrack(track) {
    let oldPlaylist = this.state.playlistTracks;
    let newPlaylist = oldPlaylist.filter(savedTrack => savedTrack.ID !== track.ID)
    this.setState({
      playlistTracks: newPlaylist
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    let trackURIs = [];
    this.state.playlistTracks.map(track => {
      trackURIs.push(track.URI);
      return trackURIs;
    })
    Spotify.isPlaylist(this.state.playlistName, trackURIs)
      .then(() => {
        this.setState({
          playlistName: '',
          playlistTracks: []
        })
      })
  }

  search(term) {
    Spotify.search(term)
    .then(tracks =>
      this.setState(
        {searchResults: tracks}
      )
    );
  }

  render() {
    Spotify.getAccessToken();
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} 
            onRemove={this.removeTrack} isRemoval={true} onNameChange={this.updatePlaylistName}
            onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;