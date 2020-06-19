'use strict';

const todoControl = document.querySelector('.todo-control'),
    headerInput = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed');

const todoData = JSON.parse(localStorage.getItem('todoData')) || [];

const render = function(){
    todoList.textContent = '';
    todoCompleted.textContent = '';

    todoData.forEach(function(item){
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.innerHTML = `
            <span class="text-todo">${item.value}</span>
            <div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>
        `;

        if(item.completed){
            todoCompleted.append(li);
            localStorage.setItem('todoData', JSON.stringify(todoData));
        } else{
            todoList.append(li);
            localStorage.setItem('todoData', JSON.stringify(todoData));
        }

        const todoComplete = li.querySelector('.todo-complete');
        todoComplete.addEventListener('click', function(){
            item.completed = !item.completed;
            render();
        });

        const todoRemove = li.querySelector('.todo-remove'),
            textTodo = li.querySelector('.text-todo');
        
        todoRemove.addEventListener('click', function(){
            todoData.forEach(function(item){
                if(textTodo.textContent === item.value){
                    todoData.splice(todoData.indexOf(item), 1);
                }
            });

            render();
        });
        localStorage.setItem('todoData', JSON.stringify(todoData));
    });
};

todoControl.addEventListener('submit', function(e){
    e.preventDefault();

    if(headerInput.value.trim() !== ''){
        const newTodo = {
            value: headerInput.value,
            completed: false
        };
        
        todoData.push(newTodo);
        localStorage.setItem('todoData', JSON.stringify(todoData));
    
        render();
    
        headerInput.value = '';
    }
});

render();