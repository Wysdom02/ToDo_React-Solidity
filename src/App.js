import './App.css';
import Web3 from 'web3';
import { Component } from 'react';
import { TODO_ABI, TODO_ADDRESS } from './config'
import TodoList from './todo'

class App extends Component {
  componentWillMount ()
  {console.log("hello")
    this.loadBlockchainData()
  }  
  
    

async loadBlockchainData()
{

  const web3 = new Web3(Web3.givenProvider || "http://localhost:8545" )
  await window.ethereum.enable();
  const accounts =  await web3.eth.getAccounts()
  this.setState({ account: accounts[0] })

  const todoList = new web3.eth.Contract(TODO_ABI,TODO_ADDRESS)
  this.setState({ todoList })
  const taskCount = await todoList.methods.taskCount().call()
   this.setState({ taskCount })
   for(var i=1;i<=taskCount;i++){
    const task=await todoList.methods.tasks(i).call()
    this.setState({
    tasks: [...this.state.tasks, task]
  })
   }
   this.setState( {loading : false} )
}

constructor(props) {
  super(props);
  this.state = { 
    account: '',
    taskCount: 0,
    tasks: [],
    loading:true
    }
    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)
}

createTask(content) {
  this.setState({ loading: true })
  this.state.todoList.methods.createTask(content).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    this.setState({
      tasks: [],
      taskCount: 0,
      loading: false
    })
    this.loadBlockchainData()
  })
}

toggleCompleted(taskId) {
  this.setState({ loading: true })
  this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account })
  .once('receipt', (receipt) => {
    
    this.setState({
      tasks: [],
      taskCount: 0,
      loading: false
    })
    this.loadBlockchainData()
  })
}

  render(){
  return (
    <div className="container">
     <nav className="navbar navbar-dark  bg-dark flex-md-nowrap p-0 shadow">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="https://wysdom02.github.io/Wysom02.github.io/" target="_blank">Keshav Rathi | Todo List</a>
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small><a className="nav-link" href="#"><span id="account"></span></a></small>
        </li>
      </ul>
    </nav>
 <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

