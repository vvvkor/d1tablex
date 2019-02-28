/*! d1tablex https://github.com/vvvkor/d1tablex */
/* Filter and sort HTML table */

//table.sort[data-filter][data-filter-report][data-case][data-filter-cols]
if(typeof module !== "undefined") var d1 = require('d1css');
(function(){
main = new(function() {

  "use strict";

  this.opt = {
    attrFilter: 'data-filter',
    cFilter: 'bg-w', // filter-on - non-empty filter field
    cScan: 'text-i', // col-scan - searchable columns' header (used if "data-filter-cols" is set)
    cShow: '', // row-show - matching row
    cHide: 'hide', // row-hide - non-matching row (if not set the "display:none" is used)
    cSort: '', // col-sort - sortable column's header
    cAsc:  'bg-y', // col-asc - !non-empty! - header of currently sorted column (ascending)
    cDesc: 'bg-w', // col-desc - header of currently sorted column (descending)
    qsSort: 'table.sort',
    wait: 200
  };

  this.init = function(opt) {
    var i;
    for(i in opt) this.opt[i] = opt[i];
    var t = document.querySelectorAll(this.opt.qsSort + ', table[' + this.opt.attrFilter + ']');
    //t.forEach(this.prepare.bind(this));
    for (i = 0; i < t.length; i++) this.prepare(t[i]);
  }

  this.prepare = function(n) {
    var i, j, start = 0;
    var tb = n.querySelector('tbody');
    var rh = n.querySelector('thead tr');
    if (!rh) {
      rh = tb.rows[0];
      start = 1;
    }
    if (!rh || !tb || !tb.rows || tb.rows.length < 2) return;
    var a = [];
    var h = [];
    for (j = 0; j < rh.cells.length; j++) {
      h[j] = rh.cells[j];
      //if (this.opt.cSort && this.isSortable(rh.cells[j])) h[j].classList.add(this.opt.cSort);
    }
    //var inp = d1.ins('input','',{type:'search',size:4},rh.cells[0]);
    n.vCase = (n.getAttribute('data-case') !== null);
    var fq = n.getAttribute(this.opt.attrFilter);
    n.vInp = fq
      ? document.querySelector(fq)
      : n.querySelector('[name="_q"]');
    if (n.vInp) {
      //n.vInp.onsearch = n.vInp.onkeyup = this.doFilter.bind(this,n);
      if(!n.vInp.vListen) n.vInp.addEventListener('input', this.doFilter.bind(this, n), false);
      n.vInp.vListen = 1;
      this.doFilter(n);
    }
    for (i = start; i < tb.rows.length; i++) {
      var c = tb.rows[i].cells;
      var row = [];
      for (j = 0; j < c.length; j++) row[j] = this.val(c[j], n.vCase);
      a.push({
        d: row,
        n: tb.rows[i]
      }); //data,row_node
    }
    n.vData = a;
    n.vHead = h;
    if (n.classList.contains('sort')) {
      for (j = 0; j < h.length; j++)
        if (this.isSortable(h[j])) {
          if (this.opt.cSort) h[j].classList.add(this.opt.cSort);
          //h[j].onclick = this.doSort.bind(this,n,h[j]);
          if(!h[j].vListen) h[j].addEventListener('click', this.doSort.bind(this, n, h[j]), false);
          h[j].vListen = 1;
        }
    }
  }

  this.doFilter = function(t, e) {
    if (t.vPrev !== t.vInp.value || !e) {
      t.vPrev = t.vInp.value;
      if (this.opt.cFilter) t.vInp.classList[t.vPrev.length > 0 ? 'add' : 'remove'](this.opt.cFilter);
      clearTimeout(t.vTimeout);
      t.vTimeout = setTimeout(this.filter.bind(this, t, t.vInp.value), this.opt.wait);
    }
  }

  this.doSort = function(t, th, e) {
    if (e.target.closest
      ? (!e.target.closest('a,input,select,label'))
      : (' A INPUT SELECT LABEL ').indexOf(' ' + e.target.tagName + ' ') == -1)
    {
      //e.preventDefault();
      this.sort(t, th.cellIndex);
    }
  }

  this.isSortable = function(th) {
    return this.val(th).length > 0;
  }

  this.val = function(s, cs) {
    var r = s.tagName ? s.innerHTML : '' + s;
    r = r.
    replace(/<!--.*?-->/g, '').
    replace(/<.*?>/g, '').
    replace(/&nbsp;/gi, ' ').
    replace(/^\s+/, '').
    replace(/\s+$/, '');
    if (!cs) r = r.toLowerCase();
    return r;
  }

  this.filter = function(n, q) {
    var cnt = 0;
    var i, j, data, s, hide;
    if (!n.vCols) {
      n.vCols = n.getAttribute('data-filter-cols');
      n.vCols = n.vCols ? n.vCols.split(/\D+/) : false;
      if (n.vCols && this.opt.cScan)
        for (i = 0; i < n.vCols.length; i++) {
          if (n.vHead[n.vCols[i]]) n.vHead[n.vCols[i]].classList.add(this.opt.cScan);
        }
    }
    for (i = 0; i < n.vData.length; i++) {
      hide = 0;
      if (q !== '') {
        if (n.vCols.length > 0) {
          data = [];
          for (j = 0; j < n.vCols.length; j++) data.push(n.vData[i].d[n.vCols[j]]);
        } else data = n.vData[i].d;
        s = '|' + data.join('|') + '|';
        hide = !this.matches(s, q, n.vCase);
      }
      if(this.opt.cHide) n.vData[i].n.classList[hide ? 'add' : 'remove'](this.opt.cHide);
      else n.vData[i].n.style.display = hide ? 'none' : '';
      if(this.opt.cShow) n.vData[i].n.classList[hide ? 'remove' : 'add'](this.opt.cShow);
      if (!hide) cnt++;
    }
    if (n.vInp) {
      n.vInp.title = cnt + '/' + n.vData.length;
      var rep = n.getAttribute('data-filter-report');
      if (rep) rep = document.querySelector(rep);
      if (rep) rep.textContent = n.vInp.title;
    }
  }

  this.matches = function(s, q, cs) {
    if (q.substr(0, 1) == '=') return s.indexOf('|' + q.substr(1).toLowerCase() + '|') != -1;
    else if (q.indexOf('*') != -1) {
      q = '\\|' + q.replace(/\*/g, '.*') + '\\|';
      return (new RegExp(q, cs ? '' : 'i')).test(s);
    } else return s.indexOf(cs ? q : q.toLowerCase()) != -1;
  }

  this.sort = function(n, col, desc) {
    if (desc === undefined) desc = (this.opt.cAsc && n.vHead[col].classList.contains(this.opt.cAsc));
    n.vData.sort(this.cmp.bind(this, col));
    if (desc) n.vData.reverse();
    for (var j = 0; j < n.vHead.length; j++) this.mark(n.vHead[j], j == col ? (desc ? -1 : 1) : 0);
    this.build(n);
  }

  this.build = function(n) {
    var tb = n.querySelector('tbody');
    for (var i = 0; i < n.vData.length; i++) {
      tb.appendChild(n.vData[i].n);
    }
  }

  this.mark = function(h, d) {
    if (this.opt.cAsc) h.classList[d > 0 ? 'add' : 'remove'](this.opt.cAsc);
    if (this.opt.cDesc) h.classList[d < 0 ? 'add' : 'remove'](this.opt.cDesc);
  }

  this.cmp = function(by, a, b) {
    a = a.d[by];
    b = b.d[by];
    //date?
    var mode = 'd';
    var aa = this.dt(a);
    var bb = this.dt(b);
    if (isNaN(aa) || isNaN(bb)) {
      //size?
      mode = 'b';
      aa = this.sz(a);
      bb = this.sz(b);
    }
    if (isNaN(aa) || isNaN(bb)) {
      //interval?
      mode = 'i';
      aa = this.interval(a);
      bb = this.interval(b);
    }
    if (isNaN(aa) || isNaN(bb)) {
      //number?
      mode = 'n';
      //use Number instead of parseFloat for more strictness
      aa = parseFloat(a.replace(/(\$|\,)/g, ''));
      bb = parseFloat(b.replace(/(\$|\,)/g, ''));
    }
    if (isNaN(aa) || isNaN(bb)) {
      //string
      mode = 's';
      aa = a;
      bb = b;
    }
    //console.log('['+mode+'] A '+a+' = '+aa+' == '+(new Date(aa))+'; B '+b+' = '+bb+' == '+(new Date(bb)));
    return aa < bb ? -1 : (aa > bb ? 1 : 0);

  }

  this.dt = function(s) {
    var m = s.match(/^(\d+)(\D)(\d+)\D(\d+)(\D(\d+))?(\D(\d+))?(\D(\d+))?(\D(\d+))?$/);
    if (m) {
      var x;
      if (m[2] == '.') x = [4, 3, 1]; //d.m.Y
      else if (m[2] == '/') x = [4, 1, 3]; //m/d Y
      else x = [1, 3, 4]; //Y-m-d
      var d = new Date(m[x[0]], m[x[1]] - 1, m[x[2]], m[6] || 0, m[8] || 0, m[10] || 0, m[12] || 0);
      return d ? d.getTime() : NaN;
    }
    return NaN;
  }

  this.interval = function(s) {
    var x = {
      msec: .001,
      ms: .001,
      s: 1,
      mi: 60,
      sec: 1,
      min: 60,
      h: 3600,
      d: 86400,
      w: 604800,
      m: 2592000,
      y: 31536000
    };
    var m = s.match(/^(\d+)\s*(y|m|w|d|h|min|mi|sec|s|ms|msec)$/i);
    if (m && x[m[2]]) return m[1] * x[m[2]];
    return NaN;
  }

  this.sz = function(s) {
    var x = {
      b: 1,
      kb: 1024,
      mb: 1048576,
      gb: 1073741824,
      tb: 1099511627776,
      pb: 1125899906842624
    };
    var m = s.match(/^((\d*\.)?\d+)\s*(([kmgtp]i?)?b)$/i);
    if (m) {
      m[3] = m[3].replace(/ib$/i, 'b').toLowerCase();
      if (x[m[3]]) return m[1] * x[m[3]];
    }
    return NaN;
  }

})();

  if(typeof module !== "undefined") module.exports = main;
  else if(window) d1tablex = main;
})();