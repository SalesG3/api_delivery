const CryptoJS = require('crypto-js')
const fs = require('fs')


// Requisitos Assinatura
let url = "https://api.cloudinary.com/v1_1/dapxyuivg/image/upload"
let imagem = fs.readFileSync('./img.png');
let timestamp = Math.floor(Date.now() / 1000);
let public_id = "teste_imagem";
let eager = "w_400,h_300,c_pad|w_260,h_200,c_crop"
let api_secret = "_56m4Tg5tW7BikoS2DYzJmRwh7U"
let api_key = "421347499161541"

let assinatura = `eager=${eager}&public_id=${public_id}&timestamp=${timestamp}${api_secret}`
console.log(assinatura)

let hash = CryptoJS.SHA1(assinatura)

async function upload(){

    let formData = new FormData()

    formData.append('file', imagem)
    formData.append('api_key', api_key)
    formData.append('eager', eager)
    formData.append('public_id', public_id)
    formData.append('timestamp', timestamp)
    formData.append('signature', hash)

    let request = await fetch(url, {
        method: "POST",
        body: formData
    })

    if(request.status != 200){ console.log(request)}

    let data = await request.json()

    console.log(data)
}

upload()