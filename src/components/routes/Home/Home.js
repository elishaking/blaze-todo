import React, { Component } from 'react';
import { SortableElement, SortableContainer } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import './Home.scss';

// @ts-ignore
import notificationSound from '../../notif.ogg';
import bg from '../../../assets/images/bg.svg';
import Todo from '../../Todo';

export default class Home extends Component {
  state = {
    newTodoText: '',
    todos: [],
    savedTodos: {},
    olderTodos: []
  };

  componentDidMount() {
    const savedTodosStr = localStorage.getItem('todos');
    if (!savedTodosStr) return;

    const savedTodos = JSON.parse(savedTodosStr);

    const key = new Date().toDateString();
    const todos = savedTodos[key];
    const olderTodos = this.loadOlderTodos(savedTodos, key);

    if (savedTodos) {
      if (todos) {
        this.setState({
          savedTodos: savedTodos,
          todos
        });
      } else if (olderTodos) {
        this.setState({
          savedTodos: savedTodos,
          olderTodos
        });
      }
    }

    this.notificationSound = new Audio(notificationSound);
  }

  loadOlderTodos = (savedTodos, key) => {
    const todoKeys = Object.keys(savedTodos).filter(todoKey => todoKey !== key);

    const olderTodos = todoKeys.map((todoKey) => ({
      [todoKey]: savedTodos[todoKey]
    }));

    return olderTodos;
  };

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

  toggleDone = (index, dateKey, todosIdx) => {
    let todos, stateKey;
    if (dateKey) {
      todos = this.state.olderTodos[todosIdx][dateKey];
      console.log(this.state.olderTodos);
      stateKey = "olderTodos";
    } else {
      todos = this.state.todos;
      stateKey = "todos";
    }

    // const { todos } = this.state;

    if (!todos[index].done) {
      if (!this.notificationSound.paused) {
        this.notificationSound.pause();
        this.notificationSound.currentTime = 0;
      }
      this.notificationSound.play();
    }

    todos[index].done = !todos[index].done;
    this.saveTodos();
    this.setState({ [stateKey]: todos });
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
    const { todos, newTodoText, olderTodos } = this.state;

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

        <div>
          <h3>OLDER TODOS</h3>

          <ul className="todos">
            {
              olderTodos.map((todoGroups, idx) => {
                const key = Object.keys(todoGroups)[0];
                const todos = todoGroups[key];
                return (
                  <div>
                    <h4>{key}</h4>
                    <Todos
                      dateKey={key}
                      todosIdx={idx}
                      todos={todos}
                      onChange={this.toggleDone}
                      deleteTodo={this.deleteTodo}
                      shouldCancelStart={() => true}
                    // onSortEnd={this.onSortEnd}
                    // lockAxis="y"
                    // pressDelay={500} 
                    />
                  </div>
                )
              })
            }
          </ul>
        </div>

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

const Todos = SortableContainer(({ todos, onChange, deleteTodo, dateKey = undefined, todosIdx = undefined }) => (
  <ul className="todos">
    {
      todos.map((todo, index) => (
        <TodoItem
          index={index}
          todo={todo}
          onChange={() => { onChange(index, dateKey, todosIdx) }}
          deleteTodo={() => { deleteTodo(index, dateKey, todosIdx) }} />
      ))
    }
  </ul>
));
