// eslint-disable-next-line strict
'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted,) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
  }

  toLeftAnimation(target) {
    const li = target.closest('.todo-item');
    let timer;
    const startTime = Date.now();
    const _this = this;

    function move(passedTime) {
      li.style.left = '-' + (passedTime * 0.5 + '%');
    }

    function animation() {
      timer = requestAnimationFrame(animation);
      const passedTime = Date.now() - startTime;

      if (passedTime >= 200) {
        cancelAnimationFrame(timer);
        _this.render();
        return target;
      }
      move(passedTime);
    }

    timer = requestAnimationFrame(animation);
  }

  toRightAnimation(target) {
    const li = target.closest('.todo-item');
    let timer;
    const startTime = Date.now();
    const _this = this;
    console.log(_this);
    li.style.left = '-100%';
    function move(passedTime) {
      // console.log(parseInt(li.style.left));
      console.log(passedTime);
      li.style.left = -100 + (0.05 * passedTime) + '%';
    }

    function animation() {
      timer = requestAnimationFrame(animation);
      const passedTime = Date.now() - startTime;

      if (passedTime >= 2000) {
        cancelAnimationFrame(timer);
        li.style.left = '0';
        return;
      }

      move(passedTime);
    }

    timer = requestAnimationFrame(animation);
  }

  handler(evt) {
    const target = evt.target;
    if (!target.matches('.todo-edit, .todo-remove, .todo-complete')) return;
    if (target.matches('.todo-complete')) this.completeItem(target);
    else if (target.matches('.todo-remove')) this.deleteItem(target);
    else this.editItem(target);
  }


  deleteItem(target) {
    const key = target.closest('.todo-item').key;
    this.todoData.delete(key);
    this.toLeftAnimation(target);
  }

  completeItem(target) {
    const key = target.closest('.todo-item').key;
    const item = this.todoData.get(key);
    item.completed = !item.completed;
    this.toLeftAnimation(target);
  }

  editItem(target) {
    const li = target.closest('.todo-item');
    const key = li.key;
    const item = this.todoData.get(key);
    const text = li.querySelector('span').textContent;

    li.innerHTML = `
      <input class="todo-input" value="${text}"></input>
      <div class="todo-buttons">
        <button class="save">save</button>
      </div>
    `;

    const saveBtn = li.querySelector('.save');
    const input = li.querySelector('.todo-input');
    saveBtn.style.border = 'solid 3px black';
    saveBtn.style.borderRadius = '50%';

    function save() {
      item.value = input.value;
      this.render();
      saveBtn.removeEventListener('click', save);
    }

    saveBtn.addEventListener('click', save.bind(this));
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoCompleted.textContent = '';
    this.todoList.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(item) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = item.key;
    li.insertAdjacentHTML('beforeend', `
      <span class="text-todo">${item.value}</span>
      <div class="todo-buttons">
        <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);
    if (!item.completed) this.todoList.append(li);
    else this.todoCompleted.append(li);
  }

  addTodo(evt) {
    evt.preventDefault();
    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey()
      };
      this.todoData.set(newTodo.key, newTodo);
      this.input.value = '';
      this.render();
    }
  }

  generateKey() {
    let key;
    do {
      key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    } while (this.todoData.has(key));
    return key;
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.todoList.addEventListener('click', this.handler.bind(this));
    this.todoCompleted.addEventListener('click', this.handler.bind(this));

    // не стал добавлять 1 слушатель на .todo-сontainer, чтобы не создавать эту переменную
    this.render();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');
todo.init();
