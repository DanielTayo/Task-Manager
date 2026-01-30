const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const searchBar = document.getElementById('searchBar');

let tasks = [];

const savedData = localStorage.getItem('myTasks');
if (savedData !== null) {
    tasks = JSON.parse(savedData);
    render(tasks);
}

taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    
    saveAndRefresh();
});

function saveAndRefresh() {
    const stringData = JSON.stringify(tasks);
    localStorage.setItem('myTasks', stringData);
    render(tasks);
}

function render(list) {
    taskList.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        
        const li = document.createElement('li');
        li.className = 'task-item';
        
        if (item.completed === true) {
            li.classList.add('done');
        }

        let isChecked = '';
        if (item.completed === true) {
            isChecked = 'checked';
        }

        li.innerHTML = `
            <div>
                <input type="checkbox" ${isChecked} onclick="toggleTask(${item.id})">
                <span>${item.text}</span>
            </div>
            <button class="delete-btn" onclick="deleteTask(${item.id})">Delete</button>
        `;
        
        taskList.appendChild(li);
    }
}

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            if (tasks[i].completed === true) {
                tasks[i].completed = false;
            } else {
                tasks[i].completed = true;
            }
        }
    }
    saveAndRefresh();
}

function deleteTask(id) {
    let result = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            result.push(tasks[i]);
        }
    }
    tasks = result;
    saveAndRefresh();
}

searchBar.addEventListener('input', function() {
    const userInput = searchBar.value.toLowerCase();
    let filteredList = [];
    
    for (let i = 0; i < tasks.length; i++) {
        const taskText = tasks[i].text.toLowerCase();
        if (taskText.includes(userInput)) {
            filteredList.push(tasks[i]);
        }
    }
    
    render(filteredList);
});

function filterTasks(status) {
    if (status === 'all') {
        render(tasks);
    } else if (status === 'active') {
        let activeTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed === false) {
                activeTasks.push(tasks[i]);
            }
        }
        render(activeTasks);
    } else if (status === 'completed') {
        let completedTasks = [];
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].completed === true) {
                completedTasks.push(tasks[i]);
            }
        }
        render(completedTasks);
    }
}