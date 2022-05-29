const Turd = require('../schemas/content/turd.schema')

TurdManager = {
  addTurd: async(req, res) => {
    try {
      let newturd = await Turd.createTurd(req.body)
      res.status(200).send(newturd)
    } catch (err) {
      res.status(500).send('Server Error')
    }
  },

  addTurds: async(req, res) => {
    try {
      let newTurds = await Turd.bulkTurds(req.body)
      res.status(200).send(newTurds)
    } catch (err) {
      res.status(500).send('Server Error')
    }
  },

  getTurds: async(req, res) => {
    try {
      let newturd = await Turd.getTurds()
      res.status(200).send(newturd)
    } catch (err) {
      res.status(500).send('Server Error')
    }
  },

  getTurd: async(req, res) => {
    const turdId = req.params.turdId
    try {
      let newturd = await Turd.getTurd(turdId)
      if(newturd) {
        res.status(200).send(newturd)
      } else {
        res.status(404).send('Turd not found')
      }
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
}

module.exports.Controller = TurdManager
module.exports.controller = (app) => {
  app.post('/v1/turd', TurdManager.addTurd)
  app.post('/v1/turds', TurdManager.addTurds)
  app.get('/v1/turd/:turdId', TurdManager.getTurd)
  app.get('/v1/turd', TurdManager.getTurds)
}