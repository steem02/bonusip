"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var body = document.body;
  var note = document.querySelector('.note');
  var list = document.querySelector('.list');
  var newTask = document.querySelector('.new-task');
  var popup = document.querySelector('.popup');
  var popupClose = document.querySelector('.popup__close');
  var popupForm = document.querySelector('.popup__form');
  var formTask = document.querySelector('.form__task');

  function getItemTask(value, checked) {
    var li = document.createElement('li');
    var span = document.createElement('span');
    var text = document.createTextNode(value);
    var button = document.createElement('div');
    span.classList.add('text');
    span.appendChild(text);
    button.classList.add('button');
    li.classList.add('list__item');
    if (checked) li.classList.add('list__item_checked');
    li.appendChild(span);
    li.appendChild(button);
    return li;
  }

  function searchTarget(elem, tag) {
    var parent = elem.parentElement;
    if (parent.tagName === 'BODY') return false;
    if (parent.tagName === tag) return parent;
    searchTarget(parent);
  }

  function hidePopup() {
    popup.classList.remove('popup_active');
    body.style.overflowY = '';
  }

  list.addEventListener('click', function (e) {
    var trg = e.target;
    if (trg.tagName !== 'LI') trg = searchTarget(trg, 'LI');
    if (trg) trg.classList.toggle('list__item_checked');
  });
  newTask.addEventListener('click', function () {
    popup.classList.add('popup_active');
    formTask.focus();
    body.style.overflowY = 'hidden';
  });
  popupClose.addEventListener('click', hidePopup);
  popupForm.addEventListener('submit', function (e) {
    var dateTask = e.currentTarget.elements[0].value;
    e.currentTarget.elements[0].value = '';

    if (dateTask != 0) {
      fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        body: JSON.stringify({
          userId: 11,
          title: dateTask,
          completed: false
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        list.appendChild(getItemTask(json.title, false));
      });
    }

    hidePopup();
    e.preventDefault();
    return false;
  });
  fetch('https://jsonplaceholder.typicode.com/users/1/todos').then(function (response) {
    return response.json();
  }).then(function (json) {
    json.forEach(function (item) {
      list.appendChild(getItemTask(item.title, item.completed));
    });
  });
  setTimeout(function () {
    return note.classList.add('note_visible');
  }, 300);
});