let csTable=function(element,data,options){
    let table={};
    table.elem=document.querySelector(element);
    table.elem.setAttribute('class','sc-table');
    table.elements=[];
    table.labels=[];
    table.sorted;
    
    // create labels for columns if no labels are provided 
    const defaultLabels=function(n){
        let labels=[];
        for(let i=0;i<n;i++){
            labels.push('data'+i);
        }
        return labels;
    };
    
    // Form the data structure and labels for the table 
    const reformData=function(){
        //If the data is already in the form of an object attach it to the object and set labels
        if(typeof data[0] === 'object' && data[0] !== null && Array.isArray(data[0]) === false){
            table.data=data;
            table.labels=options.labels ? options.labels : Object.keys(data[0]);    
        }
        // if data is an array of arrays create object structure
        else if(Array.isArray(data[0])){
            let maxLength=data.reduce(function(acc,cur){
                return Math.max(acc,cur.length);
            },0);
            table.labels=options.labels ? options.labels : defaultLabels(data.length);
            let newData=[];
            for(let i=0;i<maxLength;i++){
                let obj={};
                table.labels.forEach(function(label,ind){
                    if(data[ind][i]){
                        obj[label]=data[ind][i];
                    }
                });
                newData.push(obj);
            }
            
            table.data=newData;
        
        }
        //set up index for sorting
        table.data.forEach(function(row,i){
            row.ind=i;
        });
    };
    

    
    //Sort the table data by column
    const tableSort=function(tableSortVar){
        //Natural sort on the selected column
        if(table.sorted === tableSortVar){
            table.data.sort(function(a,b){
                return (a[tableSortVar]+'').localeCompare((b[tableSortVar]+''), undefined, {numeric: true, sensitivity: 'base'});
            });
            
            table.sorted='';
        }
        //modified natural sort where empty entries are always at the bottom of the chart
        else{
           table.data.sort(function(a,b){
               if(!b[tableSortVar] && !a[tableSortVar]){
                   return 0;
               }else if(!a[tableSortVar]){
                   return 1;
               }
               else if(!b[tableSortVar]){
                   return -1;
               }
               else{
                    return (b[tableSortVar]+'').localeCompare((a[tableSortVar]+''), undefined, {numeric: true, sensitivity: 'base'});
                }
            });
            
            table.sorted=tableSortVar;
        }
    };
    //Gets transition duration from CSS
    const getTransitionValue=function(){
        let styles=window.getComputedStyle(table.elem, null);
        let duration=styles.getPropertyValue('transition-duration');
        duration=Number(duration.substr(0,duration.indexOf('s')))*1000;
        console.log(styles,duration);
        return duration;
    };
    
    //Functions to create basic Dom structures for the table
    const createTh=function(input){
        let th=document.createElement('th');
        th.setAttribute('class', options.thClass ? options.thClass:'sc-table-header');
        th.textContent=input;
        return th;
    };
    const createTr=function(){
        let tr=document.createElement('tr');
        tr.setAttribute('class',options.trClass ? options.trClass:'sc-table-row');
        return tr;
    };
    const createTd=function(input){
        let td=document.createElement('td');
        td.setAttribute('class', options.tdClass ? options.tdClass:'sc-table-elem');
        // Set the table elements to be a spoecified number of decimal places if they're not integers or wordes
        if(isNaN(input)){
            td.textContent=input;
        }else if(Number.isInteger(Number(input))){
            td.textContent=input;
        }else{
            td.textContent=input.toFixed(options.decimalDigits ? options.decimalDigits:2);
        }
        return td;
    };
    
    const createTitle=function(){
        //Create default title if none exists
        if(!options.title){
            options.title=`Data by ${table.labels[0]}`;
        }
        
        //create table title and set class 
        let capt=document.createElement('caption');
        capt.setAttribute('class','sc-table-title');
        capt.textContent=' [ - ] '+options.title;
        
        //set variable for the expanding animation
        let captH=0;
        let tableH=0;
        let expanded=true;
        let duration=getTransitionValue();
        
        //attach collapse function to the title 
        capt.addEventListener('click',function(){
             if(expanded){
                 
                 //grab current title element height and table height
                 captH=capt.clientHeight;
                 tableH=capt.parentNode.parentNode.clientHeight-captH;
                 
                 //set title to show that the table is collapsed
                 capt.textContent=' [ + ] '+options.title;
                 
                 //set the parent div of the table to be its current height in px not 'auto' for the ability to animate height
                 capt.parentNode.parentNode.style.height=capt.parentNode.parentNode.clientHeight+'px';
                 
                 //timeout so that the height will actually animate instead of acting instantaneously. Set at 100 ms could be smaller feel free to experiment.
                 setTimeout(function(){
                     capt.parentNode.parentNode.style.height=captH+'px';
                 },100);
                    
                //After animation is done this hides all rows of the table leaving only the title. Then sets the height of the parent div to be auto so that it will be responsive again.
                 setTimeout(function(){
                     capt.parentNode.querySelectorAll("tr").forEach(function(item){
                         item.style.display='none';
                     });
                     capt.parentNode.parentNode.style.height='auto';
                 },100+duration);
                 
                 
             }else{
                 
                 //set current height to be height in pixels 
                 captH=capt.clientHeight;
                 capt.parentNode.parentNode.style.height=captH+'px';
                 
                 //set title to show that the table is collapsable 
                 capt.textContent=' [ - ] '+options.title;
                 
                 //set the table rows back to display table row before increasing the height
                 capt.parentNode.querySelectorAll("tr").forEach(function(item){
                         item.style.display='table-row';
                 });
                 
                 //set table parent div to be full height in pixels
                 setTimeout(function(){
                     capt.parentNode.parentNode.style.height=capt.clientHeight+tableH+'px';
                 },100);
                 
                 //after animation set the height of the parent div back to auto 
                 setTimeout(function(){
                     capt.parentNode.parentNode.style.height='auto';
                 },100+duration);

             }
             //toggle expand flag
             expanded=!expanded;
        });
        return capt;
        
       
    }
    
    
    const createTable=function(){
       const tab=document.createElement('table');
       
       //Create Title 
       let capt=createTitle();
       tab.appendChild(capt);
       
       //create headers and attach sort functions
       const headerTr=createTr();
       table.labels.forEach(function(item){
           let tempth=createTh(item);
           tempth.addEventListener('click',function(){
               tableSort(item);
               tableRedraw();
               headerTr.childNodes.forEach(function(header,i){
                   header.textContent=table.labels[i];
               });
               //Display Sort direction
               if(table.sorted===item){
                   tempth.textContent=item+ " \u25B2";
               }else{
                   tempth.textContent=item+" \u25BC";
               }
           });
           headerTr.appendChild(tempth);
       });
       tab.appendChild(headerTr);
       
      //create table data 
      table.data.forEach(function(row){
          let temptr=createTr();
          table.labels.forEach(function(key){
            let tempData=createTd(row[key] ? row[key] : '');
            temptr.appendChild(tempData);              
          });
          table.elements.push(temptr);
          tab.appendChild(temptr);
      });
      
      //attach table to parent div
      table.elem.appendChild(tab);
    };
    //function to sort the table items
   const tableRedraw=function(){
       let order=table.data.map(function(dataRow){
           return dataRow.ind;
       });
       let tab=table.elem.querySelector('table');
       order.forEach(function(ind){
           tab.appendChild(table.elements[ind]);
       });
   };
   
   //sets data for the chart
   reformData();
   
   //call the create table  
   createTable();
    
    return table;
}

