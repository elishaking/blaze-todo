import React from 'react';

export default function Todo({ todo, onChange, deleteTodo }) {
  return (
    <div className="todo">
      <div>
        <input type="checkbox"
          checked={todo.done}
          onChange={onChange} />

        <p>{todo.text}</p>

        <p className="close" onClick={deleteTodo}>x</p>
      </div>
      <small>{new Date(todo.date).toLocaleTimeString()}</small>
    </div>
  )
}
