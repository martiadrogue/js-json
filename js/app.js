var COPY_CONTACTS = [];

function fillContacts(body) {
  var row = body.getElementsByTagName('tr')[0];
  body.removeChild(row);

  var length = CONTACTS.length;
  for (var i = 0; i < length; i++) {
    row = row.cloneNode(true);
    var nombre = row.children[0].children[0];
    var apellido = row.children[1].children[0];
    var email = row.children[2].children[0];
    var empresa = row.children[3].children[0];
    var ciudad = row.children[4].children[0];

    nombre.value = CONTACTS[i].name;
    apellido.value = CONTACTS[i].surname;
    email.value = CONTACTS[i].email;
    empresa.value = CONTACTS[i].company;
    ciudad.value = CONTACTS[i].city;
    row.dataset.id = i;
    body.appendChild(row);
  }

}

function cloneObject(ref) {
    if (null === ref || "object" != typeof ref) return ref;
    var copy = ref.constructor();
    for (var attr in ref) {
        if (ref.hasOwnProperty(attr)) copy[attr] = ref[attr];
    }
    return copy;
}

function addContact(row, body) {
  row.dataset.id = CONTACTS.length;
  var cells = row.getElementsByTagName('TD');
  var name = cells[0].children[0];
  var surname = cells[1].children[0];
  var email = cells[2].children[0];
  var company = cells[3].children[0];
  var city = cells[4].children[0];

  var contact = { name: name.value,
    surname: surname.value,
    company: company.value,
    city: city.value,
    email: email.value };

  CONTACTS.push(contact);
  copyArray(CONTACTS);

  var newRow = row.cloneNode(true);
  var lasCell = newRow.children[newRow.children.length - 1];
  lasCell.innerHTML += '<a href="#" class="btn btn-danger btn-sm">&nbsp;<span class="glyphicon glyphicon-remove"></span>&nbsp; </a>';
  body.appendChild(newRow);
}


function cleanContact(row) {
  var id = row.dataset.id;
  var cells = row.getElementsByTagName('TD');
  var name = cells[0].children[0];
  var surname = cells[1].children[0];
  var email = cells[2].children[0];
  var company = cells[3].children[0];
  var city = cells[4].children[0];

  name.value = '';
  surname.value = '';
  email.value = '';
  company.value = '';
  city.value = '';
}


function removeContact(row) {
  result = window.confirm('Are you sure?');
  if (result) {
    var id = row.dataset.id;
    CONTACTS.splice(id, 1);
    var body = row.parentNode;
    body.removeChild(row);
  }
}

function restoreContact(row) {
  var id = row.dataset.id;
  var cells = row.getElementsByTagName('TD');
  var name = cells[0].children[0];
  var surname = cells[1].children[0];
  var email = cells[2].children[0];
  var company = cells[3].children[0];
  var city = cells[4].children[0];

  name.value = COPY_CONTACTS[id].name;
  surname.value = COPY_CONTACTS[id].surname;
  email.value = COPY_CONTACTS[id].email;
  company.value = COPY_CONTACTS[id].company;
  city.value = COPY_CONTACTS[id].city;

  CONTACTS[id].name = COPY_CONTACTS[id].name;
  CONTACTS[id].surname = COPY_CONTACTS[id].surname;
  CONTACTS[id].company = COPY_CONTACTS[id].company;
  CONTACTS[id].city = COPY_CONTACTS[id].city;
  CONTACTS[id].email = COPY_CONTACTS[id].email;
}


function updateContact(row) {
  var id = row.dataset.id;
  var cells = row.getElementsByTagName('TD');
  var name = cells[0].children[0];
  var surname = cells[1].children[0];
  var email = cells[2].children[0];
  var company = cells[3].children[0];
  var city = cells[4].children[0];

  copyArray(CONTACTS);
  CONTACTS[id].name = name.value;
  CONTACTS[id].surname = surname.value;
  CONTACTS[id].company = company.value;
  CONTACTS[id].city = city.value;
  CONTACTS[id].email = email.value;
  console.log(CONTACTS[id]);
}

function newContact(span, body) {
  var row;
  if (span.classList.contains('glyphicon-save')) {
    row = span.parentNode.parentNode.parentNode;
    addContact(row, body);
  }

  if (span.classList.contains('glyphicon-refresh')) {
    row = span.parentNode.parentNode.parentNode;
    cleanContact(row);
  }
}

function changeContact(span) {
  var row;
  if (span.classList.contains('glyphicon-save')) {
    row = span.parentNode.parentNode.parentNode;
    updateContact(row);
  }

  if (span.classList.contains('glyphicon-refresh')) {
    row = span.parentNode.parentNode.parentNode;
    restoreContact(row);
  }

  if (span.classList.contains('glyphicon-remove')) {
    row = span.parentNode.parentNode.parentNode;
    removeContact(row);
  }
}

function addEvents(body, foot) {
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e = e || window.event;
    var target = (typeof e.target !== 'undefined') ? e.target : e.srcElement;

    // dump
    if (target.id === 'json-dump') {
      var jsonList = document.getElementById('json-list');
      jsonList.value = JSON.stringify(CONTACTS);
    }
  });
  body.addEventListener('click', function(e) {
    e.preventDefault();
    e = e || window.event;
    var target = (typeof e.target !== 'undefined') ? e.target : e.srcElement;

    // save changes, restore
    if (target.tagName === 'A') {
      var span = target.children[0];
      changeContact(span);
    }
    if (target.tagName === 'SPAN') {
      changeContact(target);
    }
  });
  foot.addEventListener('click', function(e) {
    e.preventDefault();
    e = e || window.event;
    var target = (typeof e.target !== 'undefined') ? e.target : e.srcElement;
    // create, clean
    if (target.tagName === 'A') {
      var span = target.children[0];
      newContact(span, body);
    }
    if (target.tagName === 'SPAN') {
      newContact(target, body);
    }
  });
}

function copyArray(arr) {
  var length = arr.length;
  for (var i = 0; i < length; i++) {
    COPY_CONTACTS[i] = cloneObject(arr[i]);
  }
}

function init() {
  var table = document.getElementById('contacts');
  var body = table.getElementsByTagName('tbody')[0];
  var foot = table.getElementsByTagName('tfoot')[0];

  copyArray(CONTACTS);
  addEvents(body, foot);
  fillContacts(body);
}
init();
