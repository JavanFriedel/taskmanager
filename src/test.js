//Base Data Object for all projects and tasks
const Data = {};

let activeProject;

// Caching dom referrences
const projectList = document.querySelector("nav");
const projectAddNode = document.querySelector(".addProject");

const taskView = document.querySelector(".project-content");
const taskAddNode = document.querySelector(".addTask");

// --- Add Project to Nav ---
function addProjectTab(obj) {
  const projectTab = document.createElement("div");
  projectTab.classList.add("nav-project");
  projectTab.setAttribute(`data-project`, obj.title);

  const projectTitle = document.createElement("div");
  projectTitle.classList.add("title");
  projectTitle.innerText = obj.title;

  const projectOptions = document.createElement("div");
  projectOptions.classList.add("project-options");
  projectOptions.innerText = "... E X"; //TEMPORARY

  projectTab.addEventListener("click", (event) => {
    let dataAtrribute;

    if (event.target == projectTitle) {
      dataAtrribute = event.target.parentNode.getAttribute("data-project");
    } else {
      dataAtrribute = event.target.getAttribute("data-project");
    }

    changeProject(Data[dataAtrribute]);
  });

  projectTab.append(projectTitle, projectOptions);
  projectList.insertBefore(projectTab, projectAddNode);
}

// - Factory: Initalize Project Obj
function createProject(title, dueDate, priority, color, tasks) {
  let taskObj = {};

  taskObj[tasks.title] = tasks;

  return {
    title,
    dueDate,
    priority,
    color,
    tasks: taskObj,
  };
}

// Appending Project Obj to data Obj
function appendProject(obj) {
  Data[obj.title] = obj;
}

// Uses Helper function to Inject project data and render dom
function newProject(title, dueDate, priority, color, tasks) {
  let project = createProject(title, dueDate, priority, color, tasks);
  appendProject(project);
}

// Render Project Data to DOM
function renderProjects() {
  for (project in Data) {
    addProjectTab(Data[project]);
  }
}

function changeProject(project) {
  activeProject = project;
  console.log(activeProject);

  document.querySelector(".header > .title").innerText = activeProject.title;

  wipeTaskView();
  renderProjectView(project);
}

function wipeTaskView() {
  while (taskView.childNodes.length > 1) {
    taskView.removeChild(taskView.firstChild);
  }
}

// --- TASK MANAGEMENT ---

// Factory: Initialize Task Obj
function createTaskObj(title, desc, dueDate, priority, notes) {
  return {
    title,
    desc,
    dueDate,
    priority,
    notes,
  };
}

//render DOM node for task
function renderTaskNode(task) {
  const taskNode = document.createElement("div");
  taskNode.classList.add("taskContainer");

  taskNode.innerText = task.title; //TEMPORARY

  // projectList.insertBefore(projectTab, projectAddNode);
  taskView.insertBefore(taskNode, taskView.firstChild);
}

// Create a task node for each task listed
function renderTasks(project) {
  for (task in project.tasks) {
    renderTaskNode(project.tasks[task]);
  }
}

// Append new Task
function appendTask(task) {
  activeProject.tasks[task.title] = task;
}

// Dont know what im doing with this yet
function renderProjectView(project) {
  activeProject = Data[project];
  renderTasks(project);
}

// Injecting Test Data
let testTask = createTaskObj("Task1", "This is test", "X", "X", "X");
let testTask2 = createTaskObj("Task2", "This is test", "X", "X", "X");
let testTask3 = createTaskObj("Task3", "This is test", "X", "X", "X");
newProject("Default", "tomorrow", "high", "#FF", testTask);
newProject("Its working!", "asdas", "hiaasdgh", "#FFFF", testTask);

renderProjects();

//set initial active Project
activeProject = Data["Default"];
console.log("Active Project:" + activeProject);
appendTask(testTask2);
appendTask(testTask3);

renderTasks(Data["Default"]);

// changeProject(Data["Its working!"]);

console.log(Data);
console.log(taskView.childNodes.length);
console.log(taskView.firstChild);

// TODO
// - Style Tasks Elemenets
// - Write funciton for title change to current project
// - Write Function to wipe existing tasks from DOM
// - Write function to handle populating Content on project Click
// - Write event handlers for project click
// - Create task Form view page (HTML and hide it)
// - Write function to hadle task form submissions to current active project
// - Add button to show add task window, to last bit of project
//
//

// <---------------------------------------------------->

// let testProject1 = {
//   title: "Made by Javan",
//   dueDate: "String",
//   priority: "String",
//   color: "String",
//   tasks: {
//     task1: {
//       title: "Task Title",
//       dueDate: "Task String",
//     },
//   },
// };
