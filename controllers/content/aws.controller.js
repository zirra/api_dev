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
  getAssetsV2: (req, res) => {
    let cat = req.params.category
    let key = `/${req.params.teamNick}/img/`
    bucketParams.Prefix = `ds-${cat}/schools${key}`
    s3.listObjects(bucketParams, function(err, data) {
      if (err) {
        res.status(403).send({err, stack: err.stack})
      } else {
        let prefix = data.Prefix
        let images = data.Contents.map(item => {
          if(item.Size != 0) {
            let me = {}
            me.name = item.Key.replace(prefix, '')
            me.location = `https://s3.digitalseat.io/${prefix}${me.name}`
            me.size = `${Math.round(parseFloat(item.Size)/1000)}Kb`
            let myval = Math.round(parseFloat(item.Size)/1000)
            let warn = ''

            if (myval > 0 && myval < 76)
               warn = '#2A52BD'
            
            if (myval > 75 && myval < 101)
              warn = '#24B344'

            if (myval > 100 && myval < 126)
              warn = '#FFD301'

            if (myval > 125 && myval < 176)
              warn = '#FF8B01'

            if (myval > 175)
              warn = '#AD1313'

            me.warn = warn
            return me
          }
        })
        images = images.filter((el) => {
          return el != null
        })
        res.status(200).send(images)
      }
    })
  },
  putAssets: (req, res) => {
    let {Body} = req.body
    let cat = req.params.category
    let key = `ds-${cat}/${req.params.teamNick}/img/`
    console.log(key + ' ' + Body)
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
  app.get('/v2/aws/:category/:teamNick', AwsManager.getAssetsV2)
  app.put('/v1/aws/:category/:teamNick', AwsManager.putAssets)
}