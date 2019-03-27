import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import {ListItem, TextField, Button} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import supported from './Supported';
import DDColumn from './DDColumns';
import D3Component from './D3Component';
import {Paper, Grid, CircularProgress} from '@material-ui/core';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import styles from './DashboardStyles';
import styled from 'styled-components';
import * as tf from '@tensorflow/tfjs';
import TrainLogs from './TrainLogs';
import {DoneAll, PlayCircleOutline} from '@material-ui/icons/';
const Container = styled.div`
  transition : background-color 0.2s ease;
  background-color : ${props => {return props.isDraggingOver ? 'darkgrey' : 'white'}};
  border-radius : 3px;
  padding : 3px;
  min-height:50px;
`;
const TargetContainer = styled.div`
  transition: background-color 0.2s ease;
  background-color : ${props => {return (props.isDragging ? 'lightgrey' : 'white');}};
  color : #000000;
  border-radius : 3px;
  margin : 3px;
`;

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

class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      ...supported,
      model: "Linear",
      optimizer :"Adam",
      regularization : "L1",
      learningRate : 0.01,
      epochs : 10,
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
  
  onDragEnd(result) {
    if(!result)
    {
      return;
    }
    const {draggableId, destination, source} = result;
    
    if(!destination)
    {
      return;
    }
    if(
      destination.droppableId === source.droppableId && destination.index === source.index
    )
    {
      return;
    }
    if (destination.droppableId.startsWith("tar"))
    {
        if(destination.droppableId == "tar-mod")
        {
          this.setState({
            model : this.state.elements[this.state.columns[source.droppableId].elementIds[source.index]].content
          })
        }
        else if (destination.droppableId == "tar-opt")
        {
          this.setState({
            optimizer : this.state.elements[this.state.columns[source.droppableId].elementIds[source.index]].content
          })
        }
        else
        {
          this.setState({
            regularization : this.state.elements[this.state.columns[source.droppableId].elementIds[source.index]].content
          })
        }
    }
    const startColumn = this.state.columns[source.droppableId];
    const finishColumn = this.state.columns[destination.droppableId];
    if(startColumn === finishColumn)
    {
      const newElementIds = Array.from(startColumn.elementIds);
      newElementIds.splice(source.index, 1);
      newElementIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        elementIds : newElementIds
      };
      const newState = {
        ...this.state,
        columns : {
          ...this.state.columns,
          [newColumn.id] : newColumn
        }
      };
      this.setState(newState);
      return;
    }

    
  }


  render() {
    const { classes } = this.props;

    return (
      <DragDropContext 
      onDragEnd = {this.onDragEnd}
      >
      <div className={classes.root}>
     
        <CssBaseline />
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, classes.appBarShift)}
        >
          <Toolbar disableGutters={false} className={classes.toolbar}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Demo
            </Typography>
            <TargetContainer>
            <TextField  label="Learning Rate"
                          type="number"
                          className={classes.textField}
                          margin="normal"
                          value = {this.state.learningRate}
                          onChange = {(e) => {this.handleLearningRateChange(e.target.value)}}
                         
              />
              </TargetContainer>
              <TargetContainer>
              <TextField  label="Epochs"
                          type="number"
                          className={classes.textField}
                          margin="normal"
                          value = {this.state.epochs}
                          onChange = {(e) => {this.handleEpochsChange(e.target.value)}}
              />
              </TargetContainer>
              <Button variant="contained" onClick={() => {this.trainModel()}} className={classes.buttonStyle}>
              
                <PlayCircleOutline />
                {this.state.nowTraining ? "TRAINING...   " : "TRAIN"}
              {this.state.nowTraining && <CircularProgress size={24}></CircularProgress>}
              </Button>
              <Button variant="contained" onClick={() => {this.predict()}} className={classes.buttonStyle}>
              
                <DoneAll />
              PREDICT
              </Button>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(classes.drawerPaper),
          }}
          open={true}
        >
          
        <div>
        {
            this.state.columnOrder.map((columnId) => {
          const column = this.state.columns[columnId];
          const elements = column.elementIds.map((elementId) => {return this.state.elements[elementId]});
          return <DDColumn key={columnId} column={column} elements={elements} droppableType = {column.title}/>
            })
        }
        </div>
        
        </Drawer>
        <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Paper className={classes.mainFeaturedPost} elevation={1}>
        
        <Grid container>
          <Grid item md={4} className={classes.gridMargins}>
            <Paper className={classes.mainFeaturedPostContent} elevation={4}>
              <Typography  padding="3" align="center" variant="h5" color="inherit" gutterBottom>
                    Model
              </Typography>
              <Typography align="center" variant="subtitle2" color="inherit" gutterBottom >
                Drag and drop your model here.
              </Typography>
              <Droppable droppableId={"tar-mod"} type={"Models"}>
              {(provided, snapshot)=> { return <Container
                  ref = {provided.innerRef}
                  innerRef = {provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver = {snapshot.isDraggingOver}
                  className= {classes.dropArea}
              > 
              <TargetContainer><ListItem>{this.state.model}</ListItem></TargetContainer>
              {provided.placeholder}</Container>}}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item md={4} className={classes.gridMargins}>
            <Paper className={classes.mainFeaturedPostContent} elevation={4}>
              <Typography  padding="3" align="center" variant="h5" color="inherit" gutterBottom>
                    Optimizer
              </Typography>
              <Typography align="center" variant="subtitle2" color="inherit" gutterBottom >
                Drag and drop your Optimizer here.
              </Typography>
              <Droppable droppableId={"tar-opt"} type={'Optimizers'}>
              {(provided, snapshot)=> { return <Container
                  ref = {provided.innerRef}
                  innerRef = {provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver = {snapshot.isDraggingOver}
                  className= {classes.dropArea}
              > 
              <TargetContainer><ListItem>{this.state.optimizer}</ListItem></TargetContainer>
              {provided.placeholder}</Container>}}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item md={4} className={classes.gridMargins}>
            <Paper className={classes.mainFeaturedPostContent} elevation={4}>
              <Typography  padding="3" align="center" variant="h5" color="inherit" gutterBottom>
                    Regularization
              </Typography>
              <Typography align="center" variant="subtitle2" color="inherit" gutterBottom >
                Drag and drop your Regularization here.
              </Typography>
              <Droppable droppableId={"tar-reg"} type={"Regularizations"}>
              {(provided, snapshot)=> { return <Container
                  ref = {provided.innerRef}
                  innerRef = {provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver = {snapshot.isDraggingOver}
                  className= {classes.dropArea}
              > 
              <TargetContainer><ListItem>{this.state.regularization}</ListItem></TargetContainer>
              {provided.placeholder}</Container>}}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item md={6}>
          <D3Component data={this.state.trainData} predict={this.state.predict} predictData={this.state.predictData} dataMax = {[this.state.dataMaxX, this.state.dataMaxY]} onDatapointAdd={this.handleAddingDatapoint}/>
          </Grid>
          <Grid item md={6}>
          <TrainLogs data={this.state.trainLogs} />     
          </Grid>
        </Grid>
        
        </Paper>
        </main>
        
      </div>
      </DragDropContext>
    );
  }
}
/*
 <AppBar
          position="absolute"
          className={classNames(classes.appBar,classes.appBarShift)}
        >
          <Toolbar disableGutters={false} className={classes.toolbar}>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Dashboard
              <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            </Typography>
          </Toolbar>
        </AppBar>

*/
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
