const { app, con } = require('../server')

// Criação de Novo pedido
app.post('/importData/login', async(req, res) => {

    // Validações Iniciais
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        });
        return
    }

    let { nm_cliente, numero, senha } = req.body.dataRows

    if(!nm_cliente, !numero, !senha){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
    }

    else if(numero.length < 11){
        res.status(400).send({
            message: "Número inválido!"
        })
        return
    }

    try{
        
        // Execução da procedure de inserção
        let [data] = await con.promise().execute(`CALL NOVO_CLIENTE(?, ?, ?)`,
            [nm_cliente, numero, senha]
        )

        res.status(200).send({
            sucesso: "Usuário cadastrado com sucesso!"
        })
        return
    }
    catch(err){
        
        // Tratamento de Erros
        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)
            
            res.status(400).send({
                unique: `Chave Duplicada! (${match[1]})`
            })
            return
        }
        else{
            res.status(500).send(
                err
            )
            return
        }
    }
})