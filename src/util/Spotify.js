let access_token;
let expires_in;
const endpoint = 'https://accounts.spotify.com/authorize';
const client_id = ''; //Enter your client id here
const redirect_uri = 'http://localhost:3000';

const Spotify = {
    async getAccessToken() {
        let url = window.location.href;
        if(access_token){
            return access_token;
        } else if(this.isTokenInUrl(url)){
            this.clearUrl(access_token, expires_in);
            return access_token;
        } else {
            window.location = `${endpoint}?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`
            url = window.location.href;
            if(this.isTokenInUrl(url)){
                this.clearUrl(access_token, expires_in);
                return access_token;
            }
        }
    },
        

    isTokenInUrl(url) {
        access_token = url.match(/access_token=([^&]*)/);
        expires_in = url.match(/expires_in=([^&]*)/);
        if(access_token && expires_in){
            access_token = access_token[1];
            expires_in = expires_in[1];
            return true;
        } else {
            return false;
        }
    },

    clearUrl(token, time) {
        window.setTimeout(() => token = '', time * 1000);
        window.history.pushState('Access Token', null, '/');
    },

    async search(term) {
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        .then(response => {
            return response.json();
        })
        .then(jsonResponse => {
            if(jsonResponse.tracks.items){
                return jsonResponse.tracks.items.map(track => {
                    return {
                        ID: track.id,
                        Name: track.name,
                        Artist: track.artists[0].name,
                        Album: track.album.name,
                        URI: track.uri
                    };
                })
            }
        })
    },

    async isPlaylist(playlistName, TracksUri) {
        if(playlistName && TracksUri){
            let accessToken = access_token;
            let headers = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
            let userID;
            let playlistID;
            let playlistNameData = {
                name: playlistName
            }
            let playlistTrackData = {
                uris: TracksUri
            }
            await fetch('https://api.spotify.com/v1/me', headers)
                .then(response => {
                    return response.json();
                })
                .then(jsonResponse => {
                    if(jsonResponse.id){
                        return userID = jsonResponse.id;
                    }
                })
            await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playlistNameData)
            })
                .then(response => {
                    return response.json();
                })
                .then(jsonResponse => {
                    if(jsonResponse.id){
                        return playlistID = jsonResponse.id;
                    }
                })
            await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(playlistTrackData)
            })
                .then(response => {
                    return response.json();
                })
                .then(jsonResponse => {
                    return playlistID = jsonResponse.snapshot_id;
                })
        } else {
            return;
        }
    }
}

export default Spotify;