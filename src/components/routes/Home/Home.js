import React, { Component } from 'react';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import './Home.scss';

import notificationSound from '../../notif.ogg';
import bg from '../../../assets/images/bg.svg';
import Todo from '../../Todo';

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
        todos: [...savedTodos[key]]
      });
    }

    this.notificationSound = new Audio(notificationSound);
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
    this.saveTodos();
  };

  deleteAndSaveTodo = (index) => {
    const key = new Date().toDateString();

    const { savedTodos } = this.state;
    if (savedTodos[key]) {
      savedTodos[key].splice(index, 1);
    }
    this.saveTodos();
  }

  saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(this.state.savedTodos));
  };

  toggleDone = (index) => {
    const { todos } = this.state;

    if (!todos[index].done) {
      if (!this.notificationSound.paused) {
        this.notificationSound.pause();
        this.notificationSound.currentTime = 0;
      }
      this.notificationSound.play();
    }

    todos[index].done = !todos[index].done;
    this.saveTodos();
    this.setState({ todos });
  }

  deleteTodo = (index) => {
    const { todos } = this.state;
    todos.splice(index, 1);
    this.deleteAndSaveTodo(index);
    this.setState({ todos });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ todos }) => ({
      todos: arrayMove(todos, oldIndex, newIndex),
    }));
  };

  render() {
    const { todos, newTodoText } = this.state;

    return (
      <div className="home container">
        <div className="create-todo">
          <form id="form" onSubmit={this.addTodo}>
            <input id="newTodoText" type="text"
              name="newTodoText"
              placeholder="New Todo"
              onChange={this.onChange}
              value={newTodoText}
            />
            <input type="submit" value="Add" />
          </form>
        </div>

        <Todos
          todos={todos}
          onChange={this.toggleDone}
          deleteTodo={this.deleteTodo}
          onSortEnd={this.onSortEnd}
          lockAxis="y"
          pressDelay={500}
        />
        {/* <ul className="todos">
          {
            todos.map((todo, index) => (
              <Todo
                key={index}
                todo={todo}
                onChange={(e) => { this.toggleDone(index) }}
                deleteTodo={(e) => { this.deleteTodo(index) }} />
            ))
          }
        </ul> */}

        <div id="bg">
          <img src={bg} alt="bg" />
        </div>
      </div >
    );
  }
}

const TodoItem = SortableElement(({ todo, index, onChange, deleteTodo }) => (
  <Todo
    key={index}
    todo={todo}
    onChange={onChange}
    deleteTodo={deleteTodo} />
));

const Todos = SortableContainer(({ todos, onChange, deleteTodo }) => (
  <ul className="todos">
    {
      todos.map((todo, index) => (
        <TodoItem
          index={index}
          todo={todo}
          onChange={() => { onChange(index) }}
          deleteTodo={() => { deleteTodo(index) }} />
      ))
    }
  </ul>
));
