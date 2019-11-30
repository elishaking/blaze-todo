import React from 'react';

export default function Todo({ todo, onChange, deleteTodo }) {
  return (
    <li className="todo">
      <div>
        <input type="checkbox"
          checked={todo.done}
          onChange={onChange} />

        <p>{todo.text}</p>

        <p className="close" onClick={deleteTodo}>x</p>
      </div>
      <small>{new Date(todo.date).toLocaleTimeString()}</small>
      {/* <svg xmlns="http://www.w3.org/2000/svg" width="26" height="15" viewBox="0 0 26 15">
        <g id="Group_1" data-name="Group 1" transform="translate(-744 -255)">
          <line id="Line_1" data-name="Line 1" x2="23" transform="translate(745.5 256.5)" fill="none" stroke="#707070" stroke-linecap="round" stroke-width="3" />
          <line id="Line_2" data-name="Line 2" x2="23" transform="translate(745.5 262.5)" fill="none" stroke="#707070" stroke-linecap="round" stroke-width="3" />
          <line id="Line_3" data-name="Line 3" x2="23" transform="translate(745.5 268.5)" fill="none" stroke="#707070" stroke-linecap="round" stroke-width="3" />
        </g>
      </svg> */}
    </li>
  )
}
