const request = require("request-promise");
const fs = require('fs');
const req = require('request');
const cheerio = require("cheerio");
const homeDir = require('os').homedir();
const axios = require('axios');
const {Builder, By} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
module.exports = {
    scrape:async ()=>{

    document.getElementById("show-progress").innerHTML='<p>SCRAPING</p>';

    await createFolders().then(async ()=>{
           scrapeLeadPakistan();
           await scrapeKiskoIn();
           await scrapeKisko();
           await scrapePakObserver();
           await scrapePakistanToday();
           await scrapeArabNews();
           await scrapeKiskoUk();
           await scrapeGulfTimes();
       }).then(()=> document.getElementById("show-progress").innerHTML= 'Finished Downloading' );

       
}
}

async function createFolders(){

    document.getElementById("show-progress").innerHTML=('........ CHECKING FOLDER ........');
    

    const DIR = homeDir +'/Desktop/News-Images';
    const PDFDIR = DIR+'/pdf/';
    const convertedPDF = DIR+'/converted-PDFs/';
    const subInt = DIR+'/pdf/International/';
    const subME = DIR+'/pdf/MiddleEast/';
    const subNa = DIR+'/pdf/National/';
    const subRegional = DIR+'/pdf/Regional/';
    
    if(!fs.existsSync(DIR)){
      fs.mkdirSync(DIR)
    }
    if(!fs.existsSync(PDFDIR)){
        fs.mkdirSync(PDFDIR)
      }
    if(!fs.existsSync(subInt)){
        fs.mkdirSync(subInt)
    }
    if(!fs.existsSync(subME)){
        fs.mkdirSync(subME)
    }
    if(!fs.existsSync(subNa)){
        fs.mkdirSync(subNa)
    }
    if(!fs.existsSync(subRegional)){
        fs.mkdirSync(subRegional)
    }
    if(!fs.existsSync(convertedPDF)){
        fs.mkdirSync(convertedPDF)
    }
    
}

async function scrapeKisko(){
    
    document.getElementById("show-progress").innerHTML=('........ STARTING KISKO (MAIN) ........');

    const html = await request.get(
        "https://en.kiosko.net/us/"
    );
    const $ = cheerio.load(html);
    
    $("a.thcover").each(function(e,v){
        const link = $(this).attr("href");
        if(link.includes("ft_us") ||
            link.includes("usa_today")  || 
            link.includes("newyork_times") || 
            link.includes("boston_globe") || 
            link.includes("wsj") || 
            link.includes("usa_today") ){
           getKiskoImage("https://en.kiosko.net/"+link,'kisko-us');
        }
    });   
}

async function scrapeKiskoIn(){
    
    document.getElementById("show-progress").innerHTML=('........ STARTING KISKO (IN) ........');

    const html = await request.get(
        "https://en.kiosko.net/in/"
    );
    const $ = cheerio.load(html);
    
    $("a.thcover").each(function(e,v){
        const link = $(this).attr("href");
        if( (link.includes("hindu") || link.includes("times_india")  || 
            link.includes("pioneer") ) && !link.includes("hindustan_times")  ){
           getKiskoImage("https://en.kiosko.net"+link,'kisko-in');
        }
    });
    
}

async function scrapeKiskoUk(){
    
    document.getElementById("show-progress").innerHTML=('........ STARTING KISKO (UK) ........');

    const html = await request.get(
        "https://en.kiosko.net/uk/"
    );
    const $ = cheerio.load(html);
    
    $("a.thcover").each(function(e,v){
        const link = $(this).attr("href");
        if( (link.includes("the_independent") || link.includes("guardian"))  ){
           getKiskoImage("https://en.kiosko.net"+link,'kisko-uk');
        }
    });
}

async function getKiskoImage(url,progress){
    
    const html = await request.get(url);        
    const $ = cheerio.load(html);
    var imgLink = $("img#portada").attr("src");

    var imgName = imgLink.split('/').pop();
     downloadImg(`https:${imgLink}`,imgName,homeDir +"/Desktop/News-Images/kiosko",progress);
}

async function scrapeArabNews(){
    document.getElementById("show-progress").innerHTML=('........ STARTING ARAB NEWS ........');
    const html = await request.get(
        "https://www.arabnews.com/issuepdf/"
    );
    const $ = cheerio.load(html);
    var urlNonce = $("div.title-area.margin-bottom-2 > h4").text().split(' ')[2];
    var url = `https://www.arabnews.com/sites/default/files/pdf/${urlNonce}/files/assets/common/page-html5-substrates/page0001_4.jpg`;
    var imgname =  url.split('/');
     downloadImg(url,imgname[imgname.length -1],homeDir + "/Desktop/News-Images/arab-news",'arab-news');
}

async function scrapePakObserver(){

    document.getElementById("show-progress").innerHTML=('........ STARTING PAK OBSERVER ........');

    const html = await request.get(
        "https://epaper.pakobserver.net/"
    );
    const $ = cheerio.load(html);
    var url = $("#lightgallery > li.col-xs-12.col-sm-12.col-md-12.col-lg-12 > a > img").attr("src");
    
    // var d = new Date(Date.now());
    // var datesplit = d.toISOString().split('T')[0].split('-');  
    // var url ="https://epaper.pakobserver.net/wp-content/uploads/"+datesplit[0]+"/"+datesplit[1]+"/1IBD-scaled.jpg";
  
    var imgname =  url.split('/');
     downloadImg(url,imgname[imgname.length -1],homeDir +"/Desktop/News-Images/pak-observer",'pak-observer');
}

async function scrapeGulfTimes(){
    document.getElementById("show-progress").innerHTML=('........ STARTING GULF TIMES ........');

    const html = await request.get(
        // "https://gulf-times.com/PDF"
        "https://gulf-times.com/pdfs"
    );
    const $ = cheerio.load(html);
    
    var pdfLink = $("div.col-md-4:nth-child(3) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1)").attr("href");
    downloadPDF(pdfLink,homeDir +'/Desktop/News-Images/gulf-insider-all.pdf','gulf-insider');
    
}

function scrapeLeadPakistan(){

    document.getElementById("show-progress").innerHTML=('........ STARTING LEAD PAKISTANI ........');

    var d = new Date(Date.now());
    var datesplit = d.toISOString().split('T')[0].split('-');
    
    var dateUrl = datesplit[0]+datesplit[1]+"/"+datesplit[2];
    
    var fileName =  "Page1.jpg";
    var fUrl = "https://leadpakistan.com.pk/ep/"+dateUrl+"/pages/Page1.jpg";

     downloadImg(fUrl,fileName,homeDir +"/Desktop/News-Images/lead-pakistan",'lead-pakistan');

}

async function scrapePakistanToday(){

    document.getElementById("show-progress").innerHTML=('........ STARTING PAKISTAN TODAY ........');


    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');

    const driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();

    const url = "https://www.pakistantoday.com.pk/category/epapers/";
    try{
    await driver.get(url);
    const element = await driver.findElement(By.css('#tdi_27 > div:nth-child(4) > div > div.td-image-container > div > a > span'));
    document.getElementById("show-progress").innerHTML=('DATA FOUND');
    const imgUrl =await element.getAttribute('data-img-url');
    
    var name = imgUrl.split('/');
    name = name[name.length -1];
    downloadImg(imgUrl,name,homeDir +"/Desktop/News-Images/pakistan-today",'pakistan-today');
    }catch(e){
        document.getElementById("show-progress").innerHTML=(`ERROR ${e}`);
    }
    finally{
        driver.quit();
    }
    
    // try{
    // var baseUrl = "https://www.pakistantoday.com.pk/category/epapers/";
    // axios.get(baseUrl) 
	// .then(({ data }) => { 
    //     document.getElementById("show-progress").innerHTML=('DATA FOUND');
	// 	const $ = cheerio.load(data); 
 
    //     var url = $("div:nth-child(3) > div > div.td-image-container > div > a > span").attr("data-img-url");

    //     var name = url.split('/');
    //     name = name[name.length -1];
    //     downloadImg(url,name,homeDir +"/Desktop/News-Images/pakistan-today",'pakistan-today');
	// });
          
    // }catch(e){
    //     document.getElementById("show-progress").innerHTML=('EXCEPTION '+e);
    // }
}

function downloadImg(url, name, folderName,progress){
  try{  
   document.getElementById(progress).innerHTML=("Processing IMG : " + name);
    req.get(url).pipe(fs.createWriteStream(folderName + '-' + name)).on('finish', () => {
        document.getElementById(progress).innerHTML=("Finished Creating Image : "+  name);   
      });
   
 }catch (e){
    document.getElementById("show-log").innerHTML=("ERROR CREATING "+name+" : "+e );
   
   }

}

async function downloadPDF(pdfURL, outputFilename,progress) {
    document.getElementById(progress).innerHTML=("Processing PDF : " +outputFilename );
    let pdfBuffer = await request.get({uri: pdfURL, encoding: null});
 
   try {
   fs.writeFileSync(outputFilename, pdfBuffer);
   document.getElementById(progress).innerHTML=("Finished Creating PDF : " +outputFilename );
   
   }catch (e){
    document.getElementById("show-log").innerHTML=("Error Creating PDF : " + outputFilename);

   }
}

