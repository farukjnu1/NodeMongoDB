const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
var http = require('http').createServer(app);
//var http = require('http');
var io = require('socket.io')(http);
var formidable = require('formidable');
var https = require('https');
fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use('/files', express.static('files'));

app.get('/images/Graphicloads-100-Flat-2-Chat-2.ico', (req, res) => {
    res.sendFile(__dirname + '/images/Graphicloads-100-Flat-2-Chat-2.ico');
});
app.get('/js/jquery-3.4.1.min.js', (req, res) => {
    res.sendFile(__dirname + '/js/jquery-3.4.1.min.js');
});
app.get('/js/e-commerce.js', (req, res) => {
    res.sendFile(__dirname + '/js/e-commerce.js');
});

app.get('/', function(request, response){
    response.sendFile(__dirname+'/index.html');
});

app.get('/home', function(request, response){
    response.sendFile(__dirname+'/index.html');
});

app.get('/cart', function(request, response){
    response.sendFile(__dirname+'/cart.html');
});

app.get('/chat', function(request, response){
    response.sendFile(__dirname+'/chat.html');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        //onsole.log(msg);
        io.emit('chat message', msg);
    });
});

const uri = "mongodb+srv://farukjnu1:0p1azmNbraHdSaUS@cluster0.uvxcgeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const uri =  "<your-connection-string>";
console.log(uri);

async function run() {
    const client = new MongoClient(uri);
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('movies');
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Back to the Future' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//run().catch(console.dir);

async function getProducts() {
    const client = new MongoClient(uri);
    try {
        const database = client.db('ecommercedb');
        const products = database.collection('product');
        console.log(products);
        return await products.find().toArray();
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function getProduct(_code) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('ecommercedb');
        const products = database.collection('product');
        const query = { code: _code };
        return await products.findOne(query);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function addSalesOrder(data) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('ecommercedb');
        const SalesOrders = database.collection('SalesOrder');

        // Create an array of documents to insert
        let docs =[];
        console.log(data);
        for(var i =0; i < data.products.length; i++){
            docs.push({
                customer: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                code: data.products[i].code,
                price: data.products[i].price,
                qty: data.products[i].qty,
                total:data.products[i].total,
                date: new Date()
            });
        }
        
        // Prevent additional documents from being inserted if one fails
        const options = { ordered: true };

        // Execute insert operation
        const result = await SalesOrders.insertMany(docs, options);

        return await client.close();
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

app.get('/api/product', (req, res) => {
    try {
        //req.query.code === 'TS007'  // true
        getProduct(req.query.code).then(function(result) {
            console.log('/api/product');
            res.send(result);
         });
    } finally {
        // Ensures that the client will close when you finish/error
    }
});

app.get('/api/products', (req, res) => {
    try {
        getProducts().then(function(result) {
            //console.log(result);
            console.log('/api/products');
            res.send(result);
         });
    } finally {
        // Ensures that the client will close when you finish/error
    }
});


app.post('/api/createsales', function (req, res){
    try {
        addSalesOrder(req.body).then(function(result) {
            console.log('/api/createsales');
            res.sendStatus(200);
         });
    } finally {
    }
});

app.post('/uploadfile', function (req, res){
    var strFilePath = '';
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '/files/' + file.name;
    });

    form.on('file', function (name, file){
        strFilePath = '/files/' + file.name;
        res.send(JSON.stringify({"filePath":strFilePath,"fileName":file.name}));
    });

    //res.sendFile(__dirname + '/chat.html');
});