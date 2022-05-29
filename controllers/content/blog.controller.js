BlogManager = {
  test: async(req, res) => {
    try {
      res.status(200).send('blog')
    } catch (err) {
      res.status(500).send('Server Error')
    }
  }
}

module.exports.Controller = BlogManager
module.exports.controller = (app) => {
  app.get('/v1/blog', BlogManager.test)
}