const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var profile = require('./profile')

var Mailchimp = require('mailchimp-api-v3')

var mailchimp = new Mailchimp('fa302eb8025e86db08b2851aaf63aa48-us19')
const app = express()

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/views'));

app.use('/profile', profile);

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
});

app.post('/thanks', (req, res) => {
  
  mailchimp.post('/lists/68253a4058/members', {
    email_address : req.body.email,
    status : 'subscribed'
  })
  .then((resp) => {
    res.render('thanks', { contact: req.body })
  }).catch(err => res.send('you are already a member'));
  
});
app.get('/contact', (req, res) => {
  
});

app.listen(8080, () => {
  console.log('listening at http://localhost:8080');
});