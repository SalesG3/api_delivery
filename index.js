const {app, con} = require('./server.js')

app.get('/', async(req, res) => {

    let [data] = await con.promise().query('SELECT * FROM ENTIDADE');

    res.status(200).send(data);
});