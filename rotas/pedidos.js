const { app, con } = require('../server')

// Criação de Novo pedido
app.post('/importData/pedido', async(req, res) => {

    // Validações Iniciais
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let { cd_pedido, id_cliente, pagamento, status, itens } = req.body.dataRows

    if(!cd_pedido || !id_cliente || !pagamento || !status, !itens){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução e Tratamento do Banco
    try{

        await con.promise().beginTransaction()

        let [data] = await con.promise().execute(`CALL NOVO_PEDIDO( ?, ?, ?, ?);`,
            [cd_pedido, id_cliente, pagamento, status]
        )
        let id_pedido = data[0][0].ID_PEDIDO

        let sql = `INSERT INTO ITENS_PEDIDO (ID_PEDIDO, ID_PRODUTO, QUANTIDADE, VL_UNITARIO) VALUES `;
        for(let i = 0; i < itens.length; i++){
            sql += `(${id_pedido}, ${itens[i].id_produto}, ${itens[i].quantidade}, ${itens[i].vl_unitario})`
        }

        sql = sql.replaceAll(')(','),(');

        let [dataItens] = await con.promise().execute(sql);

        await con.promise().commit()

        res.status(200).send({
            sucesso: `${dataItens.affectedRows} registros inseridos com sucesso`
        })
    }

    // Tratamento de Erros
    catch(err){
        await con.promise().rollback()

        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)
            
            res.status(400).send({
                unique: `Chave Duplicada! (${match[1].split('.')})`
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

// Consulta de Pedidos
app.get('/exportData/pedido', async(req, res) => {

    let [data] = await con.promise().execute(`CALL GET_PEDIDOS()`)

    res.status(200).send(data[0])

})