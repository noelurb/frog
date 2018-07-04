//VAR <- ELEMENTS

const cardWrapper = document.getElementById('card-wrapper');
const inputName = document.getElementById('recipient-name');
const inputText = document.getElementById('message-text');
const send = document.getElementById('send-form');
const close = document.getElementById('close-form');

//FUNCTIONS

const getDate = function getDate() {
  let d = new Date();
  return d.getTime();
}

// UI

const emptyField = function emptyField(e) {
  return (e.target.value === "") ? true : false;
}

const noticeField = function noticeField(e){
  if (emptyField(e)){
    e.target.classList.remove("border-success");
    e.target.classList.add("border-danger");
  } else {
    e.target.classList.remove("border-danger");
    e.target.classList.add("border-success");
  }
}

const fieldsDone = function fieldsDone() {
  return (inputName.value !== "" && inputText.value !== "") ? true : false;
}

const cleanForm = function cleanForm() {
  inputName.value = "";
  inputText.value = "";
  inputName.className = "form-control"
  inputText.className = "form-control"
}

const cleanCardWrapper = function cleanCardWrapper() {
  cardWrapper.innerHTML = "";
}

const showTask = function showTask(taskObj) {
  let newTask = document.createElement('div');
  newTask.id = taskObj.hour
  newTask.className = "col-10 col-md-7 my-4 border rounded";
  newTask.innerHTML = `
    <div class="row border-bottom p-3 bg-light justify-content-between align-items-center">
      <p class="text-uppercase text-success h5 m-0 p-0 col-10"> ${taskObj.name}</p><a href="#" class="btn btn-danger delete-item col" style="max-width:40px;">x</a>
    </div>
    <div class="row">
      <p class="p-4 text-info"> ${taskObj.text} </p>
    </div>
  `
  return newTask
}

const showAllTasks = function showAllTasks(parent, taskArray) {
  taskArray.map((task)=>{
    parent.appendChild(showTask(task));
  })
}

const showNoTasks = function showNoTasks() {
  let noTask = document.createElement('div');
  noTask.className = "col-10 col-md-7 my-4 border";
  noTask.innerHTML = `
    <h2>No hay tareas pendientes :D</h2>
  `
  cardWrapper.appendChild(noTask);
}

//LOCAL STORAGE

const createTask = function createTask() {
  return {
    hour : getDate(),
    name : inputName.value,
    text : inputText.value
  }
}

const getTasksFromStorage = function getTasksFromStorage() {
  let taskArray = [];

  if (localStorage.getItem('tasks') !== null) {
    taskArray = JSON.parse(localStorage.getItem('tasks'));
  }
  
  return taskArray
}

const sendTaskToStorage = function sendTaskToStorage(task, taskArray) {
  taskArray.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskArray));
}

const deleteTask = function deleteTask(id) {
  let taskArray = getTasksFromStorage();
  taskArray.forEach((task, i) => {
    if (task.hour == id){
      taskArray.splice(i,1);
    }
  });
  localStorage.removeItem('tasks');
  localStorage.setItem('tasks', JSON.stringify(taskArray));
}

//CORE

const newTask = function newTask (){
  sendTaskToStorage(createTask(), getTasksFromStorage());
  init();
}

const init = function init() {
  cleanCardWrapper();
  if (getTasksFromStorage().length != 0) {
    showAllTasks(cardWrapper, getTasksFromStorage());
  } else {
    showNoTasks();
  }
}

//LISTENERS

inputName.addEventListener('blur', (e) => {
  noticeField(e);
})

inputText.addEventListener('blur', (e) => {
  noticeField(e);
})

send.addEventListener('click', () => {
  if (fieldsDone()) {
    newTask();
    cleanForm();
    //close modal
    $('#exampleModal').modal('toggle');
  }
})

close.addEventListener('click', () => {
  cleanForm();
})

cardWrapper.addEventListener('click', (e) => {
  if (e.target.classList.contains("delete-item")){
    e.preventDefault();
    let card = e.target.parentElement.parentElement;
    deleteTask(card.id);
    card.remove();
    init();
  }
})

//APP

init();
