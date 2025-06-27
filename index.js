const {app, con} = require('./server.js')

app.get('/datasnap/entidade', async(req, res) => {

    let [data] = await con.promise().query('SELECT * FROM ENTIDADE');

    res.status(200).send(data);
});

app.get('/datasnap/produtos', async(req, res) => {

    let [data] = await con.promise().query('SELECT * FROM PRODUTOS');

    res.status(200).send(data);
});

app.post('/datasnap/caio', function(req, res){
    
    if(req.body.PARAMETRO == "Caio"){
        res.send({
            teste: "PASSOU"
        })
        return
    }

    res.send({
        teste:"NÃO!"
    })



})