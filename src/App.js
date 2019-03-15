import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Typography from '@material-ui/core/Typography';
//import Mycomponent from './components/Mycomponent';
import Header from './components/Header';
import TrainableModel from './components/TrainableModel';
import MLSettings from './components/MLsettings';
import {withStyles} from '@material-ui/core/styles';
import Dashboard from './components/Dashboard';
class App extends Component {
  render() {
    return (
      <div >
       <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
       <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.0.0/dist/tf.min.js"></script>
       <Dashboard />
      </div>
    );
  }
}

export default App;
