(function(d) {
'use strict';

var trs = 90, tds = 52, tbl = d.createElement('table'),
    birthdateInput = d.getElementById('birthdate'),
    calendarBtn = d.getElementById('calendar-btn'),
    submitBtn = d.getElementById('submit-btn'),
    weeksLivedSpan = d.getElementById('weeksLived'),
    weeksRemainingSpan = d.getElementById('weeksRemaining'),
    tableContainer = d.getElementById('table-container'),
    resultContainer = d.getElementById('result'),
    popup = d.getElementById('popup'),
    popupTableContainer = d.getElementById('popup-table-container'),
    popupWeeksLeft = d.getElementById('popup-weeks-left'),
    popupYearProgress = d.getElementById('popup-year-progress'),
    closeBtn = d.getElementsByClassName('close')[0];

function handleBirthdateChange() {
  var birthdate = new Date(birthdateInput.value);
  if (isNaN(birthdate)) {
    resultContainer.style.display = 'none';
    document.getElementById('blog').style.display = 'block';
  } else {
    calculateResult(birthdate);
    resultContainer.style.display = 'block';
    document.getElementById('blog').style.display = 'none';
  }
}

calendarBtn.addEventListener('click', function() {
  birthdateInput.type = 'date';
  birthdateInput.focus();
});

birthdateInput.addEventListener('blur', function() {
  birthdateInput.type = 'text';
});

submitBtn.addEventListener('click', handleBirthdateChange);

function calculateResult(birthdate) {
  var now = new Date();
  var weeksLived =
      Math.floor(Math.abs(birthdate - now) / (1000 * 60 * 60 * 24 * 7));
  var weeksRemaining = trs * tds - weeksLived;

  weeksLivedSpan.textContent = weeksLived;
  weeksRemainingSpan.textContent = weeksRemaining;

  tableContainer.innerHTML = '';
  for (var c = 0; c < trs; c++) {
    var tr = d.createElement('tr');
    for (var i = 0; i < tds; i++) {
      var td = d.createElement('td');
      var weekNumber = (c * tds) + i;
      var weekYear =
          new Date(birthdate.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000)
              .getFullYear();
      td.setAttribute(
          'data-week', 'Week ' + weekNumber + ' (' + weekYear + ')');
      td.setAttribute('data-year', weekYear);
      if (weekNumber < weeksLived) {
        td.classList.add('past');
        if (weekNumber < 2 * 52) {
          td.classList.add('infant');
        } else if (weekNumber < 13 * 52) {
          td.classList.add('teenage');
        }
      }
      if (weekNumber === weeksLived) {
        td.classList.add('current');
      }
      td.addEventListener('mouseover', function() {
        this.classList.add('hover');
        this.style.transform = 'scale(1.05)';
      });
      td.addEventListener('mouseout', function() {
        this.classList.remove('hover');
        this.style.transform = 'scale(1)';
      });
      td.addEventListener('click', function(event) {
        showPopup(birthdate, event.target.getAttribute('data-year'));
      });
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  tableContainer.appendChild(tbl);
}

function showPopup(birthdate, selectedYear) {
  var now = new Date();
  var currentYear = now.getFullYear();
  var nextBirthday = new Date(birthdate);
  nextBirthday.setFullYear(currentYear);

  if (nextBirthday < now) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  var weeksUntilNextBirthday =
      Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24 * 7));
  var yearProgress = Math.round((1 - (weeksUntilNextBirthday / 52)) * 100);

  popupTableContainer.innerHTML = '';
  var popupTable = d.createElement('table');
  popupTable.classList.add('popup-table');

  for (var i = 0; i < 4; i++) {
    var popupTr = d.createElement('tr');
    for (var j = 0; j < 13; j++) {
      var popupTd = d.createElement('td');
      var weekIndex = i * 13 + j;
      var weekDate = new Date(nextBirthday);
      weekDate.setDate(weekDate.getDate() - (52 - weekIndex) * 7);

      if (weekDate < now) {
        popupTd.classList.add('past');
      } else if (weekDate > now) {
        popupTd.classList.add('future');
      } else {
        popupTd.classList.add('current');
      }

      popupTr.appendChild(popupTd);
    }
    popupTable.appendChild(popupTr);
  }

  popupTableContainer.appendChild(popupTable);

  popupYearProgress.textContent = 'Year Progress: ' + yearProgress + '%';
  popupYearProgress.style.fontFamily = 'Space Mono, monospace';

  popupWeeksLeft.textContent = 'Weeks left: ' + weeksUntilNextBirthday;
  popupWeeksLeft.style.fontSize = '14px';

  popup.style.display = 'block';
}

closeBtn.addEventListener('click', function() {
  popup.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
  }
});
}(document));
