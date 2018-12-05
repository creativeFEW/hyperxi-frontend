import axios from 'axios';

class Api {
    static instance = null;
    static createInstance() {
        return new Api();
    }
    static getInstance () {
        if (!Api.instance) {
            Api.instance = Api.createInstance();
        }
        return Api.instance;
    }
    constructor() {
        this.axios = axios.create({
            baseURL: `https://api.hyperxi.com`,
            headers: {
              'auth': localStorage.getItem('token')
            }
        });
    }
}

const a = Api.getInstance(); export default a