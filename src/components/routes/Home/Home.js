import React, { Component } from 'react';
import './Home.scss';

export default class Home extends Component {
  state = {
    newTodoText: '',
    todos: []
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  addTodo = (e) => {
    e.preventDefault();

    const { newTodoText, todos } = this.state;

    if (newTodoText === '') return;

    const newTodo = {
      text: newTodoText,
      done: false,
      date: Date.now()
    };

    this.setState({
      todos: [
        newTodo,
        ...todos
      ],
      newTodoText: ''
    }, () => document.getElementById('newTodoText').value = "");
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
            todos.map((todo, index) => (
              <div key={index} className="todo">
                <div>
                  <input type="checkbox"
                    checked={todo.done}
                    onChange={(e) => { this.toggleDone(index) }} />

                  <p>{todo.text}</p>

                  <p className="close" onClick={(e) => { this.deleteTodo(index) }}>x</p>
                </div>
                <small>{new Date(todo.date).toLocaleTimeString()}</small>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
