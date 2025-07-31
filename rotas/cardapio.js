const { app, con } = require('../server')

// Consultar Entidade:
app.get('/exportData/entidade', async(req, res) => {

    let [data] = await con.promise().query(`SELECT * FROM ENTIDADE`)

    res.status(200).send(
        data[0]
    )

    return
})

// Consultar Categorias:
app.get('/exportData/categoria', async(req, res) => {
    
    let [data] = await con.promise().query(`SELECT * FROM CATEGORIAS`)

    res.status(200).send(
        data
    )

    return
})

// Consultar Produtos:
app.get('/exportData/produto', async(req, res) => {
    
    let [data] = await con.promise().query(`SELECT * FROM PRODUTOS`)

    res.status(200).send(
        data
    )

    return
})