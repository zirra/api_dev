TestManager = {
  test: async(req, res) => {
    try {
      res.status(200).send('transactions')
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
}

module.exports.Controller = TestManager
module.exports.controller = (app) => {
  app.get('/v1', TestManager.test)
  app.get('/v1/test', TestManager.test)
}