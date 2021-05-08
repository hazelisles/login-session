const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const session = require('express-session')
const checkAccount = require('./check')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'AsecretmakesAwomanwoman',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 設定一小時後無效
}))

app.get('/', (req, res) => {
  const reset = { status: true }
  return res.render('index', { result: reset })
})

app.post('/login', (req, res) => {
  const account = req.body
  const result = checkAccount(account)
  if (result.status) {
    return res.render('welcome', { result })
  } else {
    return res.render('index', { result })
  }
})

app.listen(3000, () => {
  console.log('App now running on http://localhost:3000')
})