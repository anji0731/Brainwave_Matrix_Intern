// DOM Elements
const currentDateElement = document.getElementById('current-date');
const currentTimeElement = document.getElementById('current-time');
const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task-btn');
const tasksList = document.getElementById('tasks-list');
const emptyState = document.getElementById('empty-state');

// Task data structure
let tasks = JSON.parse(localStorage.getItem('dayPlannerTasks')) || [];

// Update date and time
function updateDateTime() {
  const now = new Date();
  
  // Format date: Weekday, Month Day, Year
  const dateOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  currentDateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
  
  // Format time: HH:MM:SS AM/PM
  const timeOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  currentTimeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
}

// Initialize clock
updateDateTime();
setInterval(updateDateTime, 1000);

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem('dayPlannerTasks', JSON.stringify(tasks));
}

// Toggle empty state visibility
function toggleEmptyState() {
  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    tasksList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    tasksList.style.display = 'flex';
  }
}

// Add a new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText === '') return;
  
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const task = {
    id: Date.now().toString(),
    text: taskText,
    time: `${hours}:${minutes}`,
    completed: false
  };
  
  tasks.push(task);
  newTaskInput.value = '';
  
  renderTasks();
  saveTasks();
}

// Delete a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
  saveTasks();
}

// Toggle task completion
function toggleTaskCompletion(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
  saveTasks();
}

// Start editing a task
function startEditingTask(id) {
  const taskElement = document.getElementById(`task-${id}`);
  const task = tasks.find(t => t.id === id);
  
  if (!taskElement || !task) return;
  
  const textContainer = taskElement.querySelector('.task-text-container');
  const actionsContainer = taskElement.querySelector('.task-actions');
  
  // Create edit input
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'task-edit-input';
  editInput.value = task.text;
  editInput.dataset.taskId = id;
  
  // Replace text with input
  textContainer.innerHTML = '';
  textContainer.appendChild(editInput);
  
  // Update actions
  actionsContainer.innerHTML = `
    <button class="task-save-btn" onclick="saveEditedTask('${id}')">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
    </button>
  `;
  
  // Focus input
  editInput.focus();
  
  // Add enter key listener
  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveEditedTask(id);
    }
  });
}

// Save edited task
function saveEditedTask(id) {
  const taskElement = document.getElementById(`task-${id}`);
  const editInput = taskElement.querySelector('.task-edit-input');
  
  if (!editInput) return;
  
  const newText = editInput.value.trim();
  if (newText === '') return;
  
  tasks = tasks.map(task => 
    task.id === id ? { ...task, text: newText } : task
  );
  
  renderTasks();
  saveTasks();
}

// Render all tasks
function renderTasks() {
  toggleEmptyState();
  
  tasksList.innerHTML = '';
  
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.id = `task-${task.id}`;
    
    li.innerHTML = `
      <div class="task-content">
        <div class="task-left">
          <button class="task-checkbox" onclick="toggleTaskCompletion('${task.id}')">
            ${task.completed ? 
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><path d="m9 12 2 2 4-4"></path></svg>' : 
              '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect></svg>'
            }
          </button>
          
          <div class="task-text-container">
            <p class="task-text ${task.completed ? 'completed' : ''}">${task.text}</p>
            <p class="task-time">Added at ${task.time}</p>
          </div>
        </div>
        
        <div class="task-actions">
          <button class="task-edit-btn" onclick="startEditingTask('${task.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
          </button>
          <button class="task-delete-btn" onclick="deleteTask('${task.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
          </button>
        </div>
      </div>
    `;
    
    tasksList.appendChild(li);
  });
}

// Event Listeners
addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initialize
renderTasks();

// Make functions available globally
window.deleteTask = deleteTask;
window.toggleTaskCompletion = toggleTaskCompletion;
window.startEditingTask = startEditingTask;
window.saveEditedTask = saveEditedTask;