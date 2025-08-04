const { app, con } = require('../server')

// Criação de Novo pedido
app.post('/importData/pedido', async(req, res) => {
    let connect = await con.promise().getConnection()

    // Validações Iniciais
    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let { CD_PEDIDO, ID_CLIENTE, PAGAMENTO, STATUS_PEDIDO, ITENS_PEDIDO } = req.body.dataRows

    if(!CD_PEDIDO || !ID_CLIENTE || !PAGAMENTO || !STATUS_PEDIDO, !ITENS_PEDIDO){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução e Tratamento do Banco
    try{
        await connect.promise().beginTransaction()

        let [data] = await connect.promise().execute(`CALL NOVO_PEDIDO( ?, ?, ?, ?);`,
            [CD_PEDIDO, ID_CLIENTE, PAGAMENTO, STATUS_PEDIDO]
        )
        let ID_PEDIDO = data[0][0].ID_PEDIDO

        let sql = `INSERT INTO ITENS_PEDIDO (ID_PEDIDO, ID_PRODUTO, QUANTIDADE, VL_UNITARIO) VALUES `;
        for(let i = 0; i < ITENS_PEDIDO.length; i++){
            sql += `(${ID_PEDIDO}, ${ITENS_PEDIDO[i].ID_PRODUTO}, ${ITENS_PEDIDO[i].QUANTIDADE}, ${ITENS_PEDIDO[i].VL_UNITARIO})`
        }

        sql = sql.replaceAll(')(','),(');

        let [itens] = await connect.promise().execute(sql);

        await connect.promise().commit()
        connect.release()

        res.status(200).send({
            sucesso: `${itens.affectedRows} registros inseridos com sucesso`
        })
    }

    // Tratamento de Erros
    catch(err){
        await connect.promise().rollback()
        connect.release()

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

// Consulta de Pedidos
app.get('/exportData/pedido', async(req, res) => {

    let [data] = await con.promise().execute(`CALL GET_PEDIDOS()`)

    res.status(200).send(data[0])

})