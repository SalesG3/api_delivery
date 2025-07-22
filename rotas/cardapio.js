const { app, con } = require('../server')

// Consultar Entidade:
app.get('/data/entidade', async(req, res) => {

    let [data] = await con.promise().query(`SELECT * FROM ENTIDADE`)

    res.status(200).send(
        data[0]
    )

    return
})

// Consultar Categorias:
app.get('/data/categorias', async(req, res) => {
    
    let [data] = await con.promise().query(`SELECT * FROM CATEGORIAS`)

    res.status(200).send(
        data[0]
    )

    return
})

// Consultar Produtos:
app.get('/data/produtos', async(req, res) => {
    
    let [data] = await con.promise().query(`SELECT * FROM PRODUTOS`)

    res.status(200).send(
        data[0]
    )

    return
})