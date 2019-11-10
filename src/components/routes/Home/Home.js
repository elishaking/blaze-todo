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

    const newTodo = {
      text: newTodoText,
      done: true,
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

  render() {
    const { todos } = this.state;

    return (
      <div className="home container">
        <div className="create-todo">
          <form onSubmit={this.addTodo}>
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
