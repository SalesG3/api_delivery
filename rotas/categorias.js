const { app, con } = require('../server')
const { uploadImg } = require('../servicos/cloudinary')

app.post('/importData/categoria', async(req, res) => {
    console.log(req.body)

    if(!req.body || !req.body.dataRows){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }

    let { img, cd_categoria, nm_categoria, ds_categoria } = req.body.dataRows

    if(!cd_categoria || !nm_categoria){
        res.status(400).send({
            error:"Parâmetros esperados não encontrados!"
        })
        return
    }
    
    let id_categoria

    if(img){
        
    }

    try{
        let [data] = await con.promise().execute(`CALL NOVO_CATEGORIA( ?, ?, ?)`,
            [cd_categoria, nm_categoria, ds_categoria || null]
        )

        id_categoria = data[0][0].ID_CATEGORIA

        if(!img){
            res.status(200).send({
                sucesso: "TESTE! Inserido sem imagem."
            })
            return
        }
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
        return
    }

    try{
        let img_url = await uploadImg(img, "CAT", id_categoria)

        let [data] = await con.promise().execute(`UPDATE CATEGORIAS SET IMG_CATEGORIA = ? WHERE ID_CATEGORIA = ?`,
            [img_url, id_categoria]
        )

        res.status(200).send(
            data
        )
        return
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
        return
    }
})