import React, { Component } from 'react';
import io from "socket.io-client";

import logo from './logo.svg';
import './App.css';

// http://deep-dive-072193.herokuapp.com/
const socket = io("http://localhost:5000")

export default class App extends Component {
  componentDidMount() {
    socket.on("connect", data => console.log("Socket connected on the front-end."));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            Also, {window.token}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}
