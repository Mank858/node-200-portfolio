const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var profile = require('./profile')
// var axios = require('axios')
require('dotenv').config()

var Mailchimp = require('mailchimp-api-v3')

var mailchimp = new Mailchimp(process.env.API_KEY)
const app = express()


app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'))

// ...
// then define the route that will use your custom router
app.use('/profile', profile)

app.set('views', './views');

app.set('view engine', 'ejs');

const data = {
  person: {
    firstName: 'Jake',
    lastName: 'Espino',
  }
}
app.get('/', (req, res) => {
  res.render('index', data);

  // res.render('contact');

  
  //res.render('contact');
});

app.post('/thanks', (req, res) => {
  
  mailchimp.post('/lists/f30b32da58/members', {
    email_address : req.body.email,
    status : 'subscribed'
  })
  .then((response) => {
    res.render('thanks', { contact: req.body })
    //console.log('Terms from MailChimp API', res);
    //  res.render({
    //    contact: req.body
    // //   // person:  {firstName: 'Jake',
    // //   // lastName: 'Espino'}
    //  })
  }).catch(err => res.status(400).send(err.message));
  
  
})
app.get('/contact', (req, res) => {

});

app.listen(8080, () => {
  console.log('listening at http://localhost:8080');
});