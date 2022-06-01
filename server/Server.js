import express from "express";
import bodyParser from "body-parser";
import { config } from './constants.js';
import Router from "./Router.js";
import cors from 'cors';

export default class Server{
    constructor(){

        this.port = config.NODE_ENVIRONMENT.port;
        this.app = new express();

        this.app.use(cors());

        this.app.use(express.json());
        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.listen(this.port, ()=>{
            console.log('sevrer is running on port '+this.port);
        })
        this.router = new Router(this.app); 
        
    }
}


