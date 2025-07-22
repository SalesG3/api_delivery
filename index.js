const { app, con } = require('./server')

// Rota de Login:
app.post('/login', async(req, res) => {
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let {numero, senha } = req.body.dataRows
    
    if(!numero || !senha){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let [data] = await con.promise().query(`CALL LOGIN_CLIENTE('${numero}','${senha}')`)

    if(!data[0].length){
        res.status(200).send({
            error: "Login e Senha incorretos!"
        })
        return
    }
    else{
        res.status(200).send(
            data[0]
        )
        return
    }
})

require('./rotas/cardapio')