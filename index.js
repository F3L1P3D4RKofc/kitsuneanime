require('dotenv').config();
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    cookieParser = require('cookie-parser'),
    Recaptcha = require('express-recaptcha').RecaptchaV2,
    recaptcha = new Recaptcha(process.env.siteKey, process.env.secretKey),
    email = require('nodemailer'),
    busboy = require('connect-busboy'),
    { ImgurClient } = require('imgur'),
    client = new ImgurClient({ clientId: process.env.imgur });
global.recaptcha = recaptcha;
global.client = client;
global.remetente = email.createTransport({
    host: 'smtp-mail.outlook.com',
    secureConnection: false,
    tls: {
        ciphers: 'SSLv3'
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
app.use(busboy());
mongoose.set('strictQuery', true)

for (let x of ['routes']) require(`./handlers/${x}`)(app);

app.get('*', async(req, res) => res.render('404'));

/*(async() => {
    let animes = require('./models/animes')
    let anime = new animes({
        fullName: 'Shimoneta to Iu Gainen ga Sonzai Shinai Taikutsu na Sekai',
        name: 'shimoneta',
        thumbnail: 'https://betterstatic.ga/cover/b3454e81-3f4f-5f77-9642-67309105d30c.jpeg',
        description: 'O anime se passa dezesseis anos após a criação dos “Artigos de Moral e Educação Pública”, proibindo o linguajar pervertido no país. Okuma Tanukichi se matricula no colégio modelo do país em ordem moral e logo é “convidado” para a Anti-Societal Organization (SOX) por sua fundadora, Kajou Ayame, e também, para o Conselho Estudantil por sua presidente, Anna Nishikinomiya. Como membro da SOX, ele participa de atos obscenos contra a presidente do Conselho Estudantil, Anna, por quem ele é apaixonado. E também, contribui com a SOX na luta pela divulgação de materiais pervertidos.',
        eps: [{
                number: '1',
                url: 'https://video.wixstatic.com/video/24f27e_ce5d8bbc413049b98e80ff5e1c777b28/480p/mp4/file.mp4'
            },
            {
                number: '2',
                url: 'https://video.wixstatic.com/video/24f27e_5046a7e28ebf44f2a047327200eac761/480p/mp4/file.mp4'
            },
            {
                number: '3',
                url: 'https://video.wixstatic.com/video/24f27e_60c39b783027419d807ec66215e65ffe/480p/mp4/file.mp4'
            }
        ]
    })

    anime.save();
})()*/

app.listen('80', () => console.log('Site Online'));
mongoose.connect(process.env.mongoUrl, () => console.log('Database Online'))