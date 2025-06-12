require('dotenv').config();

// Autenticação do token:
const auth = function(req, res, next){
    if(req.headers.token != process.env.TOKEN){
        res.status(401).send({auth: "Não autorizado!"});
        return
    }

    next()
}

// Servidor Express:
const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(express.json(), cors({origin: "*"}), auth);

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
    console.log("Sevidor Live!! Porta: ", process.env.PORT)
})

// Conexão com Banco de Dados
const mysql = require('mysql2');

const con = mysql.createConnection(process.env.DBURL);

con.connect(function(err){
    if(err) throw err;
    console.log("Conexão com Banco de Dados estabelecida!")
});

module.exports = {
    app: app,
    con: con
}