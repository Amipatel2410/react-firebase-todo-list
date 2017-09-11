import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import moment from 'moment';

class App extends Component {

    constructor(){
      super();
      this.state = {
        newTodoText: '',
        todos: {}
      };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.selectTodo = this.selectTodo.bind(this);
    }

    componentDidMount(){
      axios({
        url: '/todos.json',
        baseURL: 'https://todo-list-app-6de68.firebaseio.com/',
        method:'get',
      })
      .then((response)  => {
        console.log(response);
        this.setState({todos: response.data});
      }).catch((error) => {
        console.log(error);
      });
    }

    handleSubmit(event) {

      event.preventDefault();
      const newTodo = {
          title: this.state.newTodoText,
          createAt: new Date()
      };
      axios({
        url: '/todos.json',
        baseURL: 'https://todo-list-app-6de68.firebaseio.com/',
        method: 'post',
        data: newTodo
       })
        .then((response) => {
        console.log(response);
        let todos = this.state.todos;
        let newTodoId = response.data.name;
        todos[newTodoId] = newTodo;
        this.setState({todos: todos , newTodoText: ''});
       })
         .catch((error) => {
          console.log(error);
      });

    }

    handleChange(event) {

      event.preventDefault();
      this.setState({newTodoText: event.target.value});

    }

    deleteTodo(todoId)
    {
        axios({
            url: `/todos/${todoId}.json`,
            baseURL: 'https://todo-list-app-6de68.firebaseio.com/',
            method: 'DELETE'
          })
        .then((response) => {
            console.log(response);
            let todos = this.state.todos;
            delete todos[todoId];
            this.setState({todos: todos});
       })
         .catch((error) => {
          console.log(error);
        });
    }

    selectTodo(todoId)
    {
        this.setState({currentTodo: todoId});
    }

    renderSelectedTodo(){

      let content;

      if(this.state.currentTodo){
      let currentTodo = this.state.todos[this.state.currentTodo];
      content = (
          <div>
            <h2> {currentTodo.title} </h2>
          </div>
        );
        }

        return content;
    }

    renderNewTodoBox() {
      return(
        <div className="new-todo-box pb-2">
        <form onSubmit={this.handleSubmit}>
          <input
            className="w-100"
            placeholder="What do you have to do?"
            value={this.state.newTodoText}
            onChange={this.handleChange} />
        </form>
      </div>
        );
    }

    renderTodoList() {

        let todoElements = [];
        for(let todoId in this.state.todos) {
          let todo = this.state.todos[todoId]

          todoElements.push(
            <div className="todo d-flex justify-content-between pb-4" key={todoId}>
            <div className="mt-2" onClick={() => this.selectTodo(todoId)}>
            <h4>{todo.title}</h4>
            <div>{moment(todo.createdAt).calendar()}</div>
              </div>
            <button className="ml-4 btn btn-link"
            onClick={() => {this.deleteTodo(todoId) }}>
              <span aria-hidden="true">&times;</span>
              </button>
            </div>
          );
         }

          return (
            <div className="todo-list">
            {todoElements}
            </div>
           );

     }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pt-3">
          <div className="col-6 px-4">
            {this.renderNewTodoBox()}
            {this.renderTodoList()}
          </div>
          <div className="col-6 px-4">
            {this.renderSelectedTodo()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
