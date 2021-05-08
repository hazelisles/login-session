const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const session = require('express-session')
const checkAccount = require('./check')
const hour = 3600000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'AsecretmakesAwomanwoman',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: hour } // 設定一小時後無效
}))

let userAccount = { name: null, email: null }

app.get('/', (req, res) => {
  if (req.session.name) {
    res.redirect(`/${userAccount.name}`)
  } else {
    const reset = { status: true }
    return res.render('index', { result: reset })
  }
  
})

app.get('/:name', (req, res) => {
  if (req.session.name) {
    res.render('welcome', { userAccount })
  } else {
    res.redirect('/')
  }
})

app.post('/login', (req, res) => {
  const account = req.body // email, password
  const result = checkAccount(account) // name, status
  if (result.status) {
    userAccount.name = result.name
    userAccount.email = account.email
    req.session.name = userAccount.name
    return res.redirect(`/${userAccount.name}`)
  } else if (account.hold) {
    userAccount.email = account.email
    return res.render('index', { userAccount })
  } else {
    return res.render('index', { result })
  }
})

app.post('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.listen(3000, () => {
  console.log('App now running on http://localhost:3000')
})