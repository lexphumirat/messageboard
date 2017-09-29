const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const port = process.env.PORT || 8000;
const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/messageboard');
mongoose.connection.on('connected', () => console.log("connected"));

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 4
    },

    messages:[
        {
        type: Schema.Types.ObjectId,
        ref: 'Message'
        }
    ]
},  {
    timestamps: true
});

const MessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },

    _user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, {
    timestamps: true
});

app.post('/add', function(request, response){
    console.log('POST DATA', request.body);
    const user = new User({name: request.body.name});
    user.save(function(err){
        if(err){
            console.log("something went wrong at user");
        } else {
            console.log('added user');
            const message = new Message({message: request.body.message});
            message.save(function(err){
                if (err){
                    console.log('something went wrong at message add');
                }else {
                    console.log('added user and message');
                    response.render('index.ejs', { data: request.body});
                }
            })
        }
    })
})

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);


app.get('/', function(request, response) {

    response.render('index');

});


app.listen(port, () => console.log('listen on port 8000 ${ port }'));
