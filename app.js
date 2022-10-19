var express = require('express');
var createError = require('http-errors')
var cors = require('cors');
const bodyParser = require('body-parser')
const service = require('./queries')

var app = express();
const port = 3002

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(cors())

app.get('/barang', service.getAllBarang)
app.get('/barang/:jumlah', service.getAllBarang)
app.post('/barang', service.addBarang)
app.put('/barang/:id', service.updateBarang)
app.put('/barang/:kodeBarang/:jumlah', service.updateJumlahBarang)
app.delete('/barang/:id', service.deleteBarang)
app.get('/transaction', service.getAllTransaksi)
app.post('/transaction', service.addTransaksi)

app.use(function(req, res, next) {
  res.send('Error!')
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

module.exports = app;
