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
      td.setAttribute('data-weeks', (c * tds) + i);
      if ((c * tds) + i < weeksLived) {
        td.classList.add('past');
        if ((c * tds) + i < 2 * 52) {
          td.classList.add('infant');
        } else if ((c * tds) + i < 13 * 52) {
          td.classList.add('teenage');
        }
      }
      if ((c * tds) + i === weeksLived) {
        td.classList.add('current');
      }

      td.addEventListener('click', function() {
        showPopup(birthdate);
      });
      tr.appendChild(td);
    }
    tbl.appendChild(tr);
  }
  tableContainer.appendChild(tbl);
}

function showPopup(birthdate) {
  var now = new Date();
  var currentYear = now.getFullYear();
  var nextBirthday = new Date(birthdate);
  nextBirthday.setFullYear(currentYear);

  if (nextBirthday < now) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  var weeksUntilNextBirthday =
      Math.floor((nextBirthday - now) / (1000 * 60 * 60 * 24 * 7));
  var weeksFromLastBirthday = 52 - weeksUntilNextBirthday;
  var yearPercentage = Math.round((weeksFromLastBirthday / 52) * 100);

  popupTableContainer.innerHTML = '';
  for (var i = 0; i < 13; i++) {
    var popupTr = d.createElement('td');
    for (var j = 0; j < 2; j++) {
      var popupTd = d.createElement('tr');
      popupTr.appendChild(popupTd);
    }
    popupTableContainer.appendChild(popupTr);
  }

  popupWeeksLeft.textContent =
      'Weeks remaining until your next birthday: ' + weeksUntilNextBirthday;

  popupYearPercentage.textContent =
      'Percentage of the year passed: ' + yearPercentage + '%';

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
