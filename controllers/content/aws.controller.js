const {S3} = require('aws-sdk')

const s3 = new S3({region: 'us-east-2'})
const bucketParams = { 
  Bucket: 'ds-stadium-bucket'
}

AwsManager = {
  getAssets: (req, res) => {
    let cat = req.params.category
    let key = `/${req.params.teamNick}/img/`
    bucketParams.Prefix = `ds-${cat}/schools${key}`
    
    s3.listObjects(bucketParams, function(err, data) {
      if (err) {
        res.status(403).send({err, stack: err.stack})
      } else {
        res.status(200).send(data)
      }
    })
  },
  putAssets: (req, res) => {
    let {Body} = req.body
    let cat = req.params.category
    let key = `ds-${cat}/${req.params.teamNick}/img/`
    console.log(Key + ' ' + Body)
    try {
      let bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket(bucketParams).promise()
      bucketPromise.then(
        function(data) {
          let uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject({bucketParams, key, Body}).promise()
          uploadPromise.then(
            function() {
              res.status(200).send(`Files Uploaded to ${bucketParams}`)
            });
      }).catch(
        function(err) {
          console.log(err)
          res.status(401).send(err)
      })
    } catch (error) {
      console.log(error)
      res.status(500).send('Server Error')
    }
  }
}

module.exports.Controller = AwsManager
module.exports.controller = (app) => {
  app.get('/v1/aws/:category/:teamNick', AwsManager.getAssets)
  app.put('/v1/aws/:category/:teamNick', AwsManager.putAssets)
}