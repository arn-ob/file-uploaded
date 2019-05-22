const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const app = express();
var multer  = require('multer')
// var upload = multer({ dest: 'uploads/', 
//     rename: function (req, fieldname, filename) {
//     return req.file.filename;
// }})

// Worked
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
var upload = multer({ storage: storage })

app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

app.use('/static', express.static('uploads'))


app.get('/', (req, res) => {
    // res.send("Hello")
    let as = fs.readFileSync('save.txt', 'utf8');
    let a = Buffer.from(as, 'base64')
    res.contentType('image/jpeg');
    res.sendFile(as)
})

app.post("/api/photo", upload.single('userPhoto'), function(req,res){
    console.log(req.file)
    let a = fs.readFileSync(req.file.path)
    var encImg = a.toString('base64');
    fs.writeFileSync('save.txt', encImg, {encoding: 'base64'});
    
    console.log("Image Binary", a)
});


app.listen(4300, () => {
    console.log("Server Running")
})