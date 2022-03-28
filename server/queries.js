const res = require('express/lib/response')

const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
})
function Substr(s2, s1) {

    var counter = 0; // pointing s2
    var i = 0;
    for (; i < s1.length; i++) {
        if (counter == s2.length) {
            break;
        }
        if (s2[counter] == s1[i]) {
            counter++;
        }
        else {
            // Special case where character preceding
            // the i'th character is duplicate
            if (counter > 0) {
                i -= counter;
            }
            counter = 0;
        }
    }
    return counter < s2.length ? -1 : i - counter;
}
const getUsers = (request, response) => {
    pool.query('SELECT * FROM movies ORDER BY id ASC', (error, results) => {
        if (error) {
            var found = Substr("exist", String(error)) + 1;
            console.log(String(error), "fff", found);
            if (found > 0) {
                pool.query('CREATE TABLE movies(id serial PRIMARY KEY, title VARCHAR ,description VARCHAR,year VARCHAR, metarating float8, rottenrating float8, internetrating float8)', (error2, results2) => {
                    if (error2) {
                        throw error2;
                    }
                    else {
                        response.status(200).json(results2.rows)
                    }
                })
            }
            else {
                response.send("1");
            }
        }
        else {
            response.status(200).json(results.rows)
        }
    })
}

const getUserById = (request, response) => {
    const id = String(parseInt(request.params.id));
    var s = String(request.params.s);
    console.log(s, " ssssssss");
    if (s == "m") {
        s = "metarating";
    }
    else if (s == "r") {
        s = "rottenrating";
    }
    else {
        s = "internetrating";
    }
    var y;
    console.log(" iii", id);
    if (id != '0') {
        y = ' year = ' + "'" + id + "'";
    }
    else {
        y = ' 1=1';
    }
    var url = 'SELECT * FROM movies WHERE' + y + ' ORDER BY ' + s + ' DESC';
    console.log("uuuuu", url)
    pool.query(url, (error, results) => {
        if (error) {
            var found = Substr("exist", String(error)) + 1;
            console.log(String(error));
            if (found > 0) {
                pool.query('CREATE TABLE movies(id serial PRIMARY KEY, title VARCHAR ,description VARCHAR,year VARCHAR, metarating float8, rottenrating float8, internetrating float8)', (error2, results2) => {
                    if (error2) {
                        throw error2;
                    }
                    else {

                        response.status(200).json(results2?.rows)
                    }
                })
            }
            else {
                response.send("1");
            }
        }
        console.log("rrrrrr", results)
        response.status(200).json(results.rows)
    })
}
const getplotbyid = (request, response) => {
    const id = String(parseInt(request.params.id));
    var url = 'SELECT * FROM movies WHERE id=' + id;
    pool.query(url, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows[0])
    })
}
const changeplotbyid = (request, response) => {
    const { editid, plot } = request.body
    pool.query('UPDATE movies SET description= $1 WHERE id= $2', [plot, editid], (error, results) => {
        if (error) {
            console.log(error, " error")
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const createUser = (request, response) => {
    console.log(request.body)
    const { title, description, year, metarating, rottenrating, internetrating, image } = request.body
    console.log("iii", image, typeof (image))
    // console.log("tt", title, description, year, metarating, rottenrating, internetrating)
    pool.query('INSERT INTO movies (title, description,year,metarating,rottenrating,internetrating,image) VALUES ($1,$2,$3,$4,$5,$6,$7)', [title, description, year, metarating, rottenrating, internetrating, image], (error, results) => {
        if (error) {
            var found = Substr("exist", String(error)) + 1;
            console.log(String(error), "fff", found);
            if (found > 0) {
                pool.query('CREATE TABLE movies(id serial PRIMARY KEY, title VARCHAR ,description VARCHAR,year VARCHAR, metarating float8, rottenrating float8, internetrating float8)', (error2, results2) => {
                    if (error2) {
                        throw error2;
                    }
                    else {
                        response.status(200).json(results2.rows)
                    }
                })
            }
            else {
                response.send("1");
            }
        }
        response.status(201).send(`movie added with ID: ${results?.insertId}`)
    })
}


const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM movies WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        else {
            response.status(200).send(`User deleted with ID: ${id}`)
        }
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    getplotbyid,
    changeplotbyid
}