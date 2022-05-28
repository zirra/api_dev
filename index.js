require('dotenv').config()
require('dotenv-safe').config({allowEmptyValues: true})

const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const http = require('http').Server(app)
const mongoose = require('mongoose')
const useragent = require('express-useragent')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const dbPath = process.env.MONGODB_URI
const db = mongoose.connection
const aport = 3000
const PORT = process.env.PORT || aport

mongoose.connect( 
  dbPath, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  }
)

db.on('error', console.error)
db.once('connected', function() { 
  console.log('connected')
})
db.once('open', function() {
  console.log('here')
  startServer()
})

const xPolicy	= function (req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	res.header('Access-Control-Allow-Credentials' ,'true')
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token, X-CSRF-TOKEN, api-key, authorization, content-type, snapid, snaptoken, snaprefresh, gameAuth')
  next()
}

app.use(xPolicy)

app.use(useragent.express())

app.set('port', process.env.PORT || aport)

app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.text({ type: 'text/html' }))

app.enable('trust proxy')
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal'])

app.use(cookieParser())
app.use(session({
  secret: '0xq3t2wgsdgsg040sdgsdfghsdhdfh',
  resave: true,
  saveUninitialized: true})
)

app.all('*', function(req, res, next){ 
  req.syspath = __dirname; next()
})

app.use((req, res, next) => {
  if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
    return res.sendStatus(204)
  }
  return next()
})


app.get('/*', function(req, res, next){
  if(req.session.page_views){
     req.session.page_views++
  } else {
     req.session.page_views = 1
  }
  next()
})

app.get('/lemme', function(req, res){
  if(req.session.page_views){
     res.send('You visited this page ' + req.session.page_views + ' times')
  } else {
     res.send('Welcome to this page for the first time!')
  }
})
startServer = () => {
  fs.readdirSync('./controllers').forEach(function(file) {
    if (file.substring(file.length, file.length-3) === '.js') {
      require('./controllers/' + file).controller(app)
    }
  })
  /*
  fs.readdirSync('./controllers/eachandevery/').forEach(function(file) {
    if (file.substring(file.length, file.length-3) === '.js')  {
      require('./controllers/eachandevery/' + file).controller(app)
    }
  })
  */
}

http.listen(process.env.PORT, function(){
  console.log(`listening on *: ${PORT}`)
})