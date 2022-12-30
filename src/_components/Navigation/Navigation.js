import React, { useRef, useState, useEffect } from 'react';
import { makeStyles, styled, useTheme } from '@material-ui/core/styles';
import Axios from "axios";
import Moment from "moment";

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
import Usericon from '../../images/icons/users.svg';

import ExpandDown from '@material-ui/icons/NavigateNext';
import ArrowRight from '@material-ui/icons/ExpandMore';

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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { UpdateUserDetails, GetUserDetails, Logout, ClientChnage, LoaderHide, LoaderShow } from '../../_helpers/Utility'

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



export default function Navigation(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [navopen, setNavOpen] = React.useState(true);
  const [navopenone, setNavOneOpen] = React.useState(true);
  const [navopenonenew, setNavOneOpenNew] = React.useState(true);
  const [openstarred, setopenstarredNew] = React.useState(true);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
  const [client, setClient] = React.useState('');
  const [ClientDropdown, SetClientDropdown] = useState([])
  const [SelectedClient, SetSelectedClient] = useState([]);
  const [UserImage, SetUserImage] = useState()
  const [UserDetails, SetUserDetails] = useState();
  const [expanded, SetExpanded] = useState([]);
  const [AllTotalRecords, SetAllTotalRecords] = useState()
  const [AllSentTotalRecords, SetAllSentTotalRecords] = useState()
  const [TotalCount, SetTotalCount] = React.useState();
  const [EmailTotalRecords, SetEmailTotalRecords] = useState()
  const [SentEmailTotalRecords, SetSentEmailTotalRecords] = useState()
  const [SelectMenuItem, SetSelectMenuItem] = React.useState("/kpis");
  const [EID, SetEID] = React.useState("");
  const [OpemID, SetEOpenID] = React.useState("");
  const [OutBoxID, SetOutBoxID] = React.useState("");




  useEffect(() => {
    GetClientDropdown();
    GetClientID()


  }, []);


  const handleListItemClick = (event, PageName, ID) => {
    if (ID != undefined && ID != "") {
      var pg = PageName + ID
      SetSelectMenuItem(pg);
      localStorage.setItem("NavigationID", ID)
    } else {
      SetSelectMenuItem(PageName);
      localStorage.setItem("NavigationID", "")
    }
    if (PageName == "/UnansweredResponses") {
      if (ID != "" && ID != null) {
        history.push("/UnansweredResponses", ID);
      } else {
        history.push("/UnansweredResponses");
      }
    }
    if (PageName == "/Starred") {
      if (ID != "" && ID != null) {
        history.push("/Starred", ID);
      } else {
        history.push("/Starred");
      }
    }
    if (PageName == "/FollowUpLater") {
      if (ID != "" && ID != null) {
        history.push("/FollowUpLater", ID);
      }
      else {
        history.push("/FollowUpLater");
      }
    }
    if (PageName == "/Drafts") {
      if (ID != "" && ID != null) {

        history.push("/Drafts", ID);
      } else {
        history.push("/Drafts");
      }
    }
    if (PageName == "/OtherInboxPage") {
      if (ID != "" && ID != null) {
        history.push("/OtherInboxPage", ID);
      } else {
        history.push("/OtherInboxPage");
      }
    }
    if (PageName == "/Spam") {
      if (ID != "" && ID != null) {
        history.push("/Spam", ID);
      } else {
        history.push("/Spam");
      }
    }
    if (PageName == "/AllInbox") {
      if (ID != "" && ID != null) {
        history.push("/AllInbox", ID);
      } else {
        history.push("/AllInbox");
      }
    }
    // if (PageName == "AllInbox") {
    //   if (ID != "" && ID != null) {
    //     if (history.location.pathname === "/AllInbox") {
    //       window.location.href = "http://localhost:3001/AllInbox?" + encodeURIComponent(JSON.stringify(ID))
    //     }
    //   } else {
    //     window.location.href = "http://localhost:3001/AllInbox"
    //   }
    // }
    if (PageName == "/AllSentEmails") {
      if (ID != "" && ID != null) {
        history.push("/AllSentEmails", ID);
      } else {
        history.push("/AllSentEmails");
      }
    }
    if (PageName == "/UnansweredReplies") {
      if (ID != "" && ID != null) {
        history.push("/UnansweredReplies", ID);
      } else {
        history.push("/UnansweredReplies");
      }
    }
  };

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetAllTotalCount(UserDetails.ClientID, UserDetails.UserID)
    GetEmailTotalRecords(UserDetails.ClientID, UserDetails.UserID)
    GetSentEmailsTotalRecords(UserDetails.ClientID, UserDetails.UserID)
    GetAllSentEmailsTotalCount(UserDetails.ClientID, UserDetails.UserID)
    GetTotalRecordCount(UserDetails.ClientID, UserDetails.UserID)
    OnLoad()
  }

  const OnLoad = () => {

    var SelectedPage = props.menupage;
    const NavigationID = localStorage.getItem("NavigationID")
    var SelectedID = NavigationID


    if (SelectedPage == undefined) {
      SetSelectMenuItem("/AllInbox")
      setNavOpen(true);
      setNavOneOpen(true);
      setopenstarredNew(false);
    } else {
      if (SelectedID == "") {
        SetSelectMenuItem(SelectedPage)

        if (SelectedPage == "/AllInbox" || SelectedPage == "/UnansweredResponses") {
          setNavOpen(true);
          setNavOneOpen(true);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/Starred") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/Spam") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/OtherInboxPage") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/FollowUpLater") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/Drafts") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(false);
        }
        if (SelectedPage == "/AllSentEmails" || SelectedPage == "/UnansweredReplies") {
          setNavOpen(true);
          setNavOneOpen(false);
          setopenstarredNew(true);
        }
      }
      else {
        var pageid = SelectedPage + SelectedID
        SetSelectMenuItem(pageid)
        if (pageid == "/AllInbox" + SelectedID || pageid == "/UnansweredResponses" + SelectedID) {

          handleClick("0" + SelectedID, 0)
          handleOneClick("1" + SelectedID, 0)

        }

        if (pageid == "/Starred" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/Spam" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/OtherInboxPage" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/FollowUpLater" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/Drafts" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/AllSentEmails" + SelectedID || pageid == "/UnansweredReplies" + SelectedID) {
          if (SelectedID != undefined) {
            handleClick("0" + SelectedID, 0)
            OnehandleClickOutBox("2" + SelectedID, 0)
          }
        }
      }
    }
  }

  // Get All Sent Emails Total Count
  const GetAllSentEmailsTotalCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/sent_email_history/AllTotalRecords",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetAllSentTotalRecords(Result.data)
      } else {
        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  // Get Total Total Record Count
  const GetTotalRecordCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
      IsInbox: false,
      IsStarred: false,
      IsFollowUp: false,
      IsSpam: false,
      IsOtherInbox: true,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/AllInboxTotalRecordCount",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.TotalCount >= 0) {
          SetTotalCount(Result.data);
        } else {
          SetTotalCount(0);
          toast.error(Result?.data?.Message);
        }
      }
    })
    LoaderHide()
  }

  const GetAllTotalCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
      StartDate: Moment().format("YYYY-MM-DD"),
      EndDate: Moment().format("YYYY-MM-DD"),
      SearchDate: Moment().format("YYYY-MM-DD"),
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/AllTotalRecords",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetAllTotalRecords(Result.data)
      } else {
        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  const GetEmailTotalRecords = (CID, UID) => {

    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
      SearchDate: Moment().format("YYYY-MM-DD")
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetEmailTotalRecords",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetEmailTotalRecords(Result.data)
      } else {
        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  const GetSentEmailsTotalRecords = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/sent_email_history/GetEmailsTotalRecords",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetSentEmailTotalRecords(Result.data)
      } else {
        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  // Get Client Dropdown
  const GetClientDropdown = () => {
    var UserID
    var Details = GetUserDetails();
    if (Details != null) {
      UserID = Details.UserID
      SetUserImage(Details.UserImage)
    }
    var Data = {
      UserID: UserID,
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/client/GetClientListForTopDropDown",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.Data.length > 0) {
          SetClientDropdown(Result.data.Data);
          if (Details.ClientID == null) {
            UpdateUserDetails((Result.data.Data[0].ClientID))
            SetSelectedClient(Result.data.Data[0]._id)
          }
          else {
            SetSelectedClient(Details.ClientID)
            FromEmailList(Details.ClientID, Details.UserID);

          }
        }
        else {
          UpdateUserDetails('')
          FromEmailList('');
        }
      } else {
        toast.error(Result?.data?.Message);
      }
    });


  }

  // Select Client
  const SelectClient = (e) => {
    SetSelectedClient(e.target.value)
    UpdateUserDetails(e.target.value)
    ClientChnage()
  }

  const OnehandleClick = () => {
    setNavOpen(!navopen);

    SetEID(0);
  };

  const handleOneClick = (item, cnt) => {
    if (cnt == 0) {
      SetEOpenID(item)
    } else {
      SetEOpenID(OpemID !== item ? item : "")
    }
    SetOutBoxID("0")
  }

  const handleClick = (itemID, cnt) => {
    setNavOpen(false);

    if (cnt == 0) {
      SetEID(itemID)
    } else {
      SetEID(EID !== itemID ? itemID : "");
    }

  };

  const OnehandleClickInOne = () => {
    setNavOneOpen(!navopenone);
    setopenstarredNew(!openstarred);
  };

  const OnehandleClickInNew = () => {
    setNavOneOpenNew(!navopenonenew);
  };
  const OnehandleClickStarred = () => {
    setopenstarredNew(!openstarred);
    setNavOneOpen(!navopenone);
  };

  const OnehandleClickOutBox = (ids, cnt) => {
    if (cnt == 0) {
      SetOutBoxID(ids)
    } else {
      SetOutBoxID(OutBoxID !== ids ? ids : "");
    }
    SetEOpenID("0")
  };

  // Start From Email List
  const FromEmailList = (CID, UID) => {

    var Data = {
      ClientID: CID,
      UserID: UID
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
          // toast.error(<div>Unanswered Responses <br />Please add email configuration.</div>)
        }
      }
      else {
        SetFromEmailDropdownList([]);
        toast.error(Result?.data?.Message);
      }
    });
    // const items = JSON.parse(localStorage.getItem('items'));
    // if (items) {
    //   SetExpanded(items);
    // }

  }

  // const RedirectLink = (ID, PageName, MenuID) => {
  //   if (PageName == "Unanswered Responses") {
  //     if (ID != "" && ID != null) {
  //       history.push("/UnansweredResponses", ID);
  //     } else {
  //       history.push("/UnansweredResponses");
  //     }
  //   }
  //   if (PageName == "Starred") {
  //     if (ID != "" && ID != null) {
  //       history.push("/Starred", ID);
  //     } else {
  //       history.push("/Starred");
  //     }
  //   }
  //   if (PageName == "Follow Up Later") {
  //     if (ID != "" && ID != null) {
  //       history.push("/FollowUpLater", ID);
  //     }
  //     else {
  //       history.push("/FollowUpLater");
  //     }
  //   }
  //   if (PageName == "Draft") {
  //     if (ID != "" && ID != null) {

  //       history.push("/Drafts", ID);
  //     } else {
  //       history.push("/Drafts");
  //     }
  //   }
  //   if (PageName == "Other Inbox") {
  //     if (ID != "" && ID != null) {
  //       history.push("/OtherInboxPage", ID);
  //     } else {
  //       history.push("/OtherInboxPage");
  //     }
  //   }
  //   if (PageName == "Spam") {
  //     if (ID != "" && ID != null) {
  //       history.push("/Spam", ID);
  //     } else {
  //       history.push("/Spam");
  //     }
  //   }
  //   if (PageName == "AllInbox") {
  //     if (ID != "" && ID != null) {
  //       history.push("/AllInbox", ID);
  //     } else {
  //       history.push("/AllInbox");
  //     }
  //   }
  //   // if (PageName == "AllInbox") {
  //   //   if (ID != "" && ID != null) {
  //   //     if (history.location.pathname === "/AllInbox") {
  //   //       window.location.href = "http://localhost:3001/AllInbox?" + encodeURIComponent(JSON.stringify(ID))
  //   //     }
  //   //   } else {
  //   //     window.location.href = "http://localhost:3001/AllInbox"
  //   //   }
  //   // }
  //   if (PageName == "AllSent") {
  //     if (ID != "" && ID != null) {
  //       history.push("/AllSentEmails", ID);
  //     } else {
  //       history.push("/AllSentEmails");
  //     }
  //   }
  //   if (PageName == "UnansweredReplies") {
  //     if (ID != "" && ID != null) {
  //       history.push("/UnansweredReplies", ID);
  //     } else {
  //       history.push("/UnansweredReplies");
  //     }
  //   }
  //   var items = ['1', '2', '11']
  //   // localStorage.setItem("items", JSON.stringify(items));
  //   SetExpanded(items);
  // }

  const WrapperRef = useRef(null);
  useOutsideAlerter(WrapperRef);

  return (
    <Box sx={{ display: 'flex' }}>
      <Link to="/ProfileSetting"><div className='profilebox'>
        <img src={Usericon} />
      </div></Link>

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
            <li><a href="/Templates">Templates</a></li>
            <li><a href="/ObjectionTemplate">Objections</a></li>
            <li><a href="/EmailConfiguration">Email Settings</a></li>
            <li><a href="/ClientList">Clients</a></li>
            <li><a href="/ContactEmail">Contacts</a></li>
            <li><a href="/">Logout</a></li>
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
        <FormControl className='clientselc'>

          <Select
            value={SelectedClient}
            onChange={SelectClient}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="">
              <em>Select Client</em>
            </MenuItem>
            {ClientDropdown?.map((row) => (
              <MenuItem value={row?.ClientID}>{row?.Name}</MenuItem>

            ))}
          </Select>
        </FormControl>


        <List sx={{ pl: 0 }} className='listclick'>
          <ListItemButton onClick={OnehandleClick}>
            {navopen ? <ExpandMore /> : <ExpandDown />}
            <b>All Accounts</b>
          </ListItemButton>

          <Collapse in={navopen} timeout="auto" unmountOnExit>
            <List component="div">

              <List component="div">
                <ListItemButton sx={{ pl: 2 }} onClick={OnehandleClickInOne}>
                  {navopenone ? <ExpandMore /> : <ExpandDown />} Inbox
                </ListItemButton>

                <Collapse in={navopenone} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>

                    <ListItem button sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllInbox")}
                      component={Link}
                      selected={SelectMenuItem === "/AllInbox"}>
                      {TotalCount?.ReceiveEmailHistoryData != undefined ? "All Inbox(" + TotalCount?.ReceiveEmailHistoryData?.map((e) => e.count)?.reduce((a, b) => a + b, 0) + ")" : "All Inbox(0)"}
                    </ListItem>

                    <ListItem sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredResponses")}
                      component={Link}
                      selected={SelectMenuItem === "/UnansweredResponses"}>
                      {AllTotalRecords?.AllStarredCount != undefined ? "Unanswered Responses(" + AllTotalRecords?.AllUnansweredResponsesCount + ")" : "Unanswered Responses(0)"}
                    </ListItem>

                  </List>
                </Collapse>
              </List>


              <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Starred")}
                component={Link}
                selected={SelectMenuItem === "/Starred"}>
                {AllTotalRecords?.AllStarredCount != undefined ? "Starred(" + AllTotalRecords?.AllStarredCount + ")" : "Starred(0)"}
              </ListItemButton>

              <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Spam")}
                component={Link}
                selected={SelectMenuItem === "/Spam"}>
                {AllTotalRecords?.AllSpamCount != undefined ? "Spam(" + AllTotalRecords?.AllSpamCount + ")" : "Spam(0)"}
              </ListItemButton>

              <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/OtherInboxPage")}
                component={Link}
                selected={SelectMenuItem === "/OtherInboxPage"}>
                {AllTotalRecords?.AllOtherInboxCount != undefined ? "Other Inbox(" + AllTotalRecords?.AllOtherInboxCount + ")" : "Other Inbox(0)"}
              </ListItemButton>

              <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/FollowUpLater")}
                component={Link}
                selected={SelectMenuItem === "/FollowUpLater"}>
                {AllTotalRecords?.AllFollowUpLaterCount != undefined ? "Follow Up Later(" + AllTotalRecords?.AllFollowUpLaterCount + ")" : "Follow Up Later(0)"}
              </ListItemButton>

              <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Drafts")}
                component={Link}
                selected={SelectMenuItem === "/Drafts"}>
                {AllTotalRecords?.AllDraftCount != undefined ? "Drafts(" + AllTotalRecords?.AllDraftCount + ")" : "Drafts(0)"}
              </ListItemButton>

              <List component="div">
                <ListItemButton sx={{ pl: 2 }} onClick={OnehandleClickStarred}>
                  {openstarred ? <ExpandMore /> : <ExpandDown />}
                  OutBox
                </ListItemButton>

                <Collapse in={openstarred} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>

                    <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllSentEmails")}
                      component={Link} to="/AllSentEmails"
                      selected={SelectMenuItem === "/AllSentEmails"}>
                      {AllSentTotalRecords?.AllSentEmailsCount != undefined ? "All Sent(" + AllSentTotalRecords?.AllSentEmailsCount + ")" : "All Sent(0)"}
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredReplies")}
                      component={Link} to="/UnansweredReplies"
                      selected={SelectMenuItem === "/UnansweredReplies"}>
                      {AllSentTotalRecords?.AllUnansweredRepliesCount != undefined ? "Unanswered Replies(" + AllSentTotalRecords?.AllUnansweredRepliesCount + ")" : "Unanswered Replies(0)"}
                    </ListItemButton>

                  </List>
                </Collapse>
              </List>

            </List>
          </Collapse>
        </List>

        {FromEmailDropdownList?.map((item) => (
          <List sx={{ pl: item._id }} className='listclick'>
            <ListItemButton onClick={() => handleClick("0" + item._id, 1)} key={"0" + item._id}>
              {EID == "0" + item._id ? <ExpandMore /> : <ExpandDown />}
              <b>{item.Email}</b>
            </ListItemButton>

            <Collapse in={EID == "0" + item._id} timeout="auto" unmountOnExit>
              <List component="div">

                <List component="div">
                  <ListItemButton sx={{ pl: item._id }} onClick={() => handleOneClick("1" + item._id, 1)} key={"1" + item._id}>
                    {OpemID == "1" + item._id ? <ExpandMore /> : <ExpandDown />} Inbox
                  </ListItemButton>

                  <Collapse in={OpemID == "1" + item._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                      <ListItem button sx={{ pl: item._id }} onClick={(event) => handleListItemClick(event, "/AllInbox", item._id)}
                        component={Link}
                        selected={SelectMenuItem === "/AllInbox" + item._id}>
                        {TotalCount?.ReceiveEmailHistoryData?.filter((e) => e._id == item.AccountID)[0]?.count != undefined ? `All Inbox (` + TotalCount?.ReceiveEmailHistoryData?.filter((e) => e._id == item.AccountID)[0]?.count + `)` : `All Inbox (` + 0 + `)`}
                      </ListItem>

                      <ListItem sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredResponses", item._id)}
                        component={Link}
                        selected={SelectMenuItem === "/UnansweredResponses" + item._id}>
                        {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsUnanswered == undefined ? `Unanswered Responses (0)` : `Unanswered Responses (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsUnanswered + `)`}
                      </ListItem>

                    </List>
                  </Collapse>
                </List>

                <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/Starred", item._id)}
                  component={Link}
                  selected={SelectMenuItem === "/Starred" + item._id}>
                  {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsStarred == undefined ? `Starred (0)` : `Starred (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsStarred + `)`}
                </ListItemButton>

                <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/Spam", item._id)}
                  component={Link}
                  selected={SelectMenuItem === "/Spam" + item._id}>
                  {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsSpam == undefined ? `Spam (0)` : `Spam (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsSpam + `)`}
                </ListItemButton>

                <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/OtherInboxPage", item._id)}
                  component={Link}
                  selected={SelectMenuItem === "/OtherInboxPage" + item._id}>
                  {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsOtherInbox == undefined ? `Other Inbox (0)` : `Other Inbox (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsOtherInbox + `)`}
                </ListItemButton>

                <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/FollowUpLater", item._id)}
                  component={Link}
                  selected={SelectMenuItem === "/FollowUpLater" + item._id}>
                  {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsFollowUp == undefined ? `Follow Up Later (0)` : `Follow Up Later (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsFollowUp + `)`}
                </ListItemButton>


                <List component="div">
                  <ListItemButton sx={{ pl: 2 }} onClick={() => OnehandleClickOutBox("2" + item._id, 1)} key={"2" + item._id}>
                    {OutBoxID == "2" + item._id ? <ExpandMore /> : <ExpandDown />}
                    OutBox
                  </ListItemButton>
                </List>
                <Collapse in={OutBoxID == "2" + item._id} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>

                    <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllSentEmails", item._id)}
                      component={Link}
                      selected={SelectMenuItem === "/AllSentEmails" + item._id}>
                      {SentEmailTotalRecords?.AllSentEmailsCount.filter((e) => e._id === item.AccountID)[0]?.IsAllSent == undefined ? `All Sent (0)` : `All Sent (` + SentEmailTotalRecords?.AllSentEmailsCount.filter((e) => e._id === item.AccountID)[0]?.IsAllSent + `)`}
                    </ListItemButton>

                    <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredReplies", item._id)}
                      component={Link}
                      selected={SelectMenuItem === "/UnansweredReplies" + item._id}>
                      {SentEmailTotalRecords?.AllUnansweredRepliesCount.filter((e) => e._id === item.AccountID)[0]?.IsUnansweredReplies == undefined ? `Unanswered Replies (0)` : `Unanswered Replies (` + SentEmailTotalRecords?.AllUnansweredRepliesCount.filter((e) => e._id === item.AccountID)[0]?.IsUnansweredReplies + `)`}
                    </ListItemButton>

                  </List>
                </Collapse>
              </List>
            </Collapse>
          </List>
        ))}

        {/* 
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













