const express = require("express");
const bodyParser = require('body-parser')
const fs = require("fs");
const app = express();
var multer  = require('multer')
// var upload = multer({ dest: 'uploads/', 
//     rename: function (req, fieldname, filename) {
//     return req.file.filename;
// }})

app.use(bodyParser.urlencoded())

// Worked
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.headers.filename)
        let a = 'uploads/' + req.headers.filename;
        if (!fs.existsSync(a)) {
            fs.mkdirSync(a, 0744);
            cb(null, a)
        } else {
            cb(null, a)
        }
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

// Convert Image Base64 Not worked. So better to save that image to file
app.get('/', (req, res) => {
    // res.send("Hello")
    let as = fs.readFileSync('save.txt', 'utf8');
    let a = Buffer.from(as, 'base64')
    res.contentType('image/jpeg');
    res.sendFile(as)
})

// Send Image to save and upload
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