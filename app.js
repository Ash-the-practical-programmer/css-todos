let list = document.querySelector('ul.list');
let btnAdd = document.getElementById('btnAdd');
let btnUndo = document.getElementById('btnUndo');
let btnRedo = document.getElementById('btnRedo');

let listTask = localStorage.getItem('listTask') ? JSON.parse(localStorage.getItem('listTask')) : [];
let undoStack = [];
let redoStack = [];
let completedTasksPercentage = 0;

function updateBottomVisibility() {
    const bottom = document.getElementById('bottom');
    if (listTask.length > 0) {
        bottom.style.display = 'flex';
        bottom.style.flexDirection = 'row';
    } else {
        bottom.style.display = 'none';
    }
}

function updateCompletedTasksPercentage() {
    const totalTasks = listTask.length;
    if(totalTasks) document.getElementById('bottom').style.display = "block";
    const completedTasks = listTask.filter(task => task.status === 'complete').length;
    completedTasksPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
   // document.getElementById('percent').innerText = `${completedTasksPercentage}%`;
   const percentElement = document.getElementById('percent');
    percentElement.classList.add('updating');

    setTimeout(() => {
        percentElement.setAttribute('data-percentage', completedTasksPercentage);
        percentElement.classList.remove('updating');
    }, 250);
}

function saveLocalStorage() {
    localStorage.setItem('listTask', JSON.stringify(listTask));
}

function saveStateForUndo() {
    undoStack.push(JSON.stringify(listTask));
    redoStack = []; // Clear redo stack after a new action
}

btnAdd.onclick = (e) => {
    e.preventDefault();
    let content = document.getElementById('task');
    if (content.value.trim() !== '') {
        saveStateForUndo();
        let newTask = {
            content: content.value,
            status: 'doing'
        };
        listTask.push(newTask);
        addTaskToHTML(newTask, listTask.length - 1);
        content.value = '';
        saveLocalStorage();
    }
};

btnUndo.onclick = () => {
    if (undoStack.length > 0) {
        redoStack.push(JSON.stringify(listTask));
        listTask = JSON.parse(undoStack.pop());
        addTaskToHTML();
        saveLocalStorage();
    }
};

btnRedo.onclick = () => {
    if (redoStack.length > 0) {
        undoStack.push(JSON.stringify(listTask));
        listTask = JSON.parse(redoStack.pop());
        addTaskToHTML();
        saveLocalStorage();
    }
};

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
        `;
        newTask.addEventListener('dragstart', dragStart);
        newTask.addEventListener('dragend', dragEnd);
        list.appendChild(newTask);
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newTask.classList.remove('new');
            });
        });
    } else {
        list.innerHTML = '';
        listTask.forEach((task, index) => {
            let newTask = document.createElement('li');
            newTask.setAttribute('draggable', 'true');
            newTask.classList.add(task.status);
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
            `;
            newTask.addEventListener('dragstart', dragStart);
            newTask.addEventListener('dragend', dragEnd);
            list.appendChild(newTask);
        });
    }
    updateTaskIndices();
    updateCompletedTasksPercentage();
    updateBottomVisibility();
}

function completeTask(index) {
    saveStateForUndo();
    listTask[index].status = (listTask[index].status === 'doing' ? 'complete' : 'doing');
    saveLocalStorage();
    let taskElement = document.querySelectorAll('.list li')[index];
    if (taskElement) {
        taskElement.classList.toggle('complete', listTask[index].status === 'complete');
    }
    updateCompletedTasksPercentage();
}

function deleteTask(index) {
    saveStateForUndo();
    let taskElement = document.querySelectorAll('.list li')[index];
    listTask.splice(index, 1);
    if (taskElement) {
        taskElement.classList.add('remove');
        setTimeout(() => {
            taskElement.remove();
            saveLocalStorage();
            updateTaskIndices();
        }, 200);
    }
    updateCompletedTasksPercentage();
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

function dragStart(e) {
    e.dataTransfer.setData('text/plain', null);
    e.currentTarget.classList.add('dragging');
}

function dragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    updateTaskIndices();
    saveLocalStorage();
}

addTaskToHTML();
updateCompletedTasksPercentage();

list.addEventListener('dragover', dragOver);
list.addEventListener('drop', drop);

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggable = document.querySelector('.dragging');
    const target = e.target.closest('li');
    if (target && draggable !== target) {
        const nextSibling = getNextSiblingAfterDrop(target, e.clientY);
        list.insertBefore(draggable, nextSibling);
        updateListTaskOrder();
    }
}

function updateListTaskOrder() {
    const items = list.querySelectorAll('li');
    const newListTask = Array.from(items).map((item, index) => {
        const content = item.querySelector('.content').textContent;
        const status = item.classList.contains('complete') ? 'complete' : 'doing';
        return { content, status };
    });
    listTask = newListTask;
    saveLocalStorage();
}

function getNextSiblingAfterDrop(target, clientY) {
    const siblings = [...list.querySelectorAll('li:not(.dragging)')];
    const nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return clientY <= rect.top + rect.height / 2;
    });
    return nextSibling ? nextSibling : null;
}
