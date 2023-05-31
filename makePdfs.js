const fs = require('fs');
const PDFDocument = require('pdfkit');
const PDFMerger = require('pdf-merger-js');
const homeDir = require('os').homedir();


module.exports =  {
    makePDF :()=>{
        document.getElementById("show-progress").innerHTML=('........ CREATING PDFS ........');
        var regionalList = [];
        var middleEastList = [];
        var pakistaniList = [];
        var internationalList = [];
    
        var files = fs.readdirSync(homeDir +'/Desktop/News-Images');
    
        var currentDate = getCurrentDate();
        
        files.forEach(file => {
            
        if(!file.endsWith("pdf")){   
             if(file.includes("arab-news")){
                middleEastList.push(file);
            }
    
            if(file.includes("lead-pakistan") || 
            file.includes("-observer") ||
            file.includes("pakistan-today")){
                pakistaniList.push(file);
            }



            if(file.includes("times_india") || 
            file.includes("pioneer") ||
            file.includes("kiosko-hindu")  ){    
               regionalList.push(file);
           }
    
            if(file.includes("ft_us") || 
                file.includes("wsj") ||
                file.includes("newyork_times") || 
                file.includes("boston_globe") ||
                file.includes("guardian") || 
                file.includes("the_independent")  ){            
                internationalList.push(file);
            }
        }
        });
    
        docRegional = new PDFDocument;
        docRegional.pipe(fs.createWriteStream(homeDir +'/Desktop/News-Images/pdf/Regional/'+currentDate+'.pdf'));
        var mePdf = fs.createWriteStream(homeDir +'/Desktop/News-Images/arab-news.pdf');
    
        docMiddleEast  = new PDFDocument;
        docMiddleEast.pipe(mePdf);
    
        docPakistani  = new PDFDocument;
        docPakistani.pipe(fs.createWriteStream(homeDir +'/Desktop/News-Images/pdf/National/'+currentDate+'.pdf'));
    
        docInternational  = new PDFDocument;
        docInternational.pipe(fs.createWriteStream(homeDir +'/Desktop/News-Images/pdf/International/'+currentDate+'.pdf'));
    
    for(var i in middleEastList){
        document.getElementById("show-progress").innerHTML=(`WORKING ON IMAGE : ${middleEastList[i]}`);
           if(i==0){
            docMiddleEast.image(homeDir +'/Desktop/News-Images/'+middleEastList[i],0,0,{width: docMiddleEast.page.width, height: docMiddleEast.page.height});
           }else{
            docMiddleEast.addPage().image(homeDir +'/Desktop/News-Images/'+middleEastList[i],0,0,{width: docMiddleEast.page.width, height: docMiddleEast.page.height});
           }
           middleEastList.pop();
    }
        
    for(var i in regionalList){
        document.getElementById("show-progress").innerHTML=(`WORKING ON IMAGE : ${regionalList[i]}`);
            
        if(i==0){
            docRegional.image(homeDir +'/Desktop/News-Images/'+regionalList[i],0,0,{width:docRegional.page.width, height:docRegional.page.height});
        }else{
            docRegional.addPage().image(homeDir +'/Desktop/News-Images/'+regionalList[i], 0,0,{width:docRegional.page.width, height:docRegional.page.height});
        }
    
    }
        
        
    for(var i in pakistaniList){
       document.getElementById("show-progress").innerHTML=(`WORKING ON IMAGE : ${pakistaniList[i]}`);
        
        if(i==0){
            docPakistani.image(homeDir +'/Desktop/News-Images/'+pakistaniList[i], 0,0,{width:docPakistani.page.width,height:docPakistani.page.height});
        }else{
            docPakistani.addPage().image(homeDir +'/Desktop/News-Images/'+pakistaniList[i],0,0,{width:docPakistani.page.width,height:docPakistani.page.height});
        }
    }
    
    for(var i in internationalList){
       document.getElementById("show-progress").innerHTML=(`WORKING ON IMAGE : ${internationalList[i]}`);
    
        if(i==0){
            docInternational.image(homeDir +'/Desktop/News-Images/'+internationalList[i], 0,0,{width:docInternational.page.width,height:docInternational.page.height});
        }else{
            docInternational.addPage().image(homeDir +'/Desktop/News-Images/'+internationalList[i], 0,0,{width:docInternational.page.width,height:docInternational.page.height});
        }
    }
    
    
    docRegional.end();
    docMiddleEast.end();
    docPakistani.end();
    docInternational.end();
    
    mePdf.on('finish', function () {
        mergeMiddleEastPdfs();
    });
    
    }
}

function mergeMiddleEastPdfs(){

    var currentDate = getCurrentDate();
    var merger = new PDFMerger();
    merger.add(homeDir +'/Desktop/News-Images/arab-news.pdf').then(()=>{
        
    merger.add(homeDir +'/Desktop/News-Images/gulf-insider-all.pdf', [1]).then(()=>{    
        document.getElementById("show-progress").innerHTML=('Added Page');
        merger.save(homeDir +'/Desktop/News-Images/pdf/MiddleEast/'+currentDate+'.pdf').then(()=>{    
            document.getElementById("show-progress").innerHTML=('Finished PDF');  
        });
    });
    });
}

function getCurrentDate(){
    let monthNames =["Jan","Feb","Mar","Apr",
"May","Jun","Jul","Aug",
"Sep", "Oct","Nov","Dec"];
var today = new Date();

let day = today.getDate();

let monthIndex = today.getMonth();
let monthName = monthNames[monthIndex];

let year = today.getFullYear();
return `${day}-${monthName}-${year}`.toString();  

}
