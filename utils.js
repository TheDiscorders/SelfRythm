module.exports = {
    log: function(content) {
        date_ob = new Date();
      
        date = date_ob.getDate().toString();
        month = date_ob.getMonth().toString();
        year = date_ob.getFullYear().toString();
      
        if(date.length === 1){
            date = "0" + date
        }
        if(month.length === 1){
            month = "0" + month
        }
        
        dmy = date + "/" + month + "/" + year
      
        /* Gets hours, minutes and seconds */ 
        hms = date_ob.toLocaleTimeString();
      
        console.log(`[ ${dmy} | ${hms} ] ${content}`)
      }
}