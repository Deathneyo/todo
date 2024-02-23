const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList')

let tasks = [];

function getTasksFromLS(){
  if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
  
  }
  
  checkEmptyList();
  
  tasks.forEach(function(task){
    renderTask(task)
  }); 
}
getTasksFromLS()

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
  event.preventDefault();
  const taskTitle = taskInput.value;

  const newTask = {
    id: Date.now(),
    title: taskTitle,
    done: false,
  };

  tasks.push(newTask);
  renderTask(newTask)

  taskInput.value = "";
  taskInput.focus();

  saveToLocalStorage()
  checkEmptyList()
}

function deleteTask(event) {
  if(event.target.dataset.action !== 'delete') return;

  const parentNode = event.target.closest('li');
  const id = Number(parentNode.id);
  const index = tasks.findIndex((task) => task.id === id)

  tasks.splice(index, 1);

  console.log(tasks)
  parentNode.remove();
  saveToLacalStorage()
  checkEmptyList()
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return

    const parentNode = event.target.closest('li');
    const id = Number (parentNode.id);
    const task = tasks.find(function (task){
      return task.id === id
    })

    task.done = true;
    saveToLocalStorage();
    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done')
    // event.target.classList.add('none')
    // console.log(tasks)

}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function renderTask(task){
  const cssClass = task.done ? "task-title task-title--done" : "task-title"
  // const classIsDone = task.done ? " none" : "";
  const taskHTML = ` 
          <li id="${task.id}"class="list-group-item task-item">
            <span class="${cssClass}">${task.title}</span>
            <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn btn-5 btn-action ">
                <img src="./static/img/tick.svg" alt="Done" width="18" height="18">
              </button>
              <button type="button" data-action="delete" class="btn btn-5 btn-action red">
                <img src="./static/img/cross.svg" alt="Done" width="18" height="18">
              </button>
            </div>
          </li>`
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

function checkEmptyList() {

  if (tasks.length === 0) {
    const emptyListHTMl = `
    <li id="emptyList" class="list-group-item empty-list">
      <img src="./static/img/leaf.svg" alt="Empty" width="48" class="mt-3">
      <div class="empty-list__title">The task list is empty</div>
    </li>` 
    tasksList.insertAdjacentHTML('afterbegin', emptyListHTMl);
  }

  if (tasks.length > 0){
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null
  }
}