

function getTime(){
    
    const temp =false;

    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();



    var showDate = (date + "-" + month + "-" + year).toString();
    var showTime = ((hours<10 ? '0'+hours : hours )+":"+(minutes<10 ? '0'+minutes : minutes )+":"+(seconds<10 ? '0'+seconds : seconds )).toString();
        
    document.getElementById("date-value").innerHTML= `Date : ${showDate}`;
    document.getElementById("time-value").innerHTML= `Time : ${showTime}`;

//    require('./startScraping');

}


getTime();
//setInterval(getTime, 100);