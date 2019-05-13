import React from 'react';
import axios from 'axios';
import loadingGif from './loading.gif';
import './App.css';
import ListItem from './ListItem.js';

class App extends React.Component {  

  constructor() {

    super();

    this.state = {

      newTodo: '',

      editing: false,

      editingIndex: null,

      notification: null,

      loading: true,
      
      todos: []
    }

    this.apiUrl = 'https://5cd97d190b004000147204cc.mockapi.io/'

    this.handleChange = this.handleChange.bind(this)    
    this.addTodo = this.addTodo.bind(this)
    this.deleteTodo = this.deleteTodo.bind(this)
    this.updateTodo = this.updateTodo.bind(this)        
    this.alert =  this.alert.bind(this)
  }

  async componentDidMount() {
    const response = await axios.get(`${this.apiUrl}/todos`)
   
    this.setState({
      todos: response.data,
      loading: false
    })
  }

  handleChange(event) {

    this.setState({
      newTodo: event.target.value
    })    
  }

  async addTodo(){

    const response = await axios.post(`${this.apiUrl}/todos`, {
      name: this.state.newTodo
    })    

    const todos = this.state.todos
    todos.push(response.data)
    this.setState({
      todos: todos,

      newTodo: ''    
    })

    this.alert('Todo added successfully.')    
  }

  async deleteTodo(index){
    const todos = this.state.todos     
    const todo = todos[index]
    await axios.delete(`${this.apiUrl}/todos/${todo.id}`)

    delete todos[index]

    this.setState({ todos })
    this.alert('Todo deleted successfully.')
  }

  editTodo(index){  
    const todo = this.state.todos[index]    

    this.setState({
      editing: true,

      editingIndex: index,

      newTodo: todo.name
    })  
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex]
    
    this.setState({
      loading: true
    })          

    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`, {
      name: this.state.newTodo      
    })
    
    const todos = this.state.todos
    todos[this.state.editingIndex] = response.data

    this.setState({ 
      todos, 
      loading: false,      
      editing: false, 
      editingIndex: null, 
      newTodo: ''   
    })

    this.alert('Todo updated successfully.')      
  }

  alert(notification) {
    this.setState({
      notification
    })

    setTimeout(() => {
      this.setState({notification: null})
    }, 2000)
  }

  render() {
    
    return (

      <div className="App">
        <div className="container">

          {
            this.state.notification && 

            <div className="alert mt-3 alert-success">            
              {this.state.notification}                       
            </div>
          }

          <input 
            type="text" 
            name="todo"
            className="form-control mt-4 mb-2" 
            placeholder="Add a new todo" 
            onChange={this.handleChange}
            value={this.state.newTodo}
          />

          <button             
            onClick={this.state.editing ? this.updateTodo : this.addTodo}
            className="btn-success form-control mb-4"
            disabled={this.state.newTodo.length < 5}
          >
            {this.state.editing ? 'Update todo' : 'Add todo'}
          </button>

          {
            this.state.loading &&
            <img src={loadingGif} alt="" />
          }          

          {            
            
            (!this.state.editing || this.state.loading) &&

            <ul className="list-group">
              
              {this.state.todos.map((item, index) => {                                                                                

                return <ListItem                 

                  key={item.id}
                  item={item}
                  editTodo={() => { this.editTodo(index) }}
                  deleteTodo={() => { this.deleteTodo(index) }}
                  
                />
              })}

            </ul> 
          }     

        </div>
      </div>      
    );
  }
}

export default App;
