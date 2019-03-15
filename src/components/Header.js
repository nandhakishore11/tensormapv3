import React from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Paper
} from '@material-ui/core';
import {Menu} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };
function Header(props) {
    const {classes} = props;
  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
            <IconButton className={classes.menuButton} color='inherit'>
            <Menu />
            </IconButton>
        <Typography variant='h6' color='inherit' className={classes.grow}>
            TM
        </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withStyles(styles) (Header);
