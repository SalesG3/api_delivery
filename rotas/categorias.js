const { app, con } = require('../server')

app.post('/importData/categoria', async(req, res) => {
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let { cd_categoria, nm_categoria, ds_categoria } = req.body.dataRows

    if(!cd_categoria || !nm_categoria){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
    }

    try{
        await con.promise().beginTransaction()

        let [data] = await con.promise().execute(`CALL NOVO_CATEGORIA ( ?, ?)`,
            [cd_categoria, nm_categoria]
        )

        res.status(200).send({
            sucesso: "Registro salvo com sucesso!"
        })

        await con.promise().commit()
    }
    catch(err){
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