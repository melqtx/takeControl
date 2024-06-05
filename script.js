(function(d) {
'use strict';

var trs = 90, tds = 52, tbl = d.createElement('table'),
    birthdateInput = d.getElementById('birthdate'),
    weeksLivedSpan = d.getElementById('weeksLived'),
    weeksRemainingSpan = d.getElementById('weeksRemaining'),
    tableContainer = d.getElementById('table-container');

// Build table
for (var c = 0; c < trs; c++) {
  var tr = d.createElement('tr');
  for (var i = 0; i < tds; i++) {
    var td = d.createElement('td');
    td.setAttribute('data-weeks', (c * tds) + i);
    tr.appendChild(td);
  }
  tbl.appendChild(tr);
}

tableContainer.appendChild(tbl);

// Calculate weeks on date change
birthdateInput.addEventListener('change', function() {
  var birthdate = new Date(this.value);
  var now = new Date();
  var weeksLived =
      Math.floor(Math.abs(birthdate - now) / (1000 * 60 * 60 * 24 * 7));
  var weeksRemaining = trs * tds - weeksLived;

  weeksLivedSpan.textContent = weeksLived;
  weeksRemainingSpan.textContent = weeksRemaining;

  // Color past weeks
  var fill = d.querySelectorAll('td');
  for (var c = 0; c < weeksLived; c++) {
    fill[c].classList.add('past');
    if (c < 2 * 52) {
      fill[c].classList.add('infant');
    } else if (c < 13 * 52) {
      fill[c].classList.add('teenage');
    }
  }
});
}(document));