import { query,param, body, validationResult } from 'express-validator';
import db from "./Db.js";

export default class Router {
    constructor(app) {
        this.app = app;
        this.setRoutes();
        this.db = db;
    }

    setRoutes() {

        this.app.post("/client",
            body('name').exists()
                .isString().isAlpha(),
            body('email').isEmail().exists(),
            body('phone').exists().isNumeric()
                .isLength({ min: 5, max: 15 }),
            body('clientId').exists()
                .isNumeric().isLength({ min: 5, max: 11 }),

            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                let { name, email, phone, clientId } = req.body;
                try {
                    await this.db.Query(
                        `INSERT INTO clients(name ,email,phone,client_id)
                        VALUES(?,?,?,?)`,
                        [name, email, phone, clientId]);
                    res.send("client created");
                } catch (err) {
                    console.log("error");
                    res.status(400);
                    res.send(err.message);
                }
            })

        this.app.patch("/client/:id",
            body('name').exists()
                .isString(),
            body('email').isEmail().exists(),
            body('phone').exists().isNumeric()
                .isLength({ min: 5, max: 15 }),
            body('id').exists()
                .isNumeric(),
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                let { name, email, phone, id } = req.body;
                try {
                    await this.db.Query(
                        "UPDATE clients set name =? , email =?, phone = ?   WHERE id = ?",
                        [name, email, phone, id]);
                    res.send("client deleted");
                } catch (err) {
                    console.log("error");
                    res.status(400);
                    res.send(err.message);
                }
            })

        this.app.delete("/clients/:id",
            param('id').exists().isNumeric().isLength({ min: 5, max: 15 }),
            async (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                let id = req.params.id;
                try {
                    await this.db.Query(
                        `DELETE FROM clients WHERE id = ?`,
                        [id]);
                    res.send("client deleted");
                } catch (err) {
                    res.status(400);
                    res.send(err.message);
                }
            })

        this.app.get("/clients",
            query('page').exists().isNumeric(),
            query('npp').exists().isNumeric(),
            
            (req, res) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                let numRows;
                let filter = req.query.filter
                filter = `${filter}%`;
                let numPerPage = parseInt(req.query.npp, 10) || 1;
                let page = parseInt(req.query.page, 10) || 0;
                let numPages;
                let skip = page * numPerPage;
                let limit = skip + ',' + numPerPage;
                this.db.Query("SELECT count(*) as numRows FROM clients WHERE name LIKE ?", [filter])
                    .then(function (results) {
                        numRows = results[0].numRows;
                        numPages = Math.ceil(numRows / numPerPage);
                        console.log('number of pages:', numPages);
                    })
                    .then(() => this.db.Query('SELECT * FROM clients WHERE name LIKE ? ORDER BY ID DESC LIMIT ' + limit, [filter]))
                    .then(function (results) {
                        var responsePayload = {
                            results: results
                        };
                        if (page < numPages) {
                            responsePayload.pagination = {
                                current: page,
                                perPage: numPerPage,
                                previous: page > 0 ? page - 1 : undefined,
                                next: page < numPages - 1 ? page + 1 : undefined
                            }
                        }
                        else responsePayload.pagination = {
                            err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
                        }
                        res.json(responsePayload);
                    })
                    .catch(function (err) {
                        console.error(err);
                        res.json({ err: err });
                    });
            })

        this.app.post("/initCsv", async (req, res) => {
            try {
                await this.db.Query(
                    `LOAD DATA INFILE '/Users/yochay.p/humanz/assets/csvFiles/humanz-ex-users.csv'
                    INTO TABLE clients 
                    FIELDS TERMINATED BY ','
                    ENCLOSED BY '"'
                    LINES TERMINATED BY '\n'
                    IGNORE 1 ROWS
                    (name,email,client_id,phone,ip)
                    SET ID = NULL;
                     `);
                res.send("table created");
            } catch (err) {
                res.status(400);
                res.send(err.message);
            }
        })

    }

}