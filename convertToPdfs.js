const fs = require('fs');
const homeDir = require('os').homedir();
const PDFDocument = require('pdfkit');
const PDFMerger = require('pdf-merger-js');

module.exports =  {
convertToPDF : ()=>{

    document.getElementById("show-progress").innerHTML= 'Starting Converting Images';

    fs.readdir(homeDir +"/Desktop/News-Images/", function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            if (file.endsWith('jpg')){
                createPDF(file); 
            }
        });
    });

    var merger = new PDFMerger();
        
    merger.add(homeDir +'/Desktop/News-Images/gulf-insider-all.pdf', [1]).then(()=>{    
        document.getElementById("show-progress").innerHTML=('Added Page');
        merger.save(homeDir +'/Desktop/News-Images/converted-PDFs/gulf-insider.pdf').then(()=>{    
            document.getElementById("show-progress").innerHTML=('Finished PDF');  
        });
    
    });

    
    document.getElementById("show-progress").innerHTML= 'Finished Converting Images To PDF';
}
}

function createPDF (imgName){
    var mePdf = fs.createWriteStream(homeDir +'/Desktop/News-Images/converted-PDFs/'+imgName+'.pdf');
    
    doc  = new PDFDocument;
    doc.pipe(mePdf);
    doc.image(homeDir +'/Desktop/News-Images/'+imgName,0,0,{width: doc.page.width, height: doc.page.height});
    doc.end();

}

function extractGulfInsiderPage(){

    var merger = new PDFMerger();
        
    merger.add(homeDir +'/Desktop/News-Images/gulf-insider-all.pdf', [1]).then(()=>{    
        document.getElementById("show-progress").innerHTML=('Added Page');
        merger.save(homeDir +'/Desktop/News-Images/converted-PDFs/gulf-insider.pdf').then(()=>{    
            document.getElementById("show-progress").innerHTML=('Finished PDF');  
        });
    
    });

}