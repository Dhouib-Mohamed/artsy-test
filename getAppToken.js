import {client} from "./clientCredentials";
import request from "superagent";

export default async function getAppToken(apiUrl) {
        const request = require('superagent');
        let res ;

    try {
        res = await request
            .post(apiUrl)
            .send({client_id: client.clientID, client_secret: client.clientSecret})
            .then(res =>{
                return res.body.token;
            })
            .catch(console.error)
    }
    catch (e) {
        console.error(e)
    }
    return res;
}
