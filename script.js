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
    popupYearPercentage = d.getElementById('popup-year-percentage'),
    popupCurrentYearWeeks = d.getElementById('popup-current-year-weeks'),
    closeBtn = d.getElementsByClassName('close')[0];

function handleBirthdateChange() {
  var birthdate = new Date(birthdateInput.value);
  if (isNaN(birthdate)) {
    resultContainer.style.display = 'none';
  } else {
    calculateResult(birthdate);
    resultContainer.style.display = 'block';
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
  var yearPercentage = Math.round((weeksUntilNextBirthday / 52) * 100);

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

  var totalWeeks = (currentYear - birthdate.getFullYear()) * 52;
  var popupTotalWeeks = d.createElement('p');
  popupTotalWeeks.textContent = 'Total weeks lived: ' + totalWeeks;
  popupTotalWeeks.classList.add('popup-total-weeks');
  popup.appendChild(popupTotalWeeks);

  popupWeeksLeft.textContent = 'Weeks remaining: ' + weeksUntilNextBirthday;

  popupYearPercentage.textContent =
      'Year Percent Spent (doing nothing): ' + (100 - yearPercentage) + '%';

  var currentYearWeeks = Math.floor(
      (now - new Date(birthdate.getFullYear(), 0, 1)) /
      (1000 * 60 * 60 * 24 * 7));
  popupCurrentYearWeeks.textContent =
      'Total weeks you have lived for: ' + currentYearWeeks;
  popupCurrentYearWeeks.style.color = 'orange';

  popup.style.display = 'block';
}

closeBtn.addEventListener('click', function() {
  popup.style.display = 'none';
  popup.innerHTML = '';
});

window.addEventListener('click', function(event) {
  if (event.target === popup) {
    popup.style.display = 'none';
    popup.innerHTML = '';
  }
});
}(document));
