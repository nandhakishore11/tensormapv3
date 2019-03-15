import React from 'react'
import {Label, ScatterChart, Scatter, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
const data = [{ "x": 400, "y":100}, {"x": 650, "y":200}, { "x": 100, "y":300}, { "x": 1000, "y":400}, { "x": 750, "y":500} ];

export class D3Component extends React.Component {

constructor(props)
  {
      super(props);
  }

  addLinePoint(mouseClickData) 
  {
      if (mouseClickData)
      {
        //console.log(mouseClickData);
        var point  = {x : Math.floor(mouseClickData.xValue) , y : Math.floor(mouseClickData.yValue) };
        this.props.onDatapointAdd(point);
        //console.log(this.props.data);
        //console.log(chartY);
        //this.setState((prevState) => ({
        //  data : prevState.data.concat([{"x" : point.x, "y":point.y}])
        //}))
        
  }
}

render() {
  return (
    <div>
                                 
<ScatterChart width={500} height={300}
  margin={{ top: 20, right: 20, bottom:3, left: 10 }} onClick = {(mouseClickData) => {this.addLinePoint(mouseClickData)}}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="x" name="Y" domain={[0, this.props.dataMax[0]]} type="number"> 
    <Label value = "X"  position="insideBottom"  offset={-3} />
  </XAxis>
  <YAxis dataKey="y" name="X" domain={[0, this.props.dataMax[1]]} type="number">
    <Label value="Y" position="insideLeft" angle={-90} />
  </YAxis>
  <Tooltip cursor={{ strokeDasharray: '3 3' }} />  
  <Legend verticalAlign={"top"} height={30} />
  <Scatter name="Training Data" data={this.props.data} fill="#8884d8" />
  {this.props.predict && <Scatter name="Predicted" data={this.props.predictData}  fill="#000000"/>}
  </ScatterChart>
  </div>
  )
}
}

export default D3Component;
