let tableFactory=function(element,data,options){
    let table={};
    table.elem=document.querySelector(element);
    table.elements={};
    table.data=data;
    table.sorted;
    
    const tableKeys=Object.keys(data[0]);
    data.forEach(function(item,i){
        item.ind=i;
    });
    
    const tableSort=function(tableSortVar){
        if(table.sorted === tableSortVar){
            if(isNaN(data[0][tableSortVar])){
                table.data.sort(function(a, b){
                if(a[tableSortVar] < b[tableSortVar]) { return 1; }
                if(a[tableSortVar] > b[tableSortVar]) { return -1; }
                return 0;
            });
            }else{
                table.data.sort(function(a,b){
                    return b[tableSortVar]-a[tableSortVar];
                });
            }
            table.sorted='';
        }else{
        if(isNaN(data[0][tableSortVar])){
            table.data.sort(function(a, b){
            if(a[tableSortVar] < b[tableSortVar]) { return -1; }
            if(a[tableSortVar] > b[tableSortVar]) { return 1; }
            return 0;
        });
        }else{
            table.data.sort(function(a,b){
                return a[tableSortVar]-b[tableSortVar];
            });
        }
        table.sorted=tableSortVar;
    }
    };
    const createTh=function(input){
        let th=document.createElement('th');
        th.setAttribute('class', options.thClass ? options.thClass:'table-header');
        th.textContent=input;
        return th;
    };
    const createTr=function(){
        let tr=document.createElement('tr');
        tr.setAttribute('class',options.trClass ? options.trClass:'table-row');
        return tr;
    };
    const createTd=function(input){
        let td=document.createElement('td');
        td.setAttribute('class', options.tdClass ? options.tdClass:'table-elem');
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
           let expandable=document.createElement('div');
           capt.setAttribute('class','table-title');
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
       tableKeys.forEach(function(item){
           let tempth=createTh(item);
           tempth.addEventListener('click',function(){
               tableSort(item);
               tableRedraw();
               headertr.childNodes.forEach(function(header,i){
                   header.textContent=tableKeys[i];
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
       
      data.forEach(function(row){
          let temptr=createTr();
          tableKeys.forEach(function(key){
            let tempData=createTd(row[key]);
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
          tableKeys.forEach(function(key){
            if(isNaN(row[key])){
                table.elements[key][ind].textContent=row[key];
            }else{
                table.elements[key][ind].textContent=row[key].toFixed(2);
            }
              
          });
      }) ;
   };
   createTable();
    
    return table;
}

