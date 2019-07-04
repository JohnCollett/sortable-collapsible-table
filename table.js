let tableFactory=function(element,data,options){
    let table={};
    table.elem=document.querySelector(element);
    table.elem.setAttribute('class','sc-table');
    table.elements={};
    table.labels=[];
    table.sorted;
    
    
    const defaultLabels=function(n){
        let labels=[];
        for(let i=0;i<n;i++){
            labels.push('data'+i);
        }
        return labels;
    }
    
    const reformData=function(){
        if(typeof data[0] === 'object' && data[0] !== null && Array.isArray(data[0]) === false){
            table.data=data;
            table.labels=options.labels ? options.labels : Object.keys(data[0]);
            
        }else if(Array.isArray(data[0])){
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
    };
    
    //sets data for the chart
    reformData();
    
    const tableSort=function(tableSortVar){
        if(table.sorted === tableSortVar){
            table.data.sort(function(a,b){
                return (a[tableSortVar]+'').localeCompare((b[tableSortVar]+''), undefined, {numeric: true, sensitivity: 'base'});
            });
            
            table.sorted='';
        }else{
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
        if(isNaN(input)){
            td.textContent=input;
        }else if(Number.isInteger(Number(input))){
            td.textContent=input;
        }else{
            td.textContent=input.toFixed(options.decimalDigits ? options.decimalDigits:2);
        }
        return td;
    };
    
    const createTable=function(){
       const tab=document.createElement('table');
       if(options.title){
           let capt=document.createElement('caption');
           let captH=0;
           let tableH=0;
           let expanded=true;
          // let expandable=document.createElement('div');
           capt.setAttribute('class','sc-table-title');
           capt.textContent=' [ - ] '+options.title;
           capt.addEventListener('click',function(){
                if(expanded){
                    captH=capt.clientHeight;
                    tableH=capt.parentNode.parentNode.clientHeight-captH;
                    capt.textContent=' [ + ] '+options.title;
                    capt.parentNode.parentNode.style.height=capt.parentNode.parentNode.clientHeight+'px';
                    setTimeout(function(){
                        capt.parentNode.parentNode.style.height=captH+'px';
                    },100);
                    
                    setTimeout(function(){
                        capt.parentNode.querySelectorAll("tr").forEach(function(item){
                            item.style.display='none';
                        });
                        capt.parentNode.parentNode.style.height='auto';
                    },900);
                }else{
                    captH=capt.clientHeight;
                    capt.parentNode.parentNode.style.height=captH+'px';
                    capt.textContent=' [ - ] '+options.title;
                    capt.parentNode.querySelectorAll("tr").forEach(function(item){
                            item.style.display='table-row';
                    });
                    setTimeout(function(){
                        capt.parentNode.parentNode.style.height=capt.clientHeight+tableH+'px';
                    },100);
                    setTimeout(function(){
                        capt.parentNode.parentNode.style.height='auto';
                    },900);
                    
                }
                expanded=!expanded;
           });
           
           tab.appendChild(capt);
       }
       const headertr=createTr();
       table.labels.forEach(function(item){
           let tempth=createTh(item);
           tempth.addEventListener('click',function(){
               tableSort(item);
               tableRedraw();
               headertr.childNodes.forEach(function(header,i){
                   header.textContent=table.labels[i];
               });
               if(table.sorted===item){
                   tempth.textContent=item+ " \u25B2";
               }else{
                   tempth.textContent=item+" \u25BC";
               }
           });
           headertr.appendChild(tempth);
       });
       tab.appendChild(headertr);
       
      table.data.forEach(function(row){
          let temptr=createTr();
          table.labels.forEach(function(key){
            let tempData=createTd(row[key] ? row[key] : '');
            temptr.appendChild(tempData);
            if(table.elements[key]){
              table.elements[key].push(tempData);
            }else{
                table.elements[key]=[tempData];
            }
              
          });
          tab.appendChild(temptr);
      });
      table.elem.appendChild(tab);
    };
   const tableRedraw=function(){
      table.data.forEach(function(row,ind){
          table.labels.forEach(function(key){
            if(isNaN(row[key])){
                table.elements[key][ind].textContent=row[key];
            }else if(Number.isInteger(Number(row[key]))){
                table.elements[key][ind].textContent=row[key];
            }
            else{
                table.elements[key][ind].textContent=row[key].toFixed(options.decimalDigits ? options.decimalDigits:2);
            }
              
          });
      }) ;
   };
   createTable();
    
    return table;
}

