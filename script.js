let score = 0;
let draggingTask = null;

// adicionar tarefa ao pressionar ENTER
document.getElementById('taskInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

// adicionar tarefa
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const li = document.createElement('li');
        li.setAttribute('draggable', true);

        // checkbox para marcar como concluída
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkbox');
        checkbox.addEventListener('change', function () {
            if (checkbox.checked) {
                li.classList.add('completed');
                updateScore(10);
            } else {
                li.classList.remove('completed');
                updateScore(-10);
            }
        });

        const taskSpan = document.createElement('span');
        taskSpan.textContent = taskText;

        // clique duplo para editar
        taskSpan.addEventListener('dblclick', function () {
            const newText = prompt('Edite a tarefa:', taskSpan.textContent);
            if (newText) {
                taskSpan.textContent = newText;
            }
        });

        // botão para excluir
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            li.remove();
            if (checkbox.checked) {
                updateScore(-10);
            }
        });

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        document.getElementById('taskList').appendChild(li);
        taskInput.value = '';

        // Configurar eventos de drag-and-drop
        li.addEventListener('dragstart', function () {
            draggingTask = li;
            li.classList.add('dragging');
        });
        li.addEventListener('dragend', function () {
            draggingTask = null;
            li.classList.remove('dragging');
        });
    }
}

// reordenar tarefas
const taskList = document.getElementById('taskList');
taskList.addEventListener('dragover', function (e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(draggingTask);
    } else {
        taskList.insertBefore(draggingTask, afterElement);
    }
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// atualizar pontuação
function updateScore(points) {
    score += points;
    document.getElementById('scoreDisplay').textContent = `Pontuação: ${score}`;
    if (score >= 100) {
        document.getElementById('celebration').classList.remove('hidden');
    } else {
        document.getElementById('celebration').classList.add('hidden');
    }
}

// alternar tema
document.getElementById('toggleTheme').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
});

// inicializar com tema claro
document.body.classList.add('light-mode');
