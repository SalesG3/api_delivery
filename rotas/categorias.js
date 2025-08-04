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
        return
    }

    try{
        
        // Executa a procedure de inserção
        let [data] = await con.promise().execute(`CALL NOVO_CATEGORIA ( ?, ?)`,
            [CD_CATEGORIA, NM_CATEGORIA]
        )
        
        res.status(200).send({
            sucesso: "Registro salvo com sucesso!"
        })

    }
    catch(err){

        // Tratamento de Erros        
        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)
            
            res.status(400).send({
                unique: `Chave Duplicada! (${match[1]})`
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

    if(!CD_CATEGORIA || !NM_CATEGORIA || !ID_CATEGORIA){
        res.status(400).send({
            error: "Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução da procedure no banco de dados
    try{
        let [data] = await con.promise().execute(`CALL UPDATE_CATEGORIA( ?, ?, ?)`,
            [ID_CATEGORIA, CD_CATEGORIA, NM_CATEGORIA]
        )

        if(data.affectedRows < 1){
            res.status(400).send({
                error: `Chave Inexistente! CATEGORIA.ID_CATEGORIA(${ID_CATEGORIA})`
            })
            return
        }

        res.status(200).send({
            sucesso: "Atualização realizada com sucesso!"
        })
        return
    }

    // Tratamento de erros
    catch(err){
        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)

            res.status(400).send({
                unique: `Chave Duplicada! (${match[1]})`
            })
            return
        }
        else{
            res.send({
                error: err
            })
        }
    }
})

app.delete('/deleteData/categoria/:id', async(req, res) => {

    // Validações Iniciais
    if(!req.params.id){
        res.status(400).send({
            error: "Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução no banco
    try{
        let [data] = await con.promise().execute(`DELETE FROM CATEGORIAS WHERE ID_CATEGORIA = ?`,
            [req.params.id]
        )

        if(data.affectedRows < 1){
            res.status(400).send({
                error: `Chave Inexistente! CATEGORIA.ID_CATEGORIA(${req.params.id})`
            })
            return
        }
        else{
            res.status(200).send({
                sucesso: "Registro deletado do banco de dados!"
            })
        }
    }

    // Tratamento de erros
    catch(err){
        if(err.code == "ER_ROW_IS_REFERENCED_2"){
            res.status(400).send({
                erro: "Não foi possível excluir pois o registro possui dependências!"
            })
            return
        }
        res.status(500).send({
            error: err
        })
    }
})