import './styles.css';
import './template.html';

import deleteNodeChildren from './helperFunctions/wipeNodeChildren';
import createDiv from './helperFunctions/createDiv';

let DATA = {}; // Base Data Object for all projects and tasks
const STORAGE = window.localStorage;

let ACTIVEPROJECT; // Active Project Toggle

// Caching dom referrences
const PROJECTLIST = document.querySelector('.projectListContainer');
const TASKVIEW = document.querySelector('.project-content');

function updateLocalStorage() {
  STORAGE.setItem('data', JSON.stringify(DATA));
}

function deleteTask(task) {
  delete ACTIVEPROJECT.tasks[task.title];
  updateLocalStorage();
}

// render DOM node for task
function renderTaskNode(task) {
  const taskNode = createDiv('taskContainer');

  const taskHeader = createDiv('taskHeader');
  const taskTitle = createDiv('taskTitle', task.title);
  const taskDelete = createDiv('taskDelete', '❌');

  taskDelete.addEventListener('click', () => {
    deleteTask(task);
    // eslint-disable-next-line no-use-before-define
    renderTasks(ACTIVEPROJECT);
  });

  taskHeader.append(taskTitle, taskDelete);

  const taskDesc = createDiv(['taskDesc', 'hide'], task.notes);

  taskNode.append(taskHeader, taskDesc);

  taskTitle.addEventListener('click', () => {
    taskDesc.classList.toggle('hide');
  });

  TASKVIEW.append(taskNode);
}

// Create a task node for each task listed
function renderTasks(project) {
  const keys = Object.keys(project.tasks);

  deleteNodeChildren(TASKVIEW);

  if (keys.length !== 0) {
    keys.forEach((task) => {
      renderTaskNode(project.tasks[task]);
    });
  }
}

function renderProjectView(project) {
  ACTIVEPROJECT = project;
  renderTasks(project);
}
// Render Project Data to DOM
function renderProjects() {
  const keys = Object.keys(DATA);

  deleteNodeChildren(PROJECTLIST);

  keys.forEach((project) => {
    // eslint-disable-next-line no-use-before-define
    addProjectTab(DATA[project]);
  });
}

function changeProject(project) {
  ACTIVEPROJECT = DATA[project];

  document.querySelector('.header > .title').innerText = ACTIVEPROJECT.title;

  deleteNodeChildren(TASKVIEW);
  renderProjects();
  renderProjectView(DATA[project]);
}

function deleteProject(project) {
  delete DATA[project];
  updateLocalStorage();
  ACTIVEPROJECT = DATA[Object.keys(DATA)[0]];
  changeProject(ACTIVEPROJECT.title);
}

// --- Add Project to Nav ---
function addProjectTab(obj) {
  const projectTab = createDiv('nav-project');
  projectTab.setAttribute('data-project', obj.title);

  const projectTitle = createDiv('title', obj.title);
  const projectDelete = createDiv('project-options', '❌');

  projectDelete.addEventListener('click', (event) => {
    const dataAtrribute = event.target.parentNode.getAttribute('data-project');

    deleteProject(dataAtrribute);
  });

  projectTitle.addEventListener('click', (event) => {
    const dataAtrribute = event.target.parentNode.getAttribute('data-project');

    changeProject(dataAtrribute);
  });

  projectTab.append(projectTitle, projectDelete);
  PROJECTLIST.append(projectTab);
}

// - Factory: Initalize Project Obj
function createProject(title, dueDate, time, priority, color, tasks) {
  const taskObj = {};

  if (tasks) {
    taskObj[tasks.title] = tasks;
  }

  return {
    title,
    dueDate,
    time,
    priority,
    color,
    tasks: taskObj,
  };
}

// Appending Project Obj to data Obj
function appendProject(obj) {
  DATA[obj.title] = obj;
  updateLocalStorage();
}

// Uses Helper function to Inject project data and render dom
function newProject(title, dueDate, time, priority, color, tasks) {
  const project = createProject(title, dueDate, time, priority, color, tasks);
  appendProject(project);
}

// --- TASK MANAGEMENT ---

// Factory: Initialize Task Obj
function createTaskObj(title, notes, dueDate, priority) {
  return {
    title,
    notes,
    dueDate,
    priority,
  };
}

// Append new Task
function appendTask(task) {
  ACTIVEPROJECT.tasks[task.title] = task;
  updateLocalStorage();
}

function toggleProjectForm() {
  const form = document.querySelector('.projects-form');
  form.classList.toggle('hide');

  const formBG = document.querySelector('.formBG');
  formBG.classList.toggle('hide');
}

function submitNewProject() {
  const title = document.querySelector('#projectTitle');
  const date = document.querySelector('#projectDueDate');
  const time = document.querySelector('#projectDueTime');
  const priority = document.querySelector('#projectPriority');
  const color = document.querySelector('#projectColor');

  newProject(title.value, date.value, time.value, priority.value, color.value);

  title.value = '';
  date.value = '';
  time.value = '';
  priority.value = '';
  color.value = '';

  renderProjects();
  toggleProjectForm();
}

function toggleTaskForm() {
  const form = document.querySelector('.addTaskForm');
  form.classList.toggle('hide');
}

function addNewTask() {
  const name = document.querySelector('#taskNameInput');
  const desc = document.querySelector('#taskDescInput');
  const dueDate = document.querySelector('#taskDueInput');
  const priority = document.querySelector('#taskPriorityInput');

  const newTask = createTaskObj(
    name.value,
    desc.value,
    dueDate.value,
    // eslint-disable-next-line comma-dangle
    priority.value
  );

  appendTask(newTask);
  renderTasks(ACTIVEPROJECT);

  const formBox = document.querySelector('.addTaskForm');
  formBox.classList.toggle('hide');
}

const newTaskSubmit = document.querySelector('#taskInputSubmit');
newTaskSubmit.addEventListener('click', () => {
  addNewTask();
});

const newTaskCancel = document.querySelector('#taskInputCancel');
newTaskCancel.addEventListener('click', () => {
  document.querySelector('.addTaskForm').classList.toggle('hide');
});

const newTaskBtn = document.querySelector('.addTask');
newTaskBtn.addEventListener('click', () => {
  toggleTaskForm();
});

const newProjectBtn = document.querySelector('.addProject');
newProjectBtn.addEventListener('click', () => {
  toggleProjectForm();
});

const closeBtn = document.querySelector('#closeBtn');
closeBtn.addEventListener('click', () => {
  toggleProjectForm();
});

const newProjectSubmit = document.querySelector('.projects-form > button');
newProjectSubmit.addEventListener('click', () => {
  submitNewProject();
});

// --- PROGRAM LAUNCH ---

if (STORAGE.getItem('data')) {
  const storageData = STORAGE.getItem('data');
  DATA = JSON.parse(storageData);
} else {
  DATA = {};
  const testTask = createTaskObj('Task1', 'This is test', 'X', 'X');
  newProject('Default', 'TODAY', 'tomorrow', 'high', '#FF', testTask);
}

renderProjects();

// set initial active Project, should be parsed from storage later
ACTIVEPROJECT = DATA[Object.keys(DATA)[0]];
changeProject(ACTIVEPROJECT.title);

renderTasks(ACTIVEPROJECT);

// TODO
// - Add Deadline Display Functionality
// - Add Color Functionality
