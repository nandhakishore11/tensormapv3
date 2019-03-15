import React, { Component } from 'react'
import MLSettings from './MLsettings';
import D3Component from './D3Component';
import SelectedModel from './SelectedModel';
import {withStyles} from '@material-ui/core/styles';
import {Grid, Button, CircularProgress} from '@material-ui/core';
import * as tf from '@tensorflow/tfjs';
import TrainLogs from './TrainLogs';
//import * as tflayers from '@tensorflow/tfjs-layers';
//import * as tf from '@tensorflow/tfjs-core';
const styles = {
  root:
  {
    display:"flex",
    flexDirection:"column",
    minWidth:1000
  },
  grid : {
    marginTop : 10,
    marginBottom: 10
   }
}
function getTensorflowLinearModel() {
  var tfModel = tf.sequential();
  tfModel.add(tf.layers.dense({units: 1, inputShape: [1]}));
  tfModel.add(tf.layers.dense({units: 1}));
  return tfModel;  
}

function parseData(data)
{
 // console.log(data);
  return tf.tidy(() => {
    tf.util.shuffle(data);
    var xValues = [];
    var yValues = [];
    for(var i = 0; i < data.length; i++)
    {
      xValues = xValues.concat([data[i].x]);
      yValues = yValues.concat([data[i].y]);
    }
    const xTensor = tf.tensor2d(xValues, [xValues.length, 1]);
    const yTensor = tf.tensor2d(yValues, [yValues.length, 1]);
    const xMin = xTensor.min();
    const xMax = xTensor.max();
    const yMin = yTensor.min();
    const yMax = yTensor.max();
    const yNorm = yTensor.sub(yMin).div(yMax.sub(yMin));
    const xNorm = xTensor.sub(xMin).div(xMax.sub(xMin));
    return {
      xNorm: xNorm,
      yNorm:yNorm,
      xMin:xMin,
      yMin:yMin,
      xMax:xMax,
      yMax:yMax,
    }
  });
}



export class TrainableModel extends Component {
  constructor(props) {
    super(props)
    this.optimizers = ["Adam", "RMSProp"];
    this.regularizations = ["L1", "L2"];

    this.defaults = {
      optimizer : this.optimizers[0],
      regularization: this.regularizations[0],
      epochs : 1,
      learningRate : 0.1
    }
    
    this.state = {
       learningRate : 0.01,
       epochs : 10,
       regularization : this.regularizations[0],
       optimizer: this.optimizers[0],
       trainData : [],
       trainLogs : [],
       dataMaxX : 100,
       dataMaxY : 100,
       nowTraining : false,
       predict : false,
       predictedData : []
    }
    this.model = getTensorflowLinearModel();
    
    this.handleEpochsChange = this.handleEpochsChange.bind(this);
    this.handleLearningRateChange = this.handleLearningRateChange.bind(this);
    this.handleOptimizerChange = this.handleOptimizerChange.bind(this);
    this.handleRegularizationChange = this.handleRegularizationChange.bind(this);
    this.handleAddingDatapoint = this.handleAddingDatapoint.bind(this);
  }
  handleEpochsChange = (epochsNow) => {
    this.setState({
      epochs : epochsNow
    });
  }
  handleRegularizationChange = (regularizationNow) => {
   // console.log("Regularization change event");
    this.setState({
      regularization : regularizationNow
    });
  }
  handleOptimizerChange = (optimizerNow) => {
    this.setState({
      optimizer : optimizerNow
    });
  }
  handleLearningRateChange = (learningRateNow) => {
    this.setState({
      learningRate : learningRateNow
    });
  }
  handleAddingDatapoint = (datapoint) => {
    //console.log("Handling DATA add");
    this.setState((prevState) => ({
      trainData : prevState.trainData.concat({x:datapoint.x, y:datapoint.y})
    }), () => {
     // console.log("Data Point Added");
    });
  }
  
  trainModel() {
        this.setState({
          nowTraining : true,
          trainLogs : []
        });
        var fittable = parseData(this.state.trainData);
        this.model.compile({
          optimizer:this.state.optimizer,
          loss: tf.losses.meanSquaredError,
          metrics: ['mse', 'accuracy'],
          lr : this.state.learningRate
        });
         this.model.fit(
          fittable.xNorm,
          fittable.yNorm,
          {
            epochs : this.state.epochs,
            shuffle : true,
            callbacks : {
              onEpochEnd :  (epoch, logs) => {
                var changedLogs = logs;
                changedLogs.epoch = epoch;
                this.setState((prevState) => ({
                  trainLogs : prevState.trainLogs.concat([changedLogs])
                }));
              },
              onTrainEnd : () => {
                  this.setState({
                    nowTraining : false
                  })
              }
            }
          }
        );   
  }

  predict()
  {
    var predictData = [];
    const [x, y] = tf.tidy(() => {
      var xValues = tf.linspace(0,1, 100);
      var preds = this.model.predict(xValues.reshape([100,1]));
      const analysedData = parseData(this.state.trainData);
      var unNormX = xValues.mul(analysedData.xMax.sub(analysedData.xMin)).add(analysedData.xMin);
      var unNormY = preds.mul(analysedData.yMax.sub(analysedData.yMin)).add(analysedData.yMin);
      return [unNormX.dataSync(), unNormY.dataSync()];
    });
    predictData = Array.from(x).map((val, i) => {
      return {x: val, y:y[i]}
    });
    this.setState((prevState) => ({
      predict : !prevState.predict
    }), () => {
      this.setState({
        predictData : predictData
      });
    });
  }

  render() {
    const {classes} = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={8} > 
          <Grid item xs={4} className={classes.grid}>
            <SelectedModel />
          </Grid>
          <Grid item xs={8} className = {classes.grid}>
            <MLSettings onEpochsChange={this.handleEpochsChange}
                        onLearningRateChange = {this.handleLearningRateChange}
                        onRegularizationChange = {this.handleRegularizationChange}
                        onOptimizerChange = {this.handleOptimizerChange}
                        optimizers = {this.optimizers}
                        regularizations = {this.regularizations}
                        current = {this.state}
            />
          </Grid>
          <Grid item xs={6} className = {classes.grid} > 
            <D3Component data={this.state.trainData} predict={this.state.predict} predictData={this.state.predictData} dataMax = {[this.state.dataMaxX, this.state.dataMaxY]} onDatapointAdd={this.handleAddingDatapoint}/>
          </Grid>
          <Grid item xs={4} className = {classes.grid } >  
            <TrainLogs data={this.state.trainLogs} />     
          </Grid>
          <Grid item xs={2} className = {classes.grid} >
            <Button variant='contained' onClick={() => {this.trainModel()}} disabled={this.state.nowTraining}>  
              {this.state.nowTraining ? "TRAINING...   " : "TRAIN"}
              {this.state.nowTraining && <CircularProgress size={24}></CircularProgress>}
            </Button> 
            <Button variant="contained" onClick={() => {this.predict()}} >
              Predict
            </Button>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles) (TrainableModel);
