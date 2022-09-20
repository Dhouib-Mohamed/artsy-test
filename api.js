import getAppToken from "./getAppToken";

async function fetchArtists(critera, searching) {
    let artists = [];
            const apiUrl = 'https://api.artsy.net/api/tokens/xapp_token';
            let xappToken;
            try {
                xappToken = await getAppToken(apiUrl);
            } catch (e) {
                console.error(e)
            }
            const traverson = require('traverson'),
                JsonHalAdapter = require('traverson-hal');

            traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
            const api = traverson.from(`https://api.artsy.net/api/artists${critera}`).jsonHal();

            await api.newRequest()
                .withRequestOptions({
                    headers: {
                        'X-Xapp-Token': xappToken,
                        'Accept': 'application/vnd.artsy-v2+json'
                    }
                })
                .getResource(function (error, data) {
                    artists = data['_embedded']['artists'] ?? [data];
                });
            console.log(artists)
    return artists;



}
export default fetchArtists
