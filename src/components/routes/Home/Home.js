import React, { Component } from 'react';
import './Home.scss';

export default class Home extends Component {
  state = {
    newTodo: ''
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.result
    });
  };

  addTodo = (e) => {

  };

  render() {
    return (
      <div className="home container">
        <div className="create-todo">
          <form onSubmit={this.addTodo}>
            <input type="text"
              name="newTodo"
              placeholder="New Todo"
              onChange={this.onChange}
            />
            <input type="submit" value="Add" />
          </form>
        </div>
      </div>
    );
  }
}
