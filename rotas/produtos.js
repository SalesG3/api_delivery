const { app, con } = require('../server')

const fs = require('fs')
const multer = require('multer')

const upload = multer({dest: "uploads/"})
const { uploadImg } = require('../servicos/cloudinary')

app.post('/importData/produto', upload.single('img'), async(req, res) => {
    let connect = await con.promise().getConnection()

    // Validações Iniciais
    if(!req.body || !req.body.json){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let json = JSON.parse(req.body.json)

    let { CD_PRODUTO, NM_PRODUTO, DS_PRODUTO, VL_PRODUTO, ID_CATEGORIA } = json

    if(!CD_PRODUTO || !NM_PRODUTO || !VL_PRODUTO || !ID_CATEGORIA){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    try{

        // Execução da procedure de inserção
        await connect.beginTransaction()

        let [data] = await connect.execute(`CALL NOVO_PRODUTO ( ?, ?, ?, ?, ?)`,
            [CD_PRODUTO, NM_PRODUTO, DS_PRODUTO, VL_PRODUTO, ID_CATEGORIA]
        )

        if(req.file){
            let img_path = req.file.destination + req.file.originalname

            fs.renameSync(req.file.path, img_path)

            let url = await uploadImg(img_path, data[0][0].ID_PRODUTO)

            let [update] = await connect.execute(`UPDATE PRODUTOS SET IMG_PRODUTO = ? WHERE ID_PRODUTO = ?`,
                [url, data[0][0].ID_PRODUTO]
            )

            await connect.commit()
            connect.release()

            fs.unlink(img_path, (err) => {
                if(err) throw err
                return
            })

            res.status(200).send({
                sucesso: "Registros salvos com sucesso!",
                img_url: url
            })
            return
        }

        await connect.commit()
        connect.release()

        res.status(200).send({
            sucesso: "Registro salvo sem imagem!"
        })
        return
    }
    catch(err){
        if(req.file){
            let img_path = req.file.destination + req.file.originalname
            fs.renameSync(req.file.path, img_path)
            fs.unlink(img_path, (err) => {
                if(err) throw err
                return
            })
        }

        // Tratamento de erros banco de dados
        await connect.rollback()
        connect.release()
        

        if(err.code == "ER_DUP_ENTRY"){
            let match = err.sqlMessage.match(/for key '(.*?)'/)
            res.status(400).send({
                unique: `Chave Duplicada! (${match[1]})`
            })
        }
        else{
            res.status(500).send({
                error: err
            })
        }
    }
})

// Rota para deletar produto
app.delete('/deleteData/produto/:id', async(req, res) => {

    // Validaçõs Iniciais
    if(!req.params.id){
        res.status(400).send({
            error: "Parâmetros esperados não encontrados!"
        })
        return
    }

    // Execução no Banco
    try{

        let [data] = await con.promise().execute(`DELETE FROM PRODUTOS WHERE ID_PRODUTO = ?`,
            [req.params.id]
        )

        if(data.affectedRows < 1){
            res.status(400).send({
                error: `Chave Inexistente! CATEGORIA.ID_CATEGORIA(${req.params.id})`
            })
            return
        }

        res.status(200).send({
            sucesso: "Registro deletado do banco de dados!"
        })
        return
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
            erro: err
        })
        return
    }
})