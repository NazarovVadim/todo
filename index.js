'use script';

class Todo {
    constructor(form, input, todoList, todoCompleted){
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('ToDoList')));
    }

    addToStorage(){
        localStorage.setItem('ToDoList', JSON.stringify([...this.todoData]));
    }

    render(){
        this.todoList.innerHTML = '';
        this.todoCompleted.innerHTML = '';
        this.todoData.forEach(this.createItems, this);
        this.addToStorage();
    }

    createItems(todo){
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = todo.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${todo.value}</span>
            <div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>
        `);

        if(todo.completed) {
            this.todoCompleted.append(li);
        } else{
            this.todoList.append(li);
        }
    }

    addTodo(e){
        e.preventDefault();
        if(this.input.value.trim()){
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
            this.input.value = '';
        } else {
            alert('Невозможно ввести пустую строку!');
            this.input.value = '';
        }
    }

    generateKey(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    

    handler(e){
        let target = e.target;
        if(target.classList.contains('todo-remove')){
            this.deleteItem(target);
        } else if(target.classList.contains('todo-complete')){
            this.completedItem(target);
        }
    }

    deleteItem(target){
        const li = (target.parentNode).parentNode;    
        this.todoData.forEach(item => {
            if(item.value === li.textContent.trim()){
                this.todoData.delete(item.key);               
            }
        });
        this.render();
    }

    completedItem(target){
        const li = (target.parentNode).parentNode;
        this.todoData.forEach(item => {
            if(item.value === li.textContent.trim()){
                item.completed = (item.completed) ? false : true;
            }
        });
        this.render();
    }

    init(){
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.todoList.addEventListener('click', this.handler.bind(this));
        this.todoCompleted.addEventListener('click', this.handler.bind(this));
        this.render();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();