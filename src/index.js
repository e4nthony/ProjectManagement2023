import express from 'express';

const port = process.env.port || 3000;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log('A new request has arrived to index.js');
    res.send('Hello from the server main page');
});

app.listen(port, () => {
    console.log('Server is up and runnig at port : ' + port);
});
// TODO: fix/change syntax to work with eslint format.
