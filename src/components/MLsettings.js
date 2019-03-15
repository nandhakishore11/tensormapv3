import React, { Component } from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    MenuItem
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
const styles = {
  cardHeader : {
    align:"left"
  },
  card : {
      marginLeft:10,
      marginTop:10,
      marginRight:10,
      marginBottom: 10,
      height : "100%"
  },
  inpField : {
    marginLeft:10,
    marginRight:10,
    minWidth: 200
  }
};
export class MLsettings extends Component {
 
  render() {
    const {classes} = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardHeader title = {
                        "Hyperparameters"
                          }
                      subheader = {
                        "Tune Your Hyperparameters"
                          }
                      className={classes.cardHeader}
          />
          <CardContent>
            <div>
              <TextField  label="Epochs"
                          type="number"
                          className={classes.inpField}
                          InputLabelProps={{
                            shrink: true,
                                        }}
                          margin="normal"
                          value = {this.props.current.epochs}
                          onChange = {(e) => { this.props.onEpochsChange(e.target.value)}}
              />
              <TextField  label="Optimizer"
                          className={classes.inpField}
                          select
                          margin="normal"
                          value = {this.props.current.optimizer}
                          onChange = {(e) => {this.props.onOptimizerChange(e.target.value)}}
              >
                {this.props.optimizers.map(optimizer => (
                  <MenuItem key = {optimizer} value = {optimizer}>
                    {optimizer}
                  </MenuItem>
                ))}
              </TextField>
              <TextField  label="Learning Rate"
                          type="number"
                          className={classes.inpField}
                          InputLabelProps={{
                            shrink: true,
                                      }}
                          margin="normal"
                          value = {this.props.current.learningRate}
                          onChange = {(e) => this.props.onLearningRateChange(e.target.value)}
              />
              <TextField  label="Regularization"
                          className={classes.inpField}
                          select
                          margin="normal" 
                          value = {this.props.current.regularization}
                          onChange={(e) => {this.props.onRegularizationChange(e.target.value)} }
              >       
                
                {this.props.regularizations.map(reg => (
                  <MenuItem key = {reg} value = {reg}>
                    {reg}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles) (MLsettings);
