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

    let cat = req.params.category
    let key = `/${req.params.teamNick}/img/`

    let data = req = req.body

    bucketParams.Prefix = `ds-${cat}/schools${key}`

    if (data.fileName) {
      
      var params = {
        Bucket: bucketParams.Bucket,
        Key: `${bucketParams.Prefix}${data.fileName}.${data.fileType}`,
        Body: data.Body,
        ACL:'public-read'
      }

      try {
        s3.upload(params, function (err, response) {               
          if(err)
            res.status(404).send("Error in uploading file on s3 due to "+ err)
          else    
            res.status(200).send("File successfully uploaded.")
        })
      } catch (e) {
        console.log('catch fail')
        res.status(500).send(e.toString())
      }
    } else {
      res.status(404).send('Not Found')
    }
  }
}

module.exports.Controller = AwsManager
module.exports.controller = (app) => {
  app.get('/v1/aws/:category/:teamNick', AwsManager.getAssets)
  app.get('/v2/aws/:category/:teamNick', AwsManager.getAssetsV2)
  app.put('/v1/aws/:category/:teamNick', AwsManager.putAssets)
}