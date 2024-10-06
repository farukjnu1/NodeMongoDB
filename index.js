const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();
var http = require('http').createServer(app);
//var http = require('http');
var io = require('socket.io')(http);
//var https = require('https');
fs = require('fs');

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

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// app.get('/home', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });


/*fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8000);
});*/

/*io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (msg) => {
        //onsole.log(msg);
        io.emit('chat message', msg);
    });
});*/

// Replace the uri string with your connection string.
const uri = "mongodb+srv://farukjnu1:cjiDlz3wrTITdIdh@cluster0.uvxcgeh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


async function run() {
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

async function getProducts(_code) {
    const client = new MongoClient(uri);
    try {
        const database = client.db('ecommercedb');
        const products = database.collection('product');
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

app.get('/api/product', (req, res) => {
    try {
        getProduct('TS007').then(function(result) {
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