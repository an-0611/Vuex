const express = require('express') // 載入Express 套件
const app = express(); // 建立 express application 物件
// const path = require('path');
const port = process.env.PORT || 8888;
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(express.static('dist')); // 載入靜態頁面

app.get('/', function(req, res){ // server 啟動後的首頁
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => {
  console.log('app listening on port: ' + port) // node app.js
})

