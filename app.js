let list = document.querySelector('ul.list');
let btnAdd = document.getElementById('btnAdd');
let listTask = [
    {
        content: 'content-task 1',
        status: 'doing'
    }, 
    {
        content: 'content-task 2',
        status: 'complete'
    }
];

if(localStorage.getItem('listTask') != null) {
    listTask = JSON.parse(localStorage.getItem('listTask'));
}

function saveLocalStorage() {
    localStorage.setItem('listTask', JSON.stringify(listTask));
}

btnAdd.onclick = (e) => {
    e.preventDefault();
    let content = document.getElementById('task');
    if(content.value.trim() != '') {
        let newTask = {
            content: content.value,
            status: 'doing'
        };
        listTask.push(newTask);
        addTaskToHTML(newTask, listTask.length - 1);
    }
    document.getElementById('task').value = '';
    saveLocalStorage();
}

function addTaskToHTML(task = null, index = null) {
    if (task !== null && index !== null) {
        let newTask = document.createElement('li');
        newTask.setAttribute('draggable', 'true');
        newTask.classList.add(task.status);
        newTask.classList.add('new');
        newTask.innerHTML = `
        <div class="complete-icon" data-index="${index}">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>  
        </div>
        <div class="content">${task.content}</div>
        <div class="close-icon" data-index="${index}">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        </div>
        `
        ;/*
        newTask.addEventListener('dragstart', (e) => {
            e.target.classList.add('dragging');
        });
        newTask.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });*/
            
        list.appendChild(newTask);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newTask.classList.remove('new');
            });
        });
    } else {
        list.innerHTML = '';
        listTask.forEach((task, index) => {
            addTaskToHTML(task, index);
        });
    }
}

function completeTask(index) {
    listTask[index].status = (listTask[index].status === 'doing' ? 'complete' : 'doing');
    saveLocalStorage();
    // Update only the specific task element
    let taskElement = document.querySelectorAll('.list li')[index];
    if (taskElement) {
        taskElement.classList.toggle('complete', listTask[index].status === 'complete');
    }
}

function deleteTask(index) {
    let taskElement = document.querySelectorAll('.list li')[index];
    listTask.splice(index, 1); // Correct way to remove an item by index
    if(taskElement) {
        taskElement.classList.add('remove');
        setTimeout(() => {
            taskElement.remove();
            saveLocalStorage();
            // Update indices in DOM for remaining tasks
            updateTaskIndices();
        }, 200);
    }
}

function updateTaskIndices() {
    document.querySelectorAll('.list li').forEach((taskElement, index) => {
        taskElement.querySelector('.complete-icon').dataset.index = index;
        taskElement.querySelector('.close-icon').dataset.index = index;
    });
}

list.addEventListener('click', (e) => {
    if (e.target.closest('.complete-icon')) {
        let index = e.target.closest('.complete-icon').dataset.index;
        completeTask(index);
    } else if (e.target.closest('.close-icon')) {
        let index = e.target.closest('.close-icon').dataset.index;
        deleteTask(index);
    }
});

addTaskToHTML();
