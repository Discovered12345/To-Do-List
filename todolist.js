let todoList = [];
let inputField;
let addButton;
let saveButton;
let clearButton;
let taskContainer;
let draggedItem = null;

function setup() {
  createCanvas(400, 600);
  
  loadTasks();
  
  inputField = createInput();
  inputField.position(20, 20);
  inputField.size(300);
  inputField.attribute('placeholder', 'Add a new task...');
      
  addButton = createButton('Add');
  addButton.position(330, 20);
  addButton.mousePressed(addTask);
  
  saveButton = createButton('Save');
  saveButton.position(20, 560);
  saveButton.mousePressed(saveTasks);
  
  clearButton = createButton('Clear All');
  clearButton.position(100, 560);
  clearButton.mousePressed(clearAllTasks);
  
  taskContainer = createDiv();
  taskContainer.position(20, 60);
  taskContainer.size(360, 490);
  taskContainer.style('overflow-y', 'auto');
  taskContainer.style('background', '#f5f5f5');
  taskContainer.style('border-radius', '5px');
  taskContainer.style('padding', '10px');
}

function draw() {
  background(240);
  

  fill(0);
  textSize(24);
  text('To-Do List', 20, 15);

  textSize(14);
  let completedCount = todoList.filter(task => task.completed).length;
  text(`Tasks: ${completedCount}/${todoList.length} completed`, 20, 540);
  
  renderTasks();
}

function addTask() {
  let taskText = inputField.value().trim();
  if (taskText !== '') {
    todoList.push({
      text: taskText,
      completed: false,
      id: Date.now() // Unique ID for each task
    });
    inputField.value('');
    renderTasks();
  }
}

function renderTasks() {
  taskContainer.html(''); 
  
  if (todoList.length === 0) {
    taskContainer.html('<p style="color:#888; text-align:center;">No tasks yet. Add some!</p>');
    return;
  }
  
  for (let i = 0; i < todoList.length; i++) {
    let task = todoList[i];
    
    let taskDiv = createDiv();
    taskDiv.class('task');
    taskDiv.style('background', task.completed ? '#e0f7fa' : '#fff');
    taskDiv.style('padding', '10px');
    taskDiv.style('margin-bottom', '8px');
    taskDiv.style('border-radius', '4px');
    taskDiv.style('border-left', `4px solid ${task.completed ? '#4caf50' : '#2196f3'}`);
    taskDiv.style('display', 'flex');
    taskDiv.style('align-items', 'center');
    taskDiv.style('cursor', 'pointer');
    taskDiv.attribute('draggable', 'true');
    taskDiv.attribute('data-id', task.id);
    
    taskDiv.dragStarted(() => {
      draggedItem = taskDiv;
      taskDiv.style('opacity', '0.5');
    });
    
    taskDiv.dragEnded(() => {
      taskDiv.style('opacity', '1');
      draggedItem = null;
    });
    
    taskDiv.dragOver(() => {
      if (draggedItem && draggedItem !== taskDiv) {
        swapTasks(draggedItem.attribute('data-id'), task.id);
      }
    });
    
    let checkbox = createCheckbox('', task.completed);
    checkbox.changed(() => toggleTaskComplete(task.id));
    checkbox.style('margin-right', '10px');
    checkbox.parent(taskDiv);
    
    let textSpan = createSpan(task.text);
    if (task.completed) {
      textSpan.style('text-decoration', 'line-through');
      textSpan.style('color', '#777');
    }
    textSpan.parent(taskDiv);
    
    let deleteBtn = createButton('×');
    deleteBtn.mousePressed(() => deleteTask(task.id));
    deleteBtn.style('margin-left', 'auto');
    deleteBtn.style('background', 'none');
    deleteBtn.style('border', 'none');
    deleteBtn.style('color', '#f44336');
    deleteBtn.style('font-size', '18px');
    deleteBtn.style('cursor', 'pointer');
    deleteBtn.parent(taskDiv);
    
    taskDiv.parent(taskContainer);
  }
}

function toggleTaskComplete(id) {
  let task = todoList.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    renderTasks();
  }
}

function deleteTask(id) {
  todoList = todoList.filter(task => task.id !== id);
  renderTasks();
}

function swapTasks(id1, id2) {
  let index1 = todoList.findIndex(task => task.id === id1);
  let index2 = todoList.findIndex(task => task.id === id2);
  
  if (index1 !== -1 && index2 !== -1) {
    [todoList[index1], todoList[index2]] = [todoList[index2], todoList[index1]];
    renderTasks();
  }
}

function saveTasks() {
  localStorage.setItem('p5TodoList', JSON.stringify(todoList));
  console.log('Tasks saved to localStorage');
}

function loadTasks() {
  let savedTasks = localStorage.getItem('p5TodoList');
  if (savedTasks) {
    todoList = JSON.parse(savedTasks);
    console.log('Tasks loaded from localStorage');
  }
}

function clearAllTasks() {
  if (confirm('Are you sure you want to clear all tasks?')) {
    todoList = [];
    renderTasks();
    localStorage.removeItem('p5TodoList');
  }
}

p5.Element.prototype.dragStarted = function(callback) {
  this.elt.addEventListener('dragstart', callback);
  return this;
};

p5.Element.prototype.dragEnded = function(callback) {
  this.elt.addEventListener('dragend', callback);
  return this;
};

p5.Element.prototype.dragOver = function(callback) {
  this.elt.addEventListener('dragover', (e) => {
    e.preventDefault();
    callback();
  });
  return this;
};
