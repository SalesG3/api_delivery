require('dotenv').config()

// Autenticação do Token:
const auth = function(req, res, next){

    if(req.headers.token == process.env.TOKEN && req.method == "GET"){
        console.log("Consulta realizada! Rota: " + req.url)
        next()
        return
    }

    else if(req.headers.token == process.env.TOKEN && req.method != "GET"){
        console.log("Faltando configurar Log para outros metodos")
        next()
        return
    }

    else{
        res.status(401).send({auth: "Não autorizado!"})
        return
    }
}

// Criação de Servidor Express:
const express = require('express')
const cors = require('cors')
const http = require('http')

const app = express()

app.use(cors({origin: "*"}), express.json(), auth)

const server = http.createServer(app)
server.listen(process.env.PORT,(err) => {
    if(err) throw err
    console.log("Servidor Express Live!! Porta: ", process.env.PORT)
})

// Conexão com Banco de Dados:
const mysql = require('mysql2')

const con = mysql.createConnection(process.env.DBURL)

con.connect((err) =>{
    if(err) throw err
    console.log("Banco de Dados Conectado com sucesso!!")
})

// Exportação dos Módulos:

module.exports = {
    app: app,
    con: con
}