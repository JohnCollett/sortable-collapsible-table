# Sortable Collapsible Tables

Create sortable collapsible HTML tables easily. 

## Getting Started

Download the latest release to get started

### Basic Usage

To create a table simply select a part div and data with optional options.

```js
scTable('.selector',data,options);
```

Where data is of the form of an array of objects

```js
data=[{column-1:data-1,column-2:data-1,column-3:data-1},...,{column-1:data-n,column-2:data-n,column-3:data-n}]
```
Or in the form of an array of arrays. Note to 

```js
data=[[data-1,..., data-n],...,[data-1,..., data-n]];
```

Options is an object with customizations for the table. A full list of the options can be found below. 

To collapse the table click on the title and to sort any column click on the column label.

## Documentation

A full list of the options that the table can accept 

### Title <String>

A title that will appear at the top of the table

### Labels <Array>

An array of column lables. This is required if the data is passed as an array of arrays. This will also specify the order of the columns.

### titleClass <String>

Specifies the CSS class of the caption element of the table.

### tableClass <String>

Specifies the CSS class of the table element of the table.

### thClass <String>

Specifies the CSS class of the th elements of the table.

### trClass <String>

Specifies the CSS class of the tr elements of the table.

### tdClass <String>

Specifies the CSS class of the td elements of the table.

### decimalDigits <Integer>

The number of decimals to keep for numeric data.

## CSS classes

To style the tables you can specify your own classes for each part of the table using the options object or use the following default CSS classes

### sc-table-holder

Attaches to the div that holds that table

### sc-table

Class for the table element

### sc-table-title

Class for the table title

### sc-table-th, sc-table-tr, sc-table-td

Classes for the th, tr, and td elements of the table

### Break down into end to end tests


```



## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


