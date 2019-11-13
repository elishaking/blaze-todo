import React, { Component } from 'react';
import './Home.scss';

import bg from '../../../assets/images/bg.svg';

export default class Home extends Component {
  state = {
    newTodoText: '',
    todos: [],
    savedTodos: {}
  };

  componentDidMount() {
    const savedTodosStr = localStorage.getItem('todos');
    if (!savedTodosStr) return;

    const savedTodos = JSON.parse(savedTodosStr);
    const key = new Date().toDateString();
    if (savedTodos && savedTodos[key]) {
      this.setState({
        savedTodos: savedTodos,
        todos: savedTodos[key]
      });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addTodo = (e) => {
    e.preventDefault();

    const { newTodoText, savedTodos, todos } = this.state;

    if (newTodoText === '') return;

    const newTodo = {
      text: newTodoText,
      done: false,
      // show: false,
      date: Date.now()
    };

    this.saveTodo(newTodo);

    todos.push(newTodo);

    this.setState({
      todos,
      savedTodos,
      newTodoText: ''
    });
  };

  saveTodo = (todo) => {
    const key = new Date().toDateString();

    const { savedTodos } = this.state;
    if (savedTodos[key]) {
      savedTodos[key].push(todo);
    } else {
      savedTodos[key] = [todo];
    }
    localStorage.setItem("todos", JSON.stringify(savedTodos));
  };

  toggleDone = (index) => {
    const { todos } = this.state;

    todos[index].done = !todos[index].done;
    this.setState({ todos });
  }

  deleteTodo = (index) => {
    const { todos } = this.state;
    todos.splice(index, 1);
    this.setState({ todos });
  };

  render() {
    const { todos } = this.state;

    return (
      <div className="home container">
        <div className="create-todo">
          <form id="form" onSubmit={this.addTodo}>
            <input id="newTodoText" type="text"
              name="newTodoText"
              placeholder="New Todo"
              onChange={this.onChange}
            />
            <input type="submit" value="Add" />
          </form>
        </div>

        <div className="todos">
          {
            todos.map((_, index, mTodos) => {
              const todo = mTodos[(mTodos.length - 1) - index];
              return (
                <div key={index} id={`todo-${index}`} className={`todo ${todo.show ? "show" : ""}`}>
                  <div>
                    <input type="checkbox"
                      checked={todo.done}
                      onChange={(e) => { this.toggleDone(index) }} />

                    <p>{todo.text}</p>

                    <p className="close" onClick={(e) => { this.deleteTodo(index) }}>x</p>
                  </div>
                  <small>{new Date(todo.date).toLocaleTimeString()}</small>
                </div>
              );
            })
          }
        </div>

        <div id="bg">
          <img src={bg} alt="bg" />
        </div>
      </div>
    );
  }
}
