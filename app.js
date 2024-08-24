function addTaskToHTML(task = null, index = null) {
    if (task !== null && index !== null) {
        let newTask = document.createElement('li');
        newTask.setAttribute('draggable', 'true');
        newTask.classList.add(task.status);
        newTask.classList.add('new');

        // Check if the content starts with 'https://'
        let contentHTML = '';
        if (task.content.startsWith('https://')) {
            contentHTML = `<a href="${task.content}" target="_blank">${task.content}</a>`;
        } else {
            contentHTML = task.content;
        }

        newTask.innerHTML = `
        <div class="complete-icon" data-index="${index}">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
            </svg>  
        </div>
        <div class="content">${contentHTML}</div>
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

            // Check if the content starts with 'https://'
            let contentHTML = '';
            if (task.content.startsWith('https://')) {
                contentHTML = `<a href="${task.content}" target="_blank">${task.content}</a>`;
            } else {
                contentHTML = task.content;
            }

            newTask.innerHTML = `
            <div class="complete-icon" data-index="${index}">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.5 11.5 11 14l4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>  
            </div>
            <div class="content">${contentHTML}</div>
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
}
