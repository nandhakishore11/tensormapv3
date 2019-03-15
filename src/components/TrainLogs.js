import React, { Component } from 'react'
import {Line, LineChart, XAxis, YAxis, CartesianGrid, Legend} from 'recharts';
 /*const data = [
    {
        mse: 0.5
    },
    {
        mse : 0.4
    },
    {
        mse : 0.3
    },
    {
        mse : 0.2
    }

]; */
export class TrainLogs extends Component {
  render() {
    return (
      <div>
    
  <LineChart width={500} height={300} data={this.props.data}>
    <XAxis dataKey="epoch" type="number" label={{value:"Epochs", offset:0, position:"insideBottom"}}/>
    <YAxis type="number" />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Legend />
    <Line type="monotone" dataKey="mse" name="Mean Squared Error" stroke="#8884d8" dot={false} />
    <Line type="monotone" dataKey="acc" name="Accuracy" stroke="#82ca9d" dot={false} />
  </LineChart>
      </div>
    )
  }
}
//<Line type="monotone" name = "Training Loss" dataKey="loss" stroke="#2600ff" />
//<Line type="monotone" name="Accuracy" dataKey="acc" stroke="#258220" />
/*
    <LineChart width={500} height={300} data={this.props.data}>
    <XAxis dataKey="epoch" type = "number" name="Epochs"/>
    <YAxis type="number" />
    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
    <Line type="monotone" dataKey="mse" stroke="#8884d8" />
    <Line type="monotone" dataKey="loss" stroke="#2600ff" />
    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" />
  </LineChart>

  */
export default TrainLogs
