import React, { useRef, useState, useEffect } from 'react';
import { makeStyles, styled, useTheme } from '@material-ui/core/styles';
import Axios from "axios";

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Xlogo from "../../images/Xlogo.jpg";


import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { Collapse } from 'react-bootstrap';
import { Link } from 'react-router-dom';


import { history } from "../../_helpers";
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';



import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

function useOutsideAlerter(ref) {
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));



const addNavClick = () => {
  const element = document.getElementById("OpenNavigation")
  if (element.classList.toggle("show")) {
  }
  else {
    element.classList.remove("show");
  }
};

// document.addEventListener('mouseup', function(e) {
//     var container = document.getElementById('Settingsbd');
//     if (!container.contains(e.target)) {
//       container.classList.remove("show");
//     }
// });



export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [navopen, setNavOpen] = React.useState(false);
  const [navopenone, setNavOneOpen] = React.useState(true);
  const [navopenonenew, setNavOneOpenNew] = React.useState(true);
  const [openstarred, setopenstarredNew] = React.useState(true);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);

  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);

  useEffect(() => {
    FromEmailList();
  }, []);


  const OnehandleClick = () => {
    setNavOpen(!navopen);
  };

  const OnehandleClickInOne = () => {
    setNavOneOpen(!navopenone);
  };

  const OnehandleClickInNew = () => {
    setNavOneOpenNew(!navopenonenew);
  };
  const OnehandleClickStarred = () => {
    setopenstarredNew(!openstarred);
  };

  // Start From Email List
  const FromEmailList = () => {

    var Data = {
      ClientID: "6306f9256597e411202642f3",
      UserID: "62fdff964b8b3a2614136ac2"
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/EmailAccountGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetFromEmailDropdownList(Result.data.PageData);

        } else {
          toast.error(<div>Unanswered Responses <br />Please add email configuration.</div>)
        }
      }
      else {
        SetFromEmailDropdownList([]);
        toast.error(Result?.data?.Message);
      }
    });


  }

   // Edit CLient
   const RedirectLink = (ID,PageName) => {
debugger
    if(PageName=="Follow Up Later"){
      
      history.push("/FollowUpLater");
    }
    if (PageName =="Unanswered Responses")
  {
    // history.push("/UnansweredResponses",ID);
    history.push({
      pathname: '/UnansweredResponses',
      state: { ID:ID }
    });
  }
  }

  console.log("FromEmailDropdownList========", FromEmailDropdownList)
  const WrapperRef = useRef(null);
  useOutsideAlerter(WrapperRef);
  return (
    <Box sx={{ display: 'flex' }}>
      <div className='orangbody'>
        <img src={Xlogo} width="100%" />

        <IconButton className='mx-1'
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>


        <IconButton className='mobileshow' onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>

        <div onClick={addNavClick} className='Settingsbd'>
          <SettingsIcon />
        </div>

        <div id='OpenNavigation' className='carsetting'>
          <ul>
            <li><a href="/">Templates</a></li>
            <li><a href="/">Objections</a></li>
            <li><a href="/">Email Settings</a></li>
            <li><a href="/">Clients</a></li>
            <li><a href="/">Contacts</a></li>
          </ul>
        </div>
      </div>


      <Drawer className='sidenavtree'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          visibility: 'visible',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >

        <TreeView
          aria-label="multi-select"
          defaultExpanded={['1', '2', '18']}
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
          sx={{ height: 216, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" className='text-bold' label="All Account">
            <TreeItem nodeId="2" label="Inbox">
              <TreeItem nodeId="7" label="All">
                <TreeItem nodeId="8" label="New">
                  <Link to="/"> New 1</Link>
                  <Link to="/"> New 2</Link>
                  <Link to="/"> New 3</Link>
                </TreeItem>
                <TreeItem nodeId="9" label="Starred">
                  <Link to="/">Starred 1</Link>
                  <Link to="/">Starred 2</Link>
                  <Link to="/">Starred 3</Link>
                </TreeItem>
              </TreeItem>

              <TreeItem nodeId="10" label="Focused">
                <Link to="/">Focused 1</Link>
                <Link to="/">Focused 2</Link>
              </TreeItem>

              <TreeItem nodeId="11" label="Other Inbox">
                <Link to="/">Other Inbox 1</Link>
                <Link to="/">Other Inbox 2</Link>
              </TreeItem>

              <TreeItem nodeId="12" label="Follow Up Later">
                <Link to="/">Follow Up Later 1</Link>
                <Link to="/">Follow Up Later 2</Link>
              </TreeItem>

              <TreeItem nodeId="13" label="Junk">
                <Link to="/">Junk 1</Link>
                <Link to="/">Junk 2</Link>
              </TreeItem>

              <TreeItem nodeId="14" label="Trash">
                <Link to="/">Trash 1</Link>
                <Link to="/">Trash 2</Link>
              </TreeItem>
            </TreeItem>

            <TreeItem nodeId="18" label="Outbox">
              <TreeItem nodeId="19" label="All Sent">
                <Link to="/">All Sent 1</Link>
                <Link to="/">All Sent 2</Link>
                <Link to="/">All Sent 3</Link>
              </TreeItem>
              <TreeItem nodeId="20" label="Unanswered">
                <Link to="/">Unanswered 1</Link>
                <Link to="/">Unanswered 2</Link>
                <Link to="/">Unanswered 3</Link>
              </TreeItem>
              <TreeItem nodeId="21" label="Scheuled">
                <Link to="/">Scheuled 1</Link>
                <Link to="/">Scheuled 2</Link>
                <Link to="/">Scheuled 3</Link>
              </TreeItem>
              <TreeItem nodeId="22" label="Draft">
                <Link to="/">Draft 1</Link>
                <Link to="/">Draft 2</Link>
              </TreeItem>
            </TreeItem>
          </TreeItem>

          {
            FromEmailDropdownList?.map((item, index) => {
              return (
                <TreeItem nodeId={item._id} className='text-bold' label={item.Email}>
                  <TreeItem nodeId={"f1" + item._id} label="Inbox">
                    <TreeItem nodeId={"f2" + item._id} label="All">
                      <TreeItem nodeId={"f3" + item._id} label="New">
                        <Link to="/"> New 1</Link>
                        <Link to="/"> New 2</Link>
                        <Link to="/"> New 3</Link>
                      </TreeItem>
                      <TreeItem nodeId={"f4" + item._id} label="Starred">
                        <Link to="/">Starred 1</Link>
                        <Link to="/">Starred 2</Link>
                        <Link to="/">Starred 3</Link>
                      </TreeItem>
                    </TreeItem>

                    <TreeItem nodeId={"f5" + item._id} label="Focused">
                      <Link to="/">Focused 1</Link>
                      <Link to="/">Focused 2</Link>
                    </TreeItem>

                    <TreeItem nodeId={"f6" + item._id} label="Other Inbox">
                      <Link to="/">Other Inbox 1</Link>
                      <Link to="/">Other Inbox 2</Link>
                    </TreeItem>

                    <TreeItem nodeId={"f7" + item._id} label="Follow Up Later">
                      <Link onClick={() => RedirectLink(item._id,"Follow Up Later")} >Follow Up Later</Link>
                    </TreeItem>
                    

                    <TreeItem nodeId={"f8" + item._id} label="Junk">
                      <Link to="/">Junk 1</Link>
                      <Link to="/">Junk 2</Link>
                    </TreeItem>

                    <TreeItem nodeId={"f9" + item._id} label="Trash">
                      <Link to="/">Trash 1</Link>
                      <Link to="/">Trash 2</Link>
                    </TreeItem>
                  </TreeItem>

                  <TreeItem nodeId={"f10" + item._id} label="Outbox">
                    <TreeItem nodeId={"f11" + item._id} label="All Sent">
                      <Link to="/">All Sent 1</Link>
                      <Link to="/">All Sent 2</Link>
                      <Link to="/">All Sent 3</Link>
                    </TreeItem>
                    <TreeItem nodeId={"f13" + item._id} label="Unanswered">
                      <Link to="/">Unanswered 1</Link>
                      <Link to="/">Unanswered 2</Link>
                      <Link to="/">Unanswered 3</Link>
                    </TreeItem>
                    <TreeItem nodeId={"f14" + item._id} label="Scheuled">
                      <Link to="/">Scheuled 1</Link>
                      <Link to="/">Scheuled 2</Link>
                      <Link to="/">Scheuled 3</Link>
                    </TreeItem>
                    <TreeItem nodeId={"f15" + item._id} label="Draft">
                      <Link to="/">Draft 1</Link>
                      <Link to="/">Draft 2</Link>
                    </TreeItem>
                    <TreeItem nodeId={"f16" + item._id} label="Unanswered Responses">
                      <Link onClick={() => RedirectLink(item._id,"Unanswered Responses")} >Unanswered Responses</Link>
                    </TreeItem>
                  </TreeItem>
                </TreeItem>
              )
            })
          }
        </TreeView>
        {/* 

       <List> 
       <ListItemButton onClick={OnehandleClick}>
        {navopen ? <ExpandLess /> : <ExpandMore />}
        All Accounts
      </ListItemButton>

      <Collapse in={navopen} timeout="auto" unmountOnExit>
        <List component="div"> 
          <List component="div">  
            <ListItemButton sx={{ pl: 4 }} onClick={OnehandleClickInOne}> 
              {!navopenone ? <ExpandLess /> : <ExpandMore />}
              Test 2
            </ListItemButton>

            <Collapse in={!navopenone} timeout="auto" unmountOnExit>
              <List component="div" disablePadding> 
                <List component="div">  
                  <ListItemButton sx={{ pl: 6 }} onClick={OnehandleClickInNew}> 
                    {!navopenonenew ? <ExpandLess /> : <ExpandMore />}
                    New
                  </ListItemButton>

                  <Collapse in={!navopenonenew} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 8 }}> 
                        <ListItemText primary="Starred" />
                      </ListItemButton>
                    </List> 
                  </Collapse> 
                </List>

                <List component="div">  
                  <ListItemButton sx={{ pl: 6 }} onClick={OnehandleClickStarred}> 
                    {!openstarred ? <ExpandLess /> : <ExpandMore />}
                    Starred
                  </ListItemButton>

                  <Collapse in={!openstarred} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 8 }}> 
                        <ListItemText primary="Starred" />
                      </ListItemButton>
                    </List> 
                  </Collapse> 
                </List>

              </List> 
            </Collapse> 
          </List>

        </List>
      </Collapse>
      

      <ListItem button >
        <Link to="/ckpis"> 
        KPIs
        </Link>
      </ListItem>

      <ListItem button>
        <Link to="/caccounts"> 
        Accounts
        </Link>
      </ListItem>

      <ListItem button>
      <Link to="/ccontacts"> 
        Contacts
          </Link>
      </ListItem>
      </List>
           */}
      </Drawer>
    </Box >
  );
}













