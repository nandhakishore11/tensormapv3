import React, { Component } from 'react'
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    Card,
    CardHeader,
    CardContent,
    IconButton,
    } from '@material-ui/core';
import {CheckCircle} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';


const styles = 
{
    card : {
        marginLeft:10,
        marginTop:10,
        marginRight:10,
        marginBottom: 10,
        height : "100%"
    },
    cardHeader : {
        align:"left"
      },
}

export class SelectedModel extends Component {
  render() {
    const {classes} = this.props;
    return (
      <div>
        <Card className={classes.card }>
          <CardHeader className={classes.cardHeader}
          title= {
            "ML Model"
                }
          subheader = {
            "Select Your ML Model"
                    }
          />
          <CardContent>
            <List>
                <ListItem button>
                    Linear Model
                    <ListItemSecondaryAction>
                        <IconButton>
                            <CheckCircle />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
          </CardContent>
        </Card>
      </div>
    )
  }
}

export default withStyles(styles) (SelectedModel);
