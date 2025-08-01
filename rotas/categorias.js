const { app, con } = require('../server')

// Criação de nova categoria
app.post('/importData/categoria', async(req, res) => {

    // Validações Iniciais
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let { CD_CATEGORIA, NM_CATEGORIA } = req.body.dataRows

    if(!CD_CATEGORIA || !NM_CATEGORIA){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
    }

    try{
        
        // Executa a procedure de inserção
        await con.promise().beginTransaction()

        let [data] = await con.promise().execute(`CALL NOVO_CATEGORIA ( ?, ?)`,
            [CD_CATEGORIA, NM_CATEGORIA]
        )

        await con.promise().commit()

        
        res.status(200).send({
            sucesso: "Registro salvo com sucesso!"
        })

        
    }
    catch(err){

        // Tratamento de Erros
        await con.promise().rollback()
        
        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)
            
            res.status(400).send({
                unique: `Chave Duplicada! (${match[1].split('.')})`
            })
        }
        else{
            res.status(500).send(
                err
            )
        }
    }
})


// Altera categorias
app.put('/importData/categoria/:id', async(req, res) => {

    // Validações iniciais
    if(!req.body || !req.body.dataRows || !req.params || !req.params.id){
        res.status(400).send({
            error: "Parâmetros esperados não encontrados!"
        })
        return
    }

    let ID_CATEGORIA = req.params.id
    let { CD_CATEGORIA, NM_CATEGORIA } = req.body.dataRows

    if(!CD_CATEGORIA || !NM_CATEGORIA){
        res.status(400).send({
            error: "Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução da procedure no banco de dados
    try{
        await con.promise().beginTransaction()

        let [data] = await con.promise().execute(`CALL UPDATE_CATEGORIA( ?, ?, ?)`,
            [ID_CATEGORIA, CD_CATEGORIA, NM_CATEGORIA]
        )

        if(data.affectedRows < 1){
            res.status(400).send({
                error: `Chave Inexistente! CATEGORIA.ID_CATEGORIA(${ID_CATEGORIA})`
            })
            return
        }

        await con.promise().commit()
        res.status(200).send({
            sucesso: "Atualização realizada com sucesso!"
        })
    }

    // Tratamento de erros
    catch(err){
        await con.promise().rollback()

        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)

            res.status(400).send({
                unique: `Chave Duplicada! (${match[1].split('.')})`
            })
        }
        else{
            res.send({
                error: err
            })
        }
    }
})