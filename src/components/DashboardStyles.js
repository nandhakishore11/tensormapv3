const drawerWidth = 240;

const styles = theme => ({
   root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  appBarSpacer: theme.mixins.toolbar,

  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  chartContainer: {
    marginLeft: -22,
  },
  tableContainer: {
    height: 320,
  },
  mainFeaturedPost: {
    marginBottom: theme.spacing.unit * 2,
    padding : "5px",
    borderRadius : 0
  },
  mainFeaturedPostContent: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    borderRadius:0,
    padding : "10px"
    },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  dropArea : {
    minHeight : "50px",
    margin : "5px",
  },
  gridMargins : {
    padding : "3px",
    marginTop : "10px",
    marginBottom : "10px"
  },
  textField:{
    marginTop: "0px",
    marginBottom : "0px",
    paddingTop : "0px",
    paddingBottom : "0px",

},
whiteFont : {
    color: theme.palette.common.white,
},
buttonStyle : {
    marginLeft : "5px",
    marginRight : "5px"
}
  });

export default styles;