//============convert 1.5B etc to a large number.==================================
function convertMBT(num){
                num= $.trim(num.toUpperCase());
                if(num.substr(-1)=="M"){num=num.split("M")[0];num= (1000000*num);}
                else if(num.substr(-1)=="B"){num=num.split("B")[0];num= (1000000000*num);}
                else if(num.substr(-1)=="T"){num=num.split("T")[0];num= (1000000000000*num);}
                return num;
}

//============convert large number to 1.5B etc.==================================
function fromMBT(num){
                //num=num.trim();
                if(Math.abs(num)>1000000000000){num=num/1000000000000;num=((Math.round(100*num))/100).toString()+"T";}
                else if(Math.abs(num)>1000000000){num=num/1000000000;num=((Math.round(100*num))/100).toString()+"B";}
                else if(Math.abs(num)>1000000){num=num/1000000;num=((Math.round(100*num))/100).toString()+"M";}
                return num;
}




//Function To Add Commas In Numerical Values Like Quantity ( 18734 --> 18,734)
function W(x) {
    if ( x == null || x == NaN || x == 'undefined' || x == undefined) {
        return '-';
    }
    
    var y = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    if ( x.toString().slice(-3) == '.00' && y.slice(-3) != '.00') {
        y += '.00';
    }
    return y;
}

function Wi(x){
    if($.type(x) === "string"){
      var num = parseInt(x.split(',').join(''));
    }
    return num;
}

// functions to convert paisaa to rupees and vica versa
function PTR(paisa){
        var rupee;
        if ( paisa == null || paisa=='-'){
                return '-';
        }
        paisa = (paisa*1).toString();
        if(paisa.slice(0,1)!='-' && paisa.length>=2){
              rupee = (paisa.slice(0,-2)||'0')+'.'+paisa.substr(-2,2);
        }
        else if (paisa.length==1){
              paisa = '0'+paisa
              rupee = (paisa.slice(0,-2)||'0')+'.'+paisa.substr(-2,2);
        }
        else if(paisa.slice(0,1)=='-'){
              paisa = paisa.replace('-','');
              if (paisa.length==1){
                paisa = '0'+paisa
              }
              rupee = (paisa.slice(0,-2)||'0')+'.'+paisa.substr(-2,2);
              rupee = '-'+rupee;
        }
        return (rupee*1).toFixed(2)
}
//to convert rupee to paisaa
function RTP(rupee){
        var paisa;
        if ( rupee == null) {
                return '-';
        }
        rupee = rupee*1;
        rupee = /\./.test(rupee) ? rupee.toFixed(2) : (rupee + 0.00).toFixed(2);
        rupee = rupee.toString();
        paisa = rupee.replace('.','');
        return paisa*1
}


//to return proper rupee value
function RRP(price){
        var rupee;
        rupee=/\./.test(price)?((price+'').split('.')[0])*1:price;
        return rupee;
}

// to calculate how much time ago 
function prettyDate(time){
        //var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
                diff = (((new Date()).getTime() - time) / 1000),
                day_diff = Math.floor(diff / 86400);

        if ( isNaN(day_diff) || day_diff < 0  )
                return;

        return day_diff == 0 && (
                        diff < 60 && "just now" ||
                        diff < 120 && "1 minute ago" ||
                        diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
                        diff < 7200 && "1 hour ago" ||
                        diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
                //day_diff == 1 && "Yesterday" ||
                day_diff < 7 && day_diff + " days ago" ||
                day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago"||
                day_diff < 365 && Math.floor(day_diff / 30) + " months ago" ||
                day_diff > 365 && Math.floor(day_diff / 365) + " years ago";
}
