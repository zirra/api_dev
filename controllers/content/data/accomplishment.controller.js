const accomplishment = require('../../schemas/content/accomps.schema')

AccomplishmentManager = {
  accomplished: async(req, res) => {
    try {
      let acc = await accomplishment.getItems(req.params.turdId)
      res.header('count', acc.count);
      res.status(200).send(acc.result)
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
}

module.exports.Controller = AccomplishmentManager
module.exports.controller = (app) => {
  app.get('/v1/acc/:turdId', AccomplishmentManager.accomplished)
}