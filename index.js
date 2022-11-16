require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    Recaptcha = require('express-recaptcha').RecaptchaV2,
    recaptcha = new Recaptcha(process.env.siteKey, process.env.secretKey),
    email = require('nodemailer');

global.recaptcha = recaptcha;
global.remetente = email.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    tls: {
        ciphers:'SSLv3'
        },
    port: '587',
    auth: {
        user: process.env.email,
        pass: process.env.pwd
    }
});

app.set('view engine', 'pug');
app.set('views', __dirname + '/pages');
app.use(express.static(__dirname + '/pages/static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser({ path: '/' }));

for (let x of ['routes']) require(`./handlers/${x}`)(app);

app.listen('80', () => console.log('Site Online'));
mongoose.connect(process.env.mongoUrl, () => console.log('Database Online'))