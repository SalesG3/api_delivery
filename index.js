// Testando Servidor e conexão com banco
const { app, con }= require('./server')

app.get('/index', async(req, res) => {

    res.status(200).send({
        teste: "Concluído!"
    })
})

app.post('/index', async(req, res) => {

    res.status(200).send({
        teste: "Concluído! Post"
    })
})