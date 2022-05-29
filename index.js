require('dotenv').config()
require('dotenv-safe').config({allowEmptyValues: true})

/* SERVER */
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const http = require('http').Server(app)
const aport = 3000
const PORT = process.env.PORT || aport
const fs = require('fs')

/* SESSION */
const useragent = require('express-useragent')
const cookieParser = require('cookie-parser')
const session = require('express-session')

/* DATABASE */
const mongoose = require('mongoose')
const dbPath = process.env.MONGODB_URI
const db = mongoose.connection

mongoose.connect( 
  dbPath, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  }
)

db.on('error', console.error)
db.once('connected', () => { 
  console.log('Connected to Database')
})
db.once('open', function() {
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

app.get('/visited', function(req, res){
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
  fs.readdirSync('./controllers/content/').forEach(function(file) {
    if (file.substring(file.length, file.length-3) === '.js')  {
      require('./controllers/content/' + file).controller(app)
    }
  })
}

http.listen(process.env.PORT, function(){
  console.log(`Listening on: ${PORT}`)
})