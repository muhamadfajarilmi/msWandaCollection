const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: "password",
  port: 5432,
})

const getAllBarang = (request, response) => {
  const jumlah = request.params.jumlah;
  var queryString = 'SELECT * FROM barang ORDER BY kode DESC';
  if(jumlah === '>0') {
     queryString = 'SELECT * FROM barang WHERE jumlah > 0 ORDER BY kode DESC'
  }
  pool.query(queryString, (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const addBarang = (request, response) => {
    const { kode, nama, jumlah, harga } = request.body
    pool.query('INSERT INTO barang (kode, nama, jumlah, harga) VALUES($1, $2, $3, $4)', [kode, nama, jumlah, harga] , (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).json(results.rows)
    })
};

const updateBarang = (request, response) => {
    const id = parseInt(request.params.id)
    const { kode, nama, jumlah, harga } = request.body

    pool.query('UPDATE barang SET kode = $1, nama = $2, jumlah = $3, harga = $4 WHERE id = $5', [kode, nama, jumlah, harga, id] , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
};

const updateJumlahBarang = (request, response) => {
  const {kodeBarang, jumlah} = request.params;
  pool.query(`UPDATE barang SET jumlah = jumlah+${jumlah} WHERE kode = '${kodeBarang}'` , (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
};

const deleteBarang = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM barang WHERE id = $1', [id] , (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
};

const getAllTransaksi = (request, response) => {
  pool.query('SELECT * FROM transaksi ORDER BY tanggal DESC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const addTransaksi = (request, response) => {
  var queryStringList = [];
  request.body.map((value)=> {
    const queryString = `('${value.kodeBarang}', '${value.jenisTransaksi}', ${value.jumlah}, now(), '${value.namaPembeli}', '${value.namaPenjual}', ${value.harga}, '${value.kodeTransaksi}', ${value.diskon})`;
    queryStringList.push(queryString)
  });
  pool.query(`INSERT INTO transaksi (kode_barang, jenis_transaksi, jumlah, tanggal, nama_pembeli, nama_penjual, harga, kode_transaksi, diskon) VALUES${queryStringList.join()}` , (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).json(results.rows);
  })
}

module.exports = {
  getAllBarang,
  addBarang, 
  updateBarang, 
  deleteBarang, 
  getAllTransaksi,
  addTransaksi,
  updateJumlahBarang
}