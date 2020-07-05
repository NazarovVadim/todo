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
            <button class="todo-edit"></button>
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
        li.addEventListener('click', this.anim);
    }

    async anim(e){
        let target = e.target;
        if(target.classList.contains('todo-remove')){
            this.style.opacity = 0;
        } else if(target.classList.contains('todo-complete')){
            this.style.opacity = 0;
            setTimeout(() => {this.style.opacity = 1;}, 500)
        }
    }

    addTodo(e){
        e.preventDefault();
        let copyTodo;
        this.todoData.forEach(item => {
            if(item.value === this.input.value.trim()){
                copyTodo = true;
            } 
        });
        if(!copyTodo){
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
        } else{
            this.input.value = '';
            alert('Это дело уже существует!');
        }
    }

    generateKey(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    handler(e){
        let target = e.target;
        if(target.classList.contains('todo-remove')){
            setTimeout(() => {this.deleteItem(target);}, 300);
        } else if(target.classList.contains('todo-complete')){
            setTimeout(() => {this.completedItem(target);}, 300)
        } else if(target.classList.contains('todo-edit')){
            this.edit(target);
        }
    }

    edit(target){
        const li = target.parentNode,
            span = li.querySelector('span');
        let form = `
                <form>
                    <input></input>
                </form>
            `;
        span.style.display = 'none';
        li.insertAdjacentHTML('afterbegin', form);
        form = li.querySelector('form');
        let input = form.querySelector('input');
        input.value = span.textContent;
        form.addEventListener('submit', event => {
            event.preventDefault();
            if(input.value.trim()){
                this.todoData.forEach(item => {if(item.value === span.textContent) item.value = input.value});
                span.textContent = input.value;
                form.remove();
                span.style.display = 'inline-block';
                this.render();
            }
        });
        
    }

    deleteItem(target){
        const li = (target.parentNode).parentNode;    
        this.todoData.forEach(item => {
            if(item.value === li.textContent.trim())
                this.todoData.delete(item.key);
        });
        this.render();
    }

    completedItem(target){
        const li = (target.parentNode).parentNode;
        this.todoData.forEach(item => {
            if(item.value === li.textContent.trim())
                item.completed = (item.completed) ? false : true;
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