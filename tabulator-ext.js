
// JavaScript Document
function createTabulator(id,url,columns,pagination,layout="fitColumns",tabulatorOptions={},searchOptions={}){
    if(pagination==undefined){
        pagination={
            type : "local",
            size : 10,
            sizes: [10, 25, 50]
        }
    }
    else{ 
        if(pagination.type==undefined){
            pagination.type="local";
        }
        if(pagination.size==undefined){
            pagination.size=10;
        }
        if(pagination.sizes==undefined){
            pagination.sizes=[10, 25, 50];
        }
    }

    if(tabulatorOptions.columnDefaults==undefined){
        tabulatorOptions.columnDefaults={
            minWidth: 100
        };    
    }

    if(layout=='fitDataTable'){
        $('#'+id).addClass('table-responsive');
    }
    if(columns[0].field=='serial' && columns[0].type=='auto'){
       columns[0]={ 
                title: columns[0].title, 
                field: "serial", 
                width: 70, 
                hozAlign: "center",
                formatter: function(cell) {
                    let pageSize = table.getPageSize(); // Get page size
                    let page = table.getPage() || 1; // Get current page
                    return ((page - 1) * pageSize) + cell.getRow().getPosition(true);
                }
            };
    }
    var searchRow=`<div class="row  search-wrapper">
                        <div class="col-md-4">
                            <div class=" search-box">
                            <i class="search-icon"></i>
                          
                                <input type="text" class="form-control" id="searchInput" placeholder="Search...">
                                <span class="input-group-append">
                                    <button type="button" class="btn btn-info btn-flat clear-btn" id="clearSearch">Clear</button>
                                </span>
                            </div>
                        </div>
                    </div>`;
    $(searchRow).insertBefore('#'+id);
    var options={
        ajaxURL: url,  // Load data from PHP
        layout: layout, // Fit columns to container
        ...tabulatorOptions,
        pagination: pagination.type, // Enable local pagination
        paginationSize: pagination.size, // Rows per page
        paginationSizeSelector: pagination.sizes, // Dropdown for page size
        columns: columns,
        paginationCounter: function(pageSize, currentRow, currentPage, totalRows, totalPages) {
            return totalRows>0?`Showing ${currentRow}-${currentRow+pageSize-1} of ${totalRows}`:'';
        }
    }
    
    var table = new Tabulator("#"+id, options);
    
    function updateSerialNumbers() {
        let rows = table.getRows(true); // true = only filtered rows
        let pageSize = table.getPageSize();
        let page = table.getPage() || 1;
        
        rows.forEach((row, index) => {
            let serial = ((page - 1) * pageSize) + (index + 1);
            row.update({ serial: serial });
        });
    }

    if(columns[0].field=='serial' && columns[0].type=='auto'){
        // Call this after table data is loaded or page is changed
        table.on("dataProcessed", updateSerialNumbers);
        table.on("pageLoaded", updateSerialNumbers);
        table.on("dataFiltered", updateSerialNumbers);
    }

    return table;
}