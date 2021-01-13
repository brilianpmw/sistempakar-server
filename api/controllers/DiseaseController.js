const Disease = require('../models/disease');

DiseaseController = {
  GetData: (req, res) => {

    Disease.find({ is_delete: false })
      .then(data => {
        response.ok(data, res, `request success`)
      })
      .catch(err => {
        response.error('500', 'Some error occurred while showing the symptoms.', res, err)
      });


  },
  Update: async (req, res) => {

    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'files/disease')
      },
      filename: function (req, file, cb) {
        filename = file.originalname.replace(/\s/g, "-")
        cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + filename)
      }
    })
    let fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } else {
        cb(new Error('file format not supported'), false)
      }
    }
    let upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: fileFilter
    })
    let Upfile = upload.single('img_disease')
    Upfile(req, res, async function (err) {
      if (err) {
        console.log(err)
        response.error('500', 'failed upload image', res, err)

      } else {

        let data = null
        if (req.file) {
          let img_path = `disease_img/${req.file.filename}`
          let kode = req.body.kode
          let nama = req.body.nama
          let deskripsi = req.body.deskripsi
          let solusi = req.body.solusi
          data = {
            kode,
            img_path,
            nama,
            deskripsi,
            solusi
          }

        } else {
          let kode = req.body.kode
          let nama = req.body.nama
          let deskripsi = req.body.deskripsi
          let solusi = req.body.solusi
          data = {
            kode,
            nama,
            deskripsi,
            solusi
          }
        }
        if (data) {
          Disease
            .findOneAndUpdate({ _id: req.params.id }, data)
            .then(docs => {

              response.ok(`adding disease success successfully`, res)
            })
            .catch(err => {
              response.error('500', 'adding disease failed', res, err)
            });
        }


      }
    })

  },
  Add: async (req, res) => {
    let storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'files/disease')
      },
      filename: function (req, file, cb) {
        filename = file.originalname.replace(/\s/g, "-")
        cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + filename)
      }
    })
    let fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
      } else {
        cb(new Error('file format not supported'), false)
      }
    }
    let upload = multer({
      storage: storage,
      limits: {
        fileSize: 5 * 1024 * 1024
      },
      fileFilter: fileFilter
    })
    let Upfile = upload.single('img_disease')
    Upfile(req, res, async function (err) {
      if (err) {
        console.log(err)
        response.error('500', 'failed upload image', res, err)

      } else {

        let check_data = async (kode) => {
          let avaible = await Disease.find({ is_delete: false, kode: `${kode}` })
          result = avaible.length === 0 ? true : false;
          return result
        }
        if (req.body.kode) {
          let valid = await check_data(req.body.kode)

          if (valid) {

            let img_path = `disease_img/${req.file.filename}`
            let kode = req.body.kode
            let nama = req.body.nama
            let deskripsi = req.body.deskripsi
            let solusi = req.body.solusi
            let data = new Disease({
              kode,
              img_path,
              nama,
              deskripsi,
              solusi
            })
            data
              .save(data)
              .then(data => {
                response.ok(`adding disease success successfully`, res)
              })
              .catch(err => {
                response.error('500', 'adding disease failed', res, err)
              });


          } else {
            response.error('500', 'kode penyakit telah digunakan', res, err)

          }
        } else {
          response.error('500', 'kode penyakit harus di masukan', res, err)

        }


      }
    })


  },
  GetDetail: async (req, res) => {
    let data = await Disease.find({ is_delete: false, _id: req.params.id })
    data = data.length === 0 ? 'Disease not found' : data
    response.ok(data, res)
  },
  Delete: (req, res) => {
    let data = {
      is_delete: true
    }
    Disease.findOneAndUpdate({ _id: req.params.id }, data)
      .then(data => {
        response.ok('delete data succesfully', res)
      })
      .catch(err => {
        console.log(err)
        response.error('500', 'error while deleting data', res, err)
      })
  },

}

module.exports = DiseaseController;

