var express = require('express')
var app = express()
var fileUpload = require('express-fileupload');
var fs = require('fs');
var PDFParser = require("pdf2json");
var pdfParser = new PDFParser();



app.get('/', function (req, res) {
// fs.unlinkSync("./file1.pdf"); 
 res.send('Hello Digital Ocean!')
})

// default options
app.use(fileUpload());
 
app.post('/upload', function(req, res) {
   fs.stat('./file1.pdf', function(err, stat) {
    if(err == null) {
       // fs.unlinkSync("./file1.pdf");
    } else if(err.code == 'ENOENT') {
        // file does not exist
        console.log('were good');
    } else {
        console.log('Some other error: ', err.code);
    }
   });

   if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./file1.pdf', function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});

function class_get(res){
    
    
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
    //console.log(pdfData);
    
  

    //res.send(json_string);
    
    var class_master = [];

    var pages = pdfData["formImage"]["Pages"];

    for(var i = 0; i < pages.length; i++){

      var classes = pages[i]["Texts"];


      for(var j = 0; j < classes.length; j++){

        var class_out = [];

        if(classes[j]["x"] == 6.556 && classes[j+1]["x"] == 11.699){
          
          class_out.push(classes[j]["R"][0]["T"]);
          class_out.push(classes[j+1]["R"][0]["T"].replace('%20',''));
          var temp_json = JSON.stringify(class_out);
          class_master.push(temp_json);
        }
      }
    }

    var json_string = JSON.stringify(class_master);
    res.write(json_string);
    
    });

    pdfParser.loadPDF("./file1.pdf");

}

app.get('/pdf2json', function(req, res) {
  
  class_get(res);
   
});

app.listen(3000, function () {
  console.log('Magic is happening on port 3000!')
})
