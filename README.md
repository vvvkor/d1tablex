# d1tablex

Add-on for [d1](https://github.com/vvvkor/d1).  
Filter and sort HTML table.  
[Demo & docs](http://vadimkor.ru/projects/d1#tablex)

## Install

```
npm install d1tablex
```

## Usage

On page load call:
```
d1tablex.init(options);
```

In your markup:

* Place rows to be filtered and sorted inside first ``tbody`` of the table.
* Add ``sort`` class to enable sorting columns with 
  * strings
  * numbers
  * dates
  * time intervals
  * bytes
* Add ``data-filter`` attribute with selector pointing at search input field to enable rows filtering
  * searches in all columns by default
  * add ``data-filter-cols`` attribute containing space-separated list of zero-based indexes of searchable columns
  * add ``data-filter-report`` attribute pointing at node where to output the number of matching rows
* Add ``data-case`` attribute for case-sensitive filtration and sorting
* Customize styles for involved nodes

## Options

### attrFilter

Table attribute, containing query selector of search input field.  
Default: ``"data-filter"``

### cAsc

CSS class of header of currently sorted column (ascending).  
Default: ``"bg-y"``

### cDesc

CSS class of header of currently sorted column (descending).  
Default: ``"bg-w"``

### cFilter

CSS class of non-empty filter field.  
Default: ``"bg-w"``

### cHide

CSS class of non-matching row. If empty then ``"display:none;"`` is used.  
Default: ``"hide"``

### cScan

CSS class of searchable columns' header (used if ``data-filter-cols`` is set).  
Default: ``"text-i"``

### cShow

CSS class of matching row.  
Default: ``""``

### cSort

CSS class of sortable column's header.  
Default: ``""``

### qsSort

Query selector of sortable table.  
Default: ``"table.sort"``

### wait

Timeout before applying filter after search string input, ms.  
Default: ``200``

## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
