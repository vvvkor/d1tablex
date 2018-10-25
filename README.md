# d1tablex

Make HTML table searchable and sortable.  
[Demo & docs](http://vadimkor.ru/projects/tablex/)

## Install

```
npm install d1tablex
```

## Usage

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

## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)
