import sqlProvider = require('../sql');

var sql = sqlProvider.users;

/*
 This repository mixes hard-coded and dynamic SQL,
 primarily to show a diverse example of using both.
 */

export class Repository {

    constructor(db) {
        this.db = db;
    }

    private db:any;

    // Creates the table;
    create = () =>this.db.none(sql.create);

    // Initializes the table with some user records, and return their id-s;
    init = () =>
        // When we execute more than one insert, we should use a transaction, although in this
        // particular example we use a single concatenated insert, so transaction isn't needed.
        // It is here just as an example.
        //
        // Also, giving your tasks and transactions names is a reliable way to track their errors.
        this.db.tx('Demo-Users', t =>
            t.any(sql.init)
                .then(data => data.map(m => m.id))
        );

    // Drops the table;
    drop = () => this.db.none(sql.drop);

    // Removes all records from the table;
    empty = () => this.db.none(sql.empty);

    // Adds a new user, and returns the new id;
    add = name => this.db.one(sql.add, name)
        .then(user => user.id);

    // Tries to delete a user by id, and returns the number of records deleted;
    remove = id => this.db.result('DELETE FROM Users WHERE id = $1', id)
        .then(result => result.rowCount);

    // Tries to find a user from id;
    find = id => this.db.oneOrNone('SELECT * FROM Users WHERE id = $1', id);

    // Returns all the records;
    all = () => this.db.any('SELECT * FROM Users');

    // Returns the total number of products;
    total = () => this.db.one('SELECT count(*) FROM Users')
        .then(data => parseInt(data.count));
}
