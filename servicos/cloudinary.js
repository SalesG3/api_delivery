require('dotenv').config()
const fs = require('fs')
const CryptoJS = require('crypto-js')

const uploadImg = async function(img_path, id){
    let img = `data:'image/jpeg';base64,${(fs.readFileSync(img_path)).toString('base64')}`

    let timestamp = Math.floor(Date.now() / 1000)
    let eager = "w_400,h_400,c_pad|w_400,h_400,c_crop"
    let public_id = "PRODUTO_" + id

    let assinatura = `eager=${eager}&public_id=${public_id}&timestamp=${timestamp}${process.env.IMGSEC}`

    let signature = CryptoJS.SHA1(assinatura)

    let formData = new FormData()

    formData.append('file', img)
    formData.append('api_key', process.env.IMGKEY)
    formData.append('eager', eager)
    formData.append('public_id', public_id)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)

    try{
        let request = await fetch(process.env.IMGURL, {
            method: "POST",
            body: formData
        })

        if(request.status != 200){ console.log(request); return }

        let data = await request.json()

        return data.url
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    uploadImg: uploadImg
}