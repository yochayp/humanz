import mysql  from 'mysql';
import { config } from './constants.js';

export default class Db{
    constructor(){
        this.con = mysql.createConnection({
            host: config.DB.host,
            user:  config.DB.user,
            password:  config.DB.password,
            database:  config.DB.database
          });
    }

    static  Query(qry, params = []) {
        const db = new Db();

        return new Promise((resolve, reject) => {
           db.con.query(qry, params, (err, result, fields) => {
            if(err){
                reject(err);
            }
            resolve(result);
           });
       });
    }
}