const express = require ('express');
const path = require("path")
const app = express();

const port = 5000;


app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))


app.get('/', (req,res) => {
    res.sendFile("views/index.html", {root: __dirname});
});

app.listen(port,() => {
    console.log(`Listening to port ${port}`);
});
