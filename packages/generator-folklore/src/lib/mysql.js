module.exports = (connection) => {
    const Mysql = {
        createDatabase(name) {
            return new Promise((resolve, reject) => {
                connection.query(`CREATE DATABASE IF NOT EXISTS ${name};`, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },

        createUser(user, password) {
            return new Promise((resolve, reject) => {
                connection.query(`CREATE USER "${user}"@"localhost" IDENTIFIED BY "${password}"`, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },

        createDatabaseUser(database, user, password) {
            return new Promise((resolve, reject) => {
                connection.query(`GRANT ALL ON \`${database}\`.* TO "${user}"@"localhost" IDENTIFIED BY "${password}"`, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },

        grantPrivileges(user, database) {
            return new Promise((resolve, reject) => {
                let newDatabase = database;
                if (typeof database !== 'undefined' && database && database.length) {
                    newDatabase += '.*';
                } else {
                    newDatabase = '*.*';
                }
                connection.query(`GRANT ALL PRIVILEGES ON ${newDatabase} TO "${user}"@"localhost" WITH GRANT OPTION`, (err, rows) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(rows);
                });
            });
        },
    };

    return Mysql;
};
