document.addEventListener('DOMContentLoaded', loadTasks);

const form = document.getElementById('task-form');
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');
const categoryInput = document.getElementById('category');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');


form.addEventListener('submit', function (e) {
  e.preventDefault();
  const task = taskInput.value.trim();
  const date = dateInput.value;
  const category = categoryInput.value;
  const priority = priorityInput.value;

  if (task && date && category && priority) {
    const taskItem = {
      id: Date.now(),
      text: task,
      date: date,
      category: category,
      priority: priority,
    };

    saveTask(taskItem);
    addTaskToDOM(taskItem);
    scheduleNotification(taskItem); // ✅ Schedule reminder
    form.reset();
  }
});


function saveTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function loadTasks() {
  const tasks = getTasks();
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.setAttribute('data-id', task.id);
  li.setAttribute('data-priority', task.priority);
  li.innerHTML = `
    <strong>${task.text}</strong> 
    <br><small>${task.date} | ${task.category} | Priority: ${task.priority}</small>
    <span class="delete" onclick="deleteTask(${task.id})">✖</span>
  `;
  taskList.appendChild(li);
}

function deleteTask(id) {
  const tasks = getTasks().filter(task => task.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  document.querySelector(`li[data-id="${id}"]`).remove();
}
function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("Notifications enabled!");
      }
    });
  }
}

// Schedule a notification (for demo: 5 seconds later)
function scheduleNotification(task) {
  if (Notification.permission === "granted") {
    const delay = 5000; // Change to your deadline logic
    setTimeout(() => {
      new Notification("📌 Reminder: " + task.text, {
        body: `Due on ${task.date}`,
        icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png",
      });
    }, delay);
  }
}
