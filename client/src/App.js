import React, { Component } from 'react';
import io from "socket.io-client";

import logo from './logo.svg';
import './App.css';

const CONFIG = window.config || {
  token: "Hello DEV Flask",
  api: "http://localhost",
  port: 5000,
};

const API = `${CONFIG.api}:${CONFIG.port}`;
const socket = io();

export default class App extends Component {
  componentDidMount() {
    socket.on("connect", data => console.log("Socket connected on the front-end."));
    setInterval(() => socket.emit("client_request", { test: "test"}), 1500)
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
            {CONFIG.token} querying {API}
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
