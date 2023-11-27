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

import Xlogo from "../../images/Xlogo.png";
import Usericon from '../../images/icons/users.svg';
import Template from '../../images/icons/template.svg';
import EmailSettings from '../../images/icons/email-settings.svg';
import RightObjection from '../../images/icons/right-objection.svg';
import Client from '../../images/icons/users.svg';
import Contact from '../../images/icons/contact-email.svg';
import Logouticon from '../../images/icons/logout.svg';


import ExpandDown from '@material-ui/icons/NavigateNext';
import ArrowRight from '@material-ui/icons/ExpandMore';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SettingsIcon from '@material-ui/icons/Settings';
import { Link } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import { history } from "../../_helpers";
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CheckIcon from '@material-ui/icons/Check';


import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// import io from 'socket.io-client';

import { UpdateUserDetails, GetUserDetails, Logout, ClientChnage, LoaderHide, LoaderShow, Locate } from '../../_helpers/Utility'


import IntroJs from 'intro.js';
import 'intro.js/introjs.css';
import { IntroJsReact } from 'react-intro.js';

import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Add, Close } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Popover from '@mui/material/Popover';

import Emailinbox from '../../images/email_inbox_img.png';
import { HexColorPicker } from "react-colorful";
import { Height } from '@mui/icons-material';
import Menu from '@mui/material/Menu';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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



// const socket = io("http://localhost:3006", { transports: ['websocket', 'polling', 'flashsocket'] });

export default function Navigation(props) {
  const { index, window } = props;
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
  const [navopenlabelsone, setNavOneLabelOpen] = React.useState(true);
  const [openAlllabels, setopenAllLabels] = React.useState(true);
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
  const [LabelID, SetLabelID] = React.useState("");
  const [DraftTotalCount, SetDraftTotalCount] = useState()
  const [SpamTotalCount, SetSpamTotalCount] = useState()
  const [SpamEmailCount, SetSpamEmailTotalCount] = useState()
  const [count, setCount] = useState(0)
  const [LabelNameError, SetLabelNameError] = useState("");

  const location = useLocation()
  const dispatch = useDispatch();

  const unSeenInboxCount = useSelector(state => state.unSeenInboxCount);
  const unSeenFocusedCount = useSelector(state => state.unSeenFocusedCount);
  const unSeenStarredCount = useSelector(state => state.unSeenStarredCount);
  const unSeenSpamCount = useSelector(state => state.unSeenSpamCount);
  const unSeenOtherInboxCount = useSelector(state => state.unSeenOtherInboxCount);
  const unSeenFollowUpLaterCount = useSelector(state => state.unSeenFollowUpLaterCount);
  const emailAccounts = useSelector(state => state.emailAccounts);
  const refreshClientDetails = useSelector(state => state.refreshClientDetails);
  // console.log(JSON.stringify(emailAccounts));
  const [opento, setOpento] = React.useState(false);
  const [labelID, setLabelId] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [defaultBgColor, setDefaultBgColor] = useState("#ddd");
  const [dotanchorEl, setdotAnchorEl] = React.useState(null);
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  const [labelContentVisibility, setLabelContentVisibility] = useState({});
  const [AllEmailLabelsData, SetAllEmailLabelsData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colorLabelId, setcolorLabelId] = useState("");
  const [selectedAccountID, setSelectedAccountID] = useState("");
  const [IsColorSet, setIsColorSet] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorMenuEl, setAnchorMenuEl] = React.useState(null);
  const [DeletePopModel, SetDeletePopModel] = useState(false);
  const [SelectedLabelName, SetSelectedLabelName] = useState("")

  // local
  // var NotificationBackendUrl = CommonConstants.SSEIP
  //dev
  var NotificationBackendUrl = "https://databackend.maxbox.com:3006";
  // live
  // var NotificationBackendUrl = "https://appbackend.maxbox.com:3006";

  const handleLabelMenuClick = (event) => {
    setAnchorMenuEl(event.currentTarget);
    setcolorLabelId(event.currentTarget.getAttribute('labelid'));
    setSelectedColor(event.currentTarget.getAttribute('labelcolorcode'));
    setSelectedAccountID(event.currentTarget.getAttribute('accountid'));
  };
  const handleLabelMenuClose = () => {
    setAnchorMenuEl(null);
  };

  const handleColorClick = (event) => {
    setAnchorEl(event.currentTarget);
    setcolorLabelId(event.currentTarget.getAttribute('labelid'));
    setSelectedColor(event.currentTarget.getAttribute('labelcolorcode'));
    setSelectedAccountID(event.currentTarget.getAttribute('accountid'));
    setAnchorMenuEl(null);
  };

  const handleColorClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const colorhandleChange = (AccountID, labelId, labelColorCode) => {
    setLabelId(labelId);
    setBgColor(labelColorCode);
    setAnchorEl(null);
    setAnchorMenuEl(null);
    var Data = {
      AccountID: AccountID,
      RecieverEmailLableID: labelId,
      LabelColorCode: labelColorCode
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receiver_email_labels/ReceiverEmailLabelsAddColor",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        toast.success(Result?.data?.Message);
        setIsColorSet(true);
      } else {
        toast.error(Result?.data?.Message);
      }
    });
  };

  const handleLabelRemove = (event) => {
    var RecieverEmailLableID = event.currentTarget.getAttribute('labelid');
    var AccountID = event.currentTarget.getAttribute('accountid');
    var Data = {
      AccountID: AccountID,
      RecieverEmailLableID: RecieverEmailLableID
    };
    LoaderShow();
    setAnchorMenuEl(null);
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receiver_email_labels/ReceiverEmailLabelRemove",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        LoaderHide();
        CloseDeletePopModel();
        setAnchorMenuEl(null);
        toast.success(Result?.data?.Message);
        dispatch({ type: "refreshClientDetails", payload: true });
      } else {
        LoaderHide();
        CloseDeletePopModel()
        toast.error(Result?.data?.Message);
      }
    });
  }



  const OpenDeletePopModel = (event) => {
    SetDeletePopModel(true);
    var RecieverEmailLableID = event.currentTarget.getAttribute('labelid');
    var AccountID = event.currentTarget.getAttribute('accountid');
    var Data = {
      AccountID: AccountID,
      RecieverEmailLableID: RecieverEmailLableID
    };
    LoaderShow();
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receiver_email_labels/LabelGetById",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetSelectedLabelName(Result.data.Data.LabelName.length > 10 ? Result.data.Data.LabelName.slice(0,10) + '...' : Result.data.Data.LabelName)
        LoaderHide()
      } else {
        toast.error("Error while Removing Label, Please try again!")
        LoaderHide()
        SetDeletePopModel(false);
        setAnchorMenuEl(null);
      }
    });
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
    LoaderHide()
    setAnchorMenuEl(null);
  }

  const labelhandleOpen = () => {
    setOpento(true);
    SetLabelNameError("");
  };
  const labelhandleClose = () => {
    setOpento(false);
    SetLabelNameError("");
  };

  const FromValidation = () => {
    var Isvalid = true;
    var LabelName = document.getElementById("LabelId").value;

    if (LabelName === "") {
      SetLabelNameError("Please enter label name");
      Isvalid = false
    }

    return Isvalid;
  };

  const AddNewLabel = (AccountID) => {
    const Valid = FromValidation();
    var LabelName = document.getElementById("LabelId").value;
    if (Valid) {
      var Data = {
        AccountID: AccountID,
        LabelName: LabelName
      };
      LoaderShow();
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receiver_email_labels/ReceiverEmailLabelsAdd",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          labelhandleClose();
          LoaderHide();
          toast.success(Result?.data?.Message);
          var Details = GetUserDetails();
          FromEmailList(Details.ClientID, Details.UserID);
        } else {
          LoaderHide();
          labelhandleClose();
          toast.error(Result?.data?.Message);
        }
      });
    }
  }

  useEffect(() => {
    // var UserDetails = GetUserDetails();
    // socket.emit('joinRoom', UserDetails.UserID);
    GetClientDropdown();
    GetClientID()
    setCount(count + 1)
  }, []);

  useEffect(() => {
    if (IsColorSet) {
      var Details = GetUserDetails();
      FromEmailList(Details.ClientID, Details.UserID);
      setIsColorSet(false);
    }
  }, [IsColorSet]);

  useEffect(() => {
    if (refreshClientDetails) {
      RefreshClientDropdown();
      var Details = GetUserDetails();
      FromEmailList(Details.ClientID, Details.UserID);
      dispatch({ type: "refreshClientDetails", payload: false });
    }
  });

  // Start SSE code 
  useEffect(() => {
    var UserDetails = GetUserDetails();
    var UserId = UserDetails.UserID;
    const eventSource = new EventSource(`${NotificationBackendUrl}/see/${UserId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      SendNotification(data);
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  // SSE code end

  const SendNotification = async (data) => {
    var msg = data.message.split("@@@");
    const NavigationID = localStorage.getItem("NavigationID")
    var SelectedID = NavigationID

    var Details = GetUserDetails();
    FromEmailList(Details.ClientID, Details.UserID);
    GetClientDropdown();
    let ClientName
    var IsNotificationOn = false;
    let Data = {
      ID: Details.ClientID
    };

    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/client/ClientGetByID",
      method: "POST",
      data: Data,
    });
    await ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        ClientName = Result?.data?.Data[0]?.Name
        IsNotificationOn = Result?.data?.Data[0]?.IsNotificationOn;
      }
    });

    var LoginData = localStorage.getItem("LoginData")
    if (LoginData != null) {
      if (msg[1] == "inboxnotification") {
        // toast.error(msg[0]?.length > 10 ? 'Client :' + msg[0]?.slice(0, 10) + '...' + ' ' + '(' + msg[4] + ')'+ 'Subject :' + msg[3] : 'Client :' + msg[0] + ' ' + '(' + msg[4] + ')' + 'Subject :' + msg[3], {
        //   className: 'toast-message emailicon',
        // });
        const clientName = `${msg[0]}`;
        const subject = `${msg[3]}`;
        const email = `(${msg[4]})`;
        const maxClientNameLength = 10;
        const maxSubjectLength = 30;

        const truncatedClientName = msg[0]?.length > maxClientNameLength
          ? `${clientName.slice(0, maxClientNameLength)}...`
          : clientName;

        const truncatedSubject = msg[3]?.length > maxSubjectLength
          ? `${subject.slice(0, maxSubjectLength)}...`
          : subject;

        // toast.error(<div>{truncatedClientName} {email} <br />{truncatedSubject == "undefined" || truncatedSubject == "" ? "" : truncatedSubject} </div>, { className: 'toast-message emailicon' });
        if (IsNotificationOn) {
          toast.error(<div>{truncatedClientName} {email} <br />{truncatedSubject == "undefined" || truncatedSubject == "" ? "" : truncatedSubject} </div>, { className: 'toast-message emailicon' });
        }
      } else if (msg[1] == "spamnotification") {
        // toast.error(msg[1]?.length > 10 ? msg[1]?.slice(0, 10) + '...' + ' : You have new email for spam' : msg[1] + " : You have new email for spam");
        // if (IsNotificationOn) {
          // toast.error(msg[1]?.length > 10 ? msg[1]?.slice(0, 10) + '...' + ' : You have new email for spam' : msg[1] + " : You have new email for spam");
        // }
      }

      if (SelectedID != "" && SelectedID != null && SelectedID != "undefined") {
        if (msg[1] == "inboxnotification" && msg[2] == SelectedID) {
          // toast.error(msg[0] + " : You have new email for inbox", {
          //   className: 'toast-message emailicon',
          // });

          var element = document.getElementById("AllInoxRefreshpanel");
          var SelectedClientID = document.getElementById("selectedclientid").textContent

          const RemoveCountsSelectedClientID = SelectedClientID.replace(/\s*\(\d+\)/, '')

          if (ClientName == msg[0]) {
            element.classList.add("roundgreenemail");
          }
          else {
            element.classList.remove("roundgreenemail");
          }

          var element = document.getElementById("AllInoxRefreshpanel")
          element.style.display = "block";
        }
        else if (msg[1] == "spamnotification" && msg[2] == SelectedID) {
          // toast.error(msg[0] + " : You have new email for spam");
          var element = document.getElementById("AllSpamRefreshpanel", {
            className: 'toast-message emailicon'
          });

          var element = document.getElementById("AllSpamRefreshpanel");
          var SelectedClientID = document.getElementById("selectedclientid").textContent

          const RemoveCountsSelectedClientID = SelectedClientID.replace(/\s*\(\d+\)/, '')

          if (ClientName == msg[0]) {
            element.classList.add("roundgreenemail");
          }
          else {
            element.classList.remove("roundgreenemail");
          }

          element.style.display = "block";
        }
      } else {
        if (msg[1] == "inboxnotification") {
          // toast.error(msg[0] + " : You have new email for inbox", {
          //   className: 'toast-message emailicon',
          // });

          var element = document.getElementById("AllInoxRefreshpanel");
          var SelectedClientID = document.getElementById("selectedclientid").textContent

          const RemoveCountsSelectedClientID = SelectedClientID.replace(/\s*\(\d+\)/, '')

          if (ClientName == msg[0]) {
            element.classList.add("roundgreenemail");
          }
          else {
            element.classList.remove("roundgreenemail");
          }

          var element = document.getElementById("AllInoxRefreshpanel")
          element.style.display = "block";
        }
        else if (msg[1] == "spamnotification") {
          // toast.error(msg[0] + " : You have new email for spam");
          var element = document.getElementById("AllSpamRefreshpanel", {
            className: 'toast-message emailicon'
          });

          var element = document.getElementById("AllSpamRefreshpanel");
          var SelectedClientID = document.getElementById("selectedclientid").textContent

          const RemoveCountsSelectedClientID = SelectedClientID.replace(/\s*\(\d+\)/, '')

          if (ClientName == msg[0]) {
            element.classList.add("roundgreenemail");
          }
          else {
            element.classList.remove("roundgreenemail");
          }

          element.style.display = "block";
        }
      }
    }

  }

  /* useEffect(() => {
    const handleMessage = (message, roomid) => {
      var msg = message.split("_");
      var Details = GetUserDetails();
      FromEmailList(Details.ClientID, Details.UserID);
      if (msg[1] == "inboxnotification") {
        toast.error(msg[0] + " : You have new email for inbox", {
          className: 'toast-message emailicon',
        });
 
        var element = document.getElementById("AllInoxRefreshpanel");
        var SelectedClientID = document.getElementById("selectedclientid").textContent
 
        if (SelectedClientID == msg[0]) {
          element.classList.add("roundgreenemail");
        }
        else {
          element.classList.remove("roundgreenemail");
        }
 
        var element = document.getElementById("AllInoxRefreshpanel")
        element.style.display = "block";
      }
      else if(msg[1] == "spamnotification"){
        toast.error(msg[0]+" : You have new email for spam");
        var element = document.getElementById("AllSpamRefreshpanel", {
          className: 'toast-message emailicon'
        });
        element.style.display = "block";
      }
    };
    // Add the event listener when the component mounts
    socket.on('message', handleMessage);
    // Remove the event listener when the component unmounts
    return () => {
      socket.off('message', handleMessage);
    };
  }, []); // Empty dependency array to ensure the effect runs only once */

  const handleListItemClick = (event, PageName, ID) => {
    if (ID != undefined && ID != "") {
      var pg = PageName + ID
      SetSelectMenuItem(pg);
      localStorage.setItem("NavigationID", ID)
    } else {
      SetSelectMenuItem(PageName);
      localStorage.setItem("NavigationID", "")
    }
    // if (PageName == "/UnansweredResponses") {
    //   if (ID != "" && ID != null) {
    //     history.push("/UnansweredResponses", ID);
    //   } else {
    //     history.push("/UnansweredResponses");
    //   }
    // }

    // 

    // if (PageName == "/OtherInboxPage") {
    //   if (ID != "" && ID != null) {
    //     history.push("/OtherInboxPage", ID);
    //   } else {
    //     history.push("/OtherInboxPage");
    //   }
    // }
    if (PageName == "/AllInbox") {
      if (ID != "" && ID != null) {
        history.push("/AllInboxByID/" + ID);
        // history.push({ pathname: "/AllInboxByID/" + ID, });
        // Locate(PageName, ID)
      } else {
        history.push("/AllInbox");
        // Locate(PageName, "")
        // history.push({ pathname: "/AllInbox" });
      }
    }
    if (PageName == "/Focused") {
      if (ID != "" && ID != null) {
        history.push("/FocusedByID/" + ID);
      } else {
        history.push("/Focused");
      }
    }
    if (PageName == "/Starred") {
      if (ID != "" && ID != null) {
        history.push("/StarredByID/" + ID);
      } else {
        history.push("/Starred");
      }
    }
    if (PageName == "/Spam") {
      if (ID != "" && ID != null) {
        history.push("/SpamByID/" + ID);
      } else {
        history.push("/Spam");
      }
    }
    if (PageName == "/OtherInboxPage") {
      if (ID != "" && ID != null) {
        history.push("/OtherInboxByID/" + ID);
      } else {
        history.push("/OtherInboxPage");
      }
    }
    if (PageName == "/FollowUpLater") {
      if (ID != "" && ID != null) {
        history.push("/FollowUpLaterByID/" + ID);
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
    if (PageName == "/AllSentEmails") {
      if (ID != "" && ID != null) {
        history.push("/AllSentEmailsByID/" + ID);
      } else {
        history.push("/AllSentEmails");
      }
    }
    if (PageName == "/UnansweredReplies") {
      if (ID != "" && ID != null) {
        history.push("/UnansweredRepliesByID/" + ID);
      } else {
        history.push("/UnansweredReplies");
      }
    }
    if (PageName == "/LabelByID") {
      if (ID != "" && ID != null) {
        history.push("/LabelByID/" + ID);
      }
    }
    if (PageName == "/DraftsByID") {
      if (ID != "" && ID != null) {
        history.push("/DraftsByID/" + ID);
      }
    }
    if (PageName == "/Trash") {
      if (ID != "" && ID != null) {
        history.push("/Trash/" + ID);
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
  };

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    // GetAllTotalCount(UserDetails.ClientID, UserDetails.UserID)
    // GetEmailTotalRecords(UserDetails.ClientID, UserDetails.UserID)
    // GetSpamTotalRecordCount(UserDetails.ClientID, UserDetails.UserID)
    // GetSpamEmailTotalRecords(UserDetails.ClientID, UserDetails.UserID)
    // GetSentEmailsTotalRecords(UserDetails.ClientID, UserDetails.UserID)
    // GetAllSentEmailsTotalCount(UserDetails.ClientID, UserDetails.UserID)
    // GetTotalRecordCount(UserDetails.ClientID, UserDetails.UserID)
    GetDraftTotalRecordCount(UserDetails.ClientID, UserDetails.UserID)
    OnLoad()
  }

  const OnLoad = () => {

    var SelectedPage = location.pathname;
    const NavigationID = localStorage.getItem("NavigationID")
    var SelectedID = NavigationID


    if (SelectedPage == undefined) {
      SetSelectMenuItem("/AllInbox")
      setNavOpen(true);
      setNavOneOpen(true);
      setopenstarredNew(false);
      setNavOneOpenNew(false);
      setopenAllLabels(true);
    } else {
      if (SelectedID == "") {
        SetSelectMenuItem(SelectedPage)

        if (SelectedPage == "/AllInbox" || SelectedPage == "/Focused") {
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
        var output = SelectedPage.substring(0, SelectedPage.indexOf('/', 1));
        var pageid = output + SelectedID

        SetSelectMenuItem(pageid)
        if (pageid == "/AllInboxByID" + SelectedID || pageid == "/FocusedByID" + SelectedID) {

          handleClick("0" + SelectedID, 0)
          handleOneClick("1" + SelectedID, 0)

        }

        if (pageid == "/StarredByID" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/SpamByID" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/OtherInboxPageByID" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/FollowUpLaterByID" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/Drafts" + SelectedID) {
          handleClick("0" + NavigationID, 0);
          handleOneClick("0", 0)
        }
        if (pageid == "/AllSentEmailsByID" + SelectedID || pageid == "/UnansweredRepliesByID" + SelectedID) {
          if (SelectedID != undefined) {
            handleClick("0" + SelectedID, 0)
            OnehandleClickOutBox("2" + SelectedID, 0)
          }
        }
      }
    }
  }

  // Get Draft Total Count
  const GetDraftTotalRecordCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTotalRecordCount",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetDraftTotalCount(Result.data)
      } else {
        toast.error(Result?.data?.Message);
      }
    });
    LoaderHide()
  }

  // Get All Sent Emails Total Count
  const GetAllSentEmailsTotalCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/sent_email_history/AllTotalRecords",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetAllSentTotalRecords(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
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
    // Axios({
    //   url: CommonConstants.MOL_APIURL + "/receive_email_history/AllInboxTotalRecordCount",
    //   method: "POST",
    //   data: Data,
    // }).then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     if (Result.data.TotalCount >= 0) {
    //       SetTotalCount(Result.data);
    //     } else {
    //       SetTotalCount(0);
    //       toast.error(Result?.data?.Message);
    //     }
    //   }
    // })
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
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/receive_email_history/AllTotalRecords",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetAllTotalRecords(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
    LoaderHide()
  }

  const GetEmailTotalRecords = (CID, UID) => {

    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
      SearchDate: Moment().format("YYYY-MM-DD")
    }
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/receive_email_history/GetEmailTotalRecords",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetEmailTotalRecords(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
    LoaderHide()
  }

  //  comment this api because we retrieve counts from email collection that's have no use for this api ~Shubham 
  const GetSentEmailsTotalRecords = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/sent_email_history/GetEmailsTotalRecords",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetSentEmailTotalRecords(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
    LoaderHide()
  }


  const GetSpamTotalRecordCount = (CID, UID) => {
    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamTotalRecordCount",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetSpamTotalCount(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
    LoaderHide()
  }




  const GetSpamEmailTotalRecords = (CID, UID) => {

    LoaderShow()
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    // const ResponseApi = Axios({
    //   url: CommonConstants.MOL_APIURL + "/spamemailhistory/EmailSpamTotalRecordCount",
    //   method: "POST",
    //   data: Data,
    // });
    // ResponseApi.then((Result) => {
    //   if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //     SetSpamEmailTotalCount(Result.data)
    //   } else {
    //     toast.error(Result?.data?.Message);
    //   }
    // });
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
          toast.error("Please add client")
          UpdateUserDetails('')
          FromEmailList('');
        }
      } else {
        toast.error(Result?.data?.Message);
      }
    });


  }

  // Refresh Client Counts
  const RefreshClientDropdown = () => {
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
        }
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

  const handleClick = (itemID, cnt, PageName) => {
    setNavOpen(false);

    if (cnt == 0) {
      SetEID(itemID)
    } else {
      SetEID(EID !== itemID ? itemID : "");
    }

    var NewID = itemID.substring(1);
    handleClick2(NewID, PageName)

  };

  const handleClick2 = (NewID, PageName) => {
    if (NewID != undefined && NewID != "") {
      var pg = PageName + NewID
      SetSelectMenuItem(pg);
      localStorage.setItem("NavigationID", NewID)
    } else {
      SetSelectMenuItem(PageName);
      localStorage.setItem("NavigationID", "")
    }

    if (PageName == "/AllInbox") {
      if (NewID != "" && NewID != null) {
        history.push("/AllInboxByID/" + NewID);
      } else {
        history.push("/AllInbox");
      }
    }
  }

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

  const OnehandleClickAllLabels = () => {
    setopenAllLabels(!openAlllabels);
    setNavOneLabelOpen(!navopenlabelsone);
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
          var labelArray = [];
          var EmailData = Result.data.PageData;
          for (var i = 0; i < EmailData.length; i++) {
            var EmailLabelData = EmailData[i].LabelField
            if (EmailLabelData.length > 0) {
              for (var j = 0; j < EmailLabelData.length; j++) {
                EmailLabelData[j].Email = EmailData[i].Email;
                labelArray.push(EmailLabelData[j]);
              }
            }
          }
          SetAllEmailLabelsData(labelArray);
        } else {
          // toast.error(<div>Please add email configuration.</div>)
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

  const logout = () => {
    localStorage.removeItem("LoginData");
    localStorage.removeItem("id");
    history.push('/login');
  }

  const WrapperRef = useRef(null);
  useOutsideAlerter(WrapperRef);

  // Determine if the current location is the login page
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/Register';
  const isOTPPage = location.pathname === '/OTPConfirm';
  const isForgotPasswordPage = location.pathname === '/Forgetpassword';
  const isConfirmPasswordPage = location.pathname === '/Confirmpassword';

  // Return null if it's the login page to hide the sidebar
  if (isLoginPage || isRegisterPage || isOTPPage || isForgotPasswordPage || isConfirmPasswordPage) {
    return null;
  }

  return (
    <>
      <Modal className="modal-pre"
        open={DeletePopModel}
        onClose={CloseDeletePopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-prein">
          <div className='p-5 text-center'>
            <Typography id="modal-modal-title" className='mt-0' variant="b" component="h3">
              Remove label
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Delete the label "{SelectedLabelName}" ?
            </Typography>
          </div>
          <div className='d-flex btn-50' >
            <button type='button' className='btn btn-pre btn btn-contained btn-medium' labelid={colorLabelId} accountid={selectedAccountID} onClick={handleLabelRemove}>Delete</button>
            <button type='button' className='btn btn-darkpre btn btn-contained btn-medium' onClick={() => { CloseDeletePopModel(); }}>Cancel</button>
          </div>
        </Box>
      </Modal>
      <Box sx={{ display: 'flex' }}>

        {/* <Stack className='alertpostion' spacing={2}>
          <Alert icon={false} severity="success">
              You have new mail 
          </Alert>
        </Stack> */}

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

          <div onClick={addNavClick} id='setting' className='Settingsbd'>
            <SettingsIcon />
          </div>

          <div id='OpenNavigation' className='carsetting'>
            <ul>
              <div className="fore-step"><li><a href="/Templates">
                <img src={Template} width={26} />
                Templates</a></li></div>

              <li><a href="/ObjectionTemplate">
                <img src={RightObjection} width={24} />
                Objections</a>
              </li>

              <div id="two-step"><li><a href="/EmailConfiguration">
                <img src={EmailSettings} width={24} />
                Email account</a></li></div>

              <div className="one-step"><li>
                <a id="one-step" href="/ClientList">
                  <img src={Client} width={21} />
                  Clients</a></li></div>

              <li><a href="/ContactEmail">
                <img src={Contact} width={23} />
                Contacts</a></li>
              {/* <li><a href="/">Logout</a></li> */}
              <li><a onClick={logout}>
                <img src={Logouticon} width={21} />
                Logout</a></li>
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
              id='selectedclientid'
              value={SelectedClient}
              onChange={SelectClient}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value="">
                <em>Select Client</em>
              </MenuItem>
              {ClientDropdown?.map((row, index) => (
                // <MenuItem value={row?.ClientID} key={index}>{row?.Name?.length > 10 ? row?.Name?.slice(0, 10) + '...' : row?.Name} ({row?.PrimaryMailCount})</MenuItem>
                <MenuItem value={row?.ClientID} key={index}>{row?.Name?.length > 10 ? row?.Name?.slice(0, 10) + '...' : row?.Name} ({row?.InboxCount})</MenuItem>
              ))}
            </Select>
          </FormControl>
          {
            FromEmailDropdownList.sort((a, b) => (a.Email > b.Email) ? 1 : ((b.Email > a.Email) ? -1 : 0))?.length == 0 ? "" :
              FromEmailDropdownList.sort((a, b) => (a.Email > b.Email) ? 1 : ((b.Email > a.Email) ? -1 : 0))?.length == 1 ? "" :
                <List sx={{ pl: 0 }} className='listclick'>
                  <ListItemButton onClick={OnehandleClick}>
                    {navopen ? <ExpandMore /> : <ExpandDown />}
                    <b>All Accounts</b>
                    {/* <b>
    {FromEmailDropdownList != undefined ? "All Accounts (" + FromEmailDropdownList?.map((e) => e?.InboxCount)?.reduce((a, b) => a + b, 0) + ")" : "All Accounts (0)"}
  </b> */}
                  </ListItemButton>

                  <Collapse in={navopen} timeout="auto" unmountOnExit>
                    <List component="div">
                      {/* <List component="div">
        <ListItemButton sx={{ pl: 2 }} onClick={OnehandleClickInOne}>
          {navopenone ? <ExpandMore /> : <ExpandDown />} Inbox
        </ListItemButton>

        <Collapse in={navopenone} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>

            <ListItem button sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllInbox")}
              component={Link}
              selected={SelectMenuItem === "/AllInbox"}>
              {
                FromEmailDropdownList
                  ? (() => {
                    let totalInboxCount = 0;

                    FromEmailDropdownList.forEach((account) => {
                      totalInboxCount += account.LabelField?.reduce((acc, label) => {
                        if (label.LableName === "INBOX") {
                          return acc + (label?.TotalLableMailCount - label?.TotalSeenLableMailCount);
                        }
                        return acc;
                      }, 0) || 0;
                    });

                    return `All Inbox(${totalInboxCount})`;
                  })()
                  : "All Inbox(0)"
              }

            </ListItem>
            <ListItem button sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/Focused")}
              component={Link}
              selected={SelectMenuItem === "/Focused"}>
              {FromEmailDropdownList != undefined ? "Focused(" + FromEmailDropdownList?.map((e, index) => e?.FocusedCount - e?.SeenFocusedCount)?.reduce((a, b) => a + b, 0) + ")" : "Focused(0)"}
            </ListItem>

          </List>
        </Collapse>
      </List> */}

                      <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/AllInbox")}
                        component={Link}
                        selected={SelectMenuItem === "/AllInbox"}>
                        {
                          FromEmailDropdownList
                            ? (() => {
                              let totalInboxCount = 0;

                              FromEmailDropdownList.forEach((account) => {
                                totalInboxCount += account.LabelField?.reduce((acc, label) => {
                                  if (label.LableName === "INBOX") {
                                    return acc + (label?.TotalLableMailCount - label?.TotalSeenLableMailCount);
                                  }
                                  return acc;
                                }, 0) || 0;
                              });

                              return `Inbox(${totalInboxCount})`;
                            })()
                            : "Inbox(0)"
                        }
                      </ListItemButton>


                      <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Starred")}
                        component={Link}
                        selected={SelectMenuItem === "/Starred"}>
                        {/* {AllTotalRecords?.AllStarredCount != undefined ? "Starred(" + AllTotalRecords?.AllStarredCount + ")" : "Starred(0)"} */}
                        {/* {FromEmailDropdownList != undefined ? "Starred(" + FromEmailDropdownList?.map((e, index) => e?.StarredCount)?.reduce((a, b) => a + b, 0) + ")" : "Starred(0)"} */}
                        {FromEmailDropdownList != undefined ? "Starred(" + FromEmailDropdownList?.map((e, index) => e?.StarredCount - e?.SeenStarredCount)?.reduce((a, b) => a + b, 0) + ")" : "Starred(0)"} {/* display only unseen mail count */}
                        {/* {unSeenStarredCount != null ? "Starred(" + unSeenStarredCount + ")" : FromEmailDropdownList != undefined ? "Starred(" + FromEmailDropdownList?.map((e, index) => e?.StarredCount - e?.SeenStarredCount)?.reduce((a, b) => a + b, 0) + ")" : "Starred(0)"} */}{/* new code display fron email variable */}
                      </ListItemButton>

                      <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Spam")}
                        component={Link}
                        selected={SelectMenuItem === "/Spam"}>
                        {/* {SpamTotalCount?.TotalCount != undefined ? "Spam(" + SpamTotalCount?.TotalCount + ")" : "Spam(0)"} */}
                        {/* {FromEmailDropdownList != undefined ? "Spam(" + FromEmailDropdownList?.map((e, index) => e?.SpamCount)?.reduce((a, b) => a + b, 0) + ")" : "Spam(0)"} */}
                        {FromEmailDropdownList != undefined ? "Spam(" + FromEmailDropdownList?.map((e, index) => e?.SpamCount - e?.SeenSpamCount)?.reduce((a, b) => a + b, 0) + ")" : "Spam(0)"} {/* display only unseen mail count */}
                        {/* {unSeenSpamCount != null ? "Spam(" + unSeenSpamCount + ")" : FromEmailDropdownList != undefined ? "Spam(" + FromEmailDropdownList?.map((e, index) => e?.SpamCount - e?.SeenSpamCount)?.reduce((a, b) => a + b, 0) + ")" : "Spam(0)"} */}{/* new code display fron email variable */}
                      </ListItemButton>

                      <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/OtherInboxPage")}
                        component={Link}
                        selected={SelectMenuItem === "/OtherInboxPage"}>
                        {/* {AllTotalRecords?.AllOtherInboxCount != undefined ? "Other Inbox(" + AllTotalRecords?.AllOtherInboxCount + ")" : "Other Inbox(0)"} */}
                        {/* {FromEmailDropdownList != undefined ? "Other Inbox(" + FromEmailDropdownList?.map((e, index) => e?.OtherInboxCount)?.reduce((a, b) => a + b, 0) + ")" : "Other Inbox(0)"} */}
                        {FromEmailDropdownList != undefined ? "Other Inbox(" + FromEmailDropdownList?.map((e, index) => e?.OtherInboxCount - e?.SeenOtherInboxCount)?.reduce((a, b) => a + b, 0) + ")" : "Other Inbox(0)"} {/* display only unseen mail count
        {/* {unSeenOtherInboxCount != null ? "Other Inbox(" + unSeenOtherInboxCount + ")" : FromEmailDropdownList != undefined ? "Other Inbox(" + FromEmailDropdownList?.map((e, index) => e?.OtherInboxCount - e?.SeenOtherInboxCount)?.reduce((a, b) => a + b, 0) + ")" : "Other Inbox(0)"} */} {/* new code display fron email variable */}
                      </ListItemButton>

                      <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/FollowUpLater")}
                        component={Link}
                        selected={SelectMenuItem === "/FollowUpLater"}>
                        {/* {AllTotalRecords?.AllFollowUpLaterCount != undefined ? "Follow Up Later(" + AllTotalRecords?.AllFollowUpLaterCount + ")" : "Follow Up Later(0)"} */}
                        {/* {FromEmailDropdownList != undefined ? "Follow Up Later(" + FromEmailDropdownList?.map((e, index) => e?.FollowUpLaterCount)?.reduce((a, b) => a + b, 0) + ")" : "Follow Up Later(0)"} */}
                        {/* {unSeenFollowUpLaterCount != null ? "Follow Up Later(" + unSeenFollowUpLaterCount + ")" : FromEmailDropdownList != undefined ? "Follow Up Later(" + FromEmailDropdownList?.map((e, index) => e?.FollowUpLaterCount)?.reduce((a, b) => a + b, 0) + ")" : "Follow Up Later(0)"} */}
                        {FromEmailDropdownList != undefined ? "Follow Up Later(" + FromEmailDropdownList?.map((e, index) => e?.FollowUpLaterCount - e?.SeenFollowUpLaterCount)?.reduce((a, b) => a + b, 0) + ")" : "Follow Up Later(0)"} {/* display only unseen mail count
        {/* {unSeenFollowUpLaterCount != null ? "Follow Up Later(" + unSeenOtherInboxCount + ")" : FromEmailDropdownList != undefined ? "Follow Up Later(" + FromEmailDropdownList?.map((e, index) => e?.FollowUpLaterCount - e?.SeenFollowUpLaterCount)?.reduce((a, b) => a + b, 0) + ")" : "Follow Up Later(0)"} */} {/* new code display fron email variable */}
                      </ListItemButton>

                      {/* <ListItemButton sx={{ pl: 2 }} onClick={(event) => handleListItemClick(event, "/Drafts")}
        component={Link}
        selected={SelectMenuItem === "/Drafts"}>
        {DraftTotalCount?.TotalCount != undefined ? "Drafts(" + DraftTotalCount?.TotalCount + ")" : "Drafts(0)"}
      </ListItemButton> */}

                      <List component="div">
                        <ListItemButton sx={{ pl: 2 }} onClick={OnehandleClickStarred}>
                          {openstarred ? <ExpandMore /> : <ExpandDown />}
                          Outbox
                        </ListItemButton>

                        <Collapse in={openstarred} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>

                            <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllSentEmails")}
                              component={Link} to="/AllSentEmails"
                              selected={SelectMenuItem === "/AllSentEmails"}>
                              All Sent{/* {FromEmailDropdownList != undefined ? "All Sent(" + FromEmailDropdownList?.map((e, index) => e?.SentCount)?.reduce((a, b) => a + b, 0) + ")" : "All Sent(0)"} */}
                              {/* {AllSentTotalRecords?.AllSentEmailsCount != undefined ? "All Sent(" + AllSentTotalRecords?.AllSentEmailsCount + ")" : "All Sent(0)"} */}
                            </ListItemButton>

                            <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredReplies")}
                              component={Link} to="/UnansweredReplies"
                              selected={SelectMenuItem === "/UnansweredReplies"}>
                              {FromEmailDropdownList != undefined ? "Unanswered(" + FromEmailDropdownList?.map((e, index) => e?.UnansweredRepliesCount)?.reduce((a, b) => a + b, 0) + ")" : "Unanswered(0)"}
                              {/* {AllSentTotalRecords?.AllUnansweredRepliesCount != undefined ? "Unanswered(" + AllSentTotalRecords?.AllUnansweredRepliesCount + ")" : "Unanswered(0)"} */}
                            </ListItemButton>

                          </List>
                        </Collapse>
                      </List>

                      {/* All account label count */}
                      {/* <List component="div">
                        <ListItemButton sx={{ pl: 2 }} onClick={OnehandleClickAllLabels}>
                          {openAlllabels ? <ExpandMore /> : <ExpandDown />}
                          Labels
                        </ListItemButton>

                        <Collapse in={openAlllabels} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {AllEmailLabelsData?.map((label, index) => {
                              if (label.LableName === "INBOX") {
                                return null; // Skip rendering INBOX label
                              }

                              const labelId = label.RecieverEmailLableID;
                              const selected = SelectMenuItem === `/LabelByID${labelId}`;

                              // Calculate the unseen label count based on matching account and label ID
                              let unseenLabelCount = 0;
                              unseenLabelCount = label.TotalLableMailCount - label.TotalSeenLableMailCount;

                              // Calculate the label count for display
                              var displayLabelCount = unseenLabelCount > 0 ? `(${unseenLabelCount})` : "(0)";
                              if (label.LableName == "Trash" || label.LableName == "Bin") {
                                displayLabelCount = "";
                              }
                              return (
                                <>
                                  <ListItemButton
                                    title={label.LableName + " (" + label.Email + ")"}
                                    key={labelId}
                                    sx={{ pl: 4 }}
                                    onClick={(event) => handleListItemClick(event, "/LabelByID", labelId)}
                                    component={Link}
                                    selected={selected}
                                  >
                                    {label.LableName.length > 10 ? label.LableName.slice(0, 10) + '...' + displayLabelCount + " (" + label.Email.slice(0, 15) + '...)' : label.LableName + displayLabelCount + " (" + label.Email.slice(0, 15) + '...)'}
                                  </ListItemButton>
                                </>
                              );
                            })}
                          </List>
                        </Collapse>
                      </List> */}

                    </List>
                  </Collapse>
                </List>
          }

          {FromEmailDropdownList?.map((item, index) => (
            <List sx={{ pl: item._id }} className='listclick' key={index}>
              <ListItemButton
                onClick={() => handleClick("0" + item._id, 1, "/AllInbox")} key={"0" + item._id}
                component={Link}
                selected={SelectMenuItem === "/AllInbox" + item._id}
              >
                {EID == "0" + item._id ? <ExpandMore /> : <ExpandDown />}
                {/* <b>{item.Email} ()</b> */}
                <b>
                  {
                    FromEmailDropdownList
                      ? (() => {
                        let totalInboxCount = 0;

                        FromEmailDropdownList.forEach((account) => {
                          if (account.AccountID == item.AccountID) {
                            totalInboxCount += account.LabelField?.reduce((acc, label) => {
                              if (label.LableName === "INBOX") {
                                return acc + (label?.TotalLableMailCount - label?.TotalSeenLableMailCount);
                              }
                              return acc;
                            }, 0) || 0;
                          }
                        });

                        return `${item.Email}(${totalInboxCount})`;
                      })()
                      : `${item.Email}(0)`
                  }
                </b>
                {/* <b>
                {item.Email}
                {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].InboxCount != undefined ? `(` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].InboxCount + `)` : `(` + 0 + `)`}
              </b> */}
              </ListItemButton>

              <Collapse in={EID == "0" + item._id} timeout="auto" unmountOnExit>
                <List component="div">

                  {/* <List component="div">
                    <ListItemButton sx={{ pl: item._id }} onClick={() => handleOneClick("1" + item._id, 1)} key={"1" + item._id}>
                      {OpemID == "1" + item._id ? <ExpandMore /> : <ExpandDown />} Inbox
                    </ListItemButton>

                    <Collapse in={OpemID == "1" + item._id} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>

                        <ListItem button sx={{ pl: item._id }} onClick={(event) => handleListItemClick(event, "/AllInbox", item._id)}
                          component={Link}
                          selected={SelectMenuItem === "/AllInbox" + item._id}>
                          {
                            FromEmailDropdownList
                              ? (() => {
                                let totalInboxCount = 0;

                                FromEmailDropdownList.forEach((account) => {
                                  if (account.AccountID == item.AccountID) {
                                    totalInboxCount += account.LabelField?.reduce((acc, label) => {
                                      if (label.LableName === "INBOX") {
                                        return acc + (label?.TotalLableMailCount - label?.TotalSeenLableMailCount);
                                      }
                                      return acc;
                                    }, 0) || 0;
                                  }
                                });

                                return `All Inbox(${totalInboxCount})`;
                              })()
                              : "All Inbox(0)"
                          }

                        </ListItem>
                        <ListItem button sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/Focused", item._id)}
                          component={Link}
                          selected={SelectMenuItem === "/Focused" + item._id}>
                          {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FocusedCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFocusedCount != undefined ? "Focused(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FocusedCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFocusedCount) + ")" : "Focused(0)" : "Focused(0)"}                          
                        </ListItem>

                      </List>
                    </Collapse>
                  </List> */}

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/AllInbox", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/AllInbox" + item._id}>
                    {
                      FromEmailDropdownList
                        ? (() => {
                          let totalInboxCount = 0;

                          FromEmailDropdownList.forEach((account) => {
                            if (account.AccountID == item.AccountID) {
                              totalInboxCount += account.LabelField?.reduce((acc, label) => {
                                if (label.LableName === "INBOX") {
                                  return acc + (label?.TotalLableMailCount - label?.TotalSeenLableMailCount);
                                }
                                return acc;
                              }, 0) || 0;
                            }
                          });

                          return `Inbox(${totalInboxCount})`;
                        })()
                        : "Inbox(0)"
                    }
                  </ListItemButton>

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/Starred", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/Starred" + item._id}>
                    {/* {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsStarred == undefined ? `Starred (0)` : `Starred (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsStarred + `)`} */}
                    {/* {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount != undefined ? `Starred (` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount + `)` : `Starred (` + 0 + `)`} */}
                    {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount != undefined ? "Starred(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount) + ")" : "Starred(0)" : "Starred(0)"}{/* display only unseen mail count */}
                    {/* {emailAccounts.length > 0 ? emailAccounts?.map((row, index) => (row.AccountID == item.AccountID ?
                      row.UnSeenStarredCount != undefined ? "Starred(" + row.UnSeenStarredCount + ")" :
                        FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount != undefined ? "Starred(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount) + ")" : "Starred(0)" : "Starred(0)" : "Starred(0)"
                    )) : FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount != undefined ? "Starred(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].StarredCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenStarredCount) + ")" : "Starred(0)" : "Starred(0)"} */}{/* new code display fron email variable */}
                  </ListItemButton>

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/Spam", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/Spam" + item._id}>
                    {/* {SpamEmailCount?.EmailSpamTotalRecordCount.filter((s) => s._id == item.AccountID)[0]?.IsSpam == undefined ? `Spam (0)` : `Spam (` + SpamEmailCount?.EmailSpamTotalRecordCount.filter((s) => s._id == item.AccountID)[0]?.IsSpam + `)`} */}
                    {/* {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount != undefined ? `Spam (` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount + `)` : `Spam (` + 0 + `)`} */}
                    {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount != undefined ? "Spam(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount) + ")" : "Spam(0)" : "Spam(0)"}{/* display only unseen mail count */}
                    {/* {emailAccounts.length > 0 ? emailAccounts?.map((row, index) => (row.AccountID == item.AccountID ?
                      row.UnSeenSpamCount != undefined ? "Spam(" + row.UnSeenSpamCount + ")" :
                        FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount != undefined ? "Spam(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount) + ")" : "Spam(0)" : "Spam(0)" : "Spam(0)"
                    )) : FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount != undefined ? "Spam(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SpamCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenSpamCount) + ")" : "Spam(0)" : "Spam(0)"} */}{/* new code display fron email variable */}
                  </ListItemButton>

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/OtherInboxPage", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/OtherInboxPage" + item._id}>
                    {/* {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsOtherInbox == undefined ? `Other Inbox (0)` : `Other Inbox (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsOtherInbox + `)`} */}
                    {/* {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount != undefined ? `Other Inbox (` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount + `)` : `Other Inbox (` + 0 + `)`} */}
                    {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount != undefined ? "Other Inbox(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount) + ")" : "Other Inbox(0)" : "Other Inbox(0)"}{/* display only unseen mail count */}
                    {/* {emailAccounts.length > 0 ? emailAccounts?.map((row, index) => (row.AccountID == item.AccountID ?
                      row.UnSeenOtherInboxCount != undefined ? "Other Inbox(" + row.UnSeenOtherInboxCount + ")" :
                        FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount != undefined ? "Other Inbox(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount) + ")" : "Other Inbox(0)" : "Other Inbox(0)" : "Other Inbox(0)"
                    )) : FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount != undefined ? "Other Inbox(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].OtherInboxCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenOtherInboxCount) + ")" : "Other Inbox(0)" : "Other Inbox(0)"} */}{/* new code display fron email variable */}
                  </ListItemButton>

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/FollowUpLater", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/FollowUpLater" + item._id}>
                    {/* {EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsFollowUp == undefined ? `Follow Up Later (0)` : `Follow Up Later (` + EmailTotalRecords?.GetEmailTotalRecords.filter((s) => s._id == item.AccountID)[0]?.IsFollowUp + `)`} */}
                    {/* {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount != undefined ? `Follow Up Later(` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount + `)` : `Follow Up Later(`+ 0 +`)`} */}
                    {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount != undefined ? "Follow Up Later(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount) + ")" : "Follow Up Later(0)" : "Follow Up Later(0)"}{/* display only unseen mail count */}
                    {/* {emailAccounts.length > 0 ? emailAccounts?.map((row, index) => (row.AccountID == item.AccountID ?
                      row.UnSeenFollowUpLaterCount != undefined ? "Follow Up Later(" + row.UnSeenFollowUpLaterCount + ")" :
                        FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount != undefined ? "Follow Up Later(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount) + ")" : "Follow Up Later(0)" : "Follow Up Later(0)" : "Follow Up Later(0)"
                    )) : FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount != undefined ? FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount != undefined ? "Follow Up Later(" + (FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].FollowUpLaterCount - FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SeenFollowUpLaterCount) + ")" : "Follow Up Later(0)" : "Follow Up Later(0)"} */}{/* new code display fron email variable */}
                  </ListItemButton>

                  <ListItemButton sx={{ pl: "2" + item._id }} onClick={(event) => handleListItemClick(event, "/DraftsByID", item._id)}
                    component={Link}
                    selected={SelectMenuItem === "/DraftsByID" + item._id}>
                    Drafts
                  </ListItemButton>

                  <List component="div">
                    <ListItemButton sx={{ pl: 2 }} onClick={() => OnehandleClickOutBox("2" + item._id, 1)} key={"2" + item._id}>
                      {OutBoxID == "2" + item._id ? <ExpandMore /> : <ExpandDown />}
                      Outbox
                    </ListItemButton>
                  </List>
                  <Collapse in={OutBoxID == "2" + item._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                      <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/AllSentEmails", item._id)}
                        component={Link}
                        selected={SelectMenuItem === "/AllSentEmails" + item._id}>
                        All Sent{/* {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SentCount != undefined ? `All Sent(` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].SentCount + `)` : `All Sent(` + 0 + `)`} */}
                        {/* {SentEmailTotalRecords?.AllSentEmailsCount.filter((e) => e._id === item.AccountID)[0]?.IsAllSent == undefined ? `All Sent (0)` : `All Sent (` + SentEmailTotalRecords?.AllSentEmailsCount.filter((e) => e._id === item.AccountID)[0]?.IsAllSent + `)`} */}
                      </ListItemButton>

                      <ListItemButton sx={{ pl: 4 }} onClick={(event) => handleListItemClick(event, "/UnansweredReplies", item._id)}
                        component={Link}
                        selected={SelectMenuItem === "/UnansweredReplies" + item._id}>
                        {FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].UnansweredRepliesCount != undefined ? `Unanswered(` + FromEmailDropdownList.filter((e) => e.AccountID == item.AccountID)[0].UnansweredRepliesCount + `)` : `Unanswered(` + 0 + `)`}
                        {/* {SentEmailTotalRecords?.AllUnansweredRepliesCount.filter((e) => e._id === item.AccountID)[0]?.IsUnansweredReplies == undefined ? `Unanswered(0)` : `Unanswered(` + SentEmailTotalRecords?.AllUnansweredRepliesCount.filter((e) => e._id === item.AccountID)[0]?.IsUnansweredReplies + `)`} */}
                      </ListItemButton>

                    </List>
                  </Collapse>


                  <List component="div">
                    <ListItemButton sx={{ pl: 2 }} onClick={() => OnehandleClickOutBox("3" + item._id, 1)} key={"3" + item._id}>
                      {OutBoxID == "3" + item._id ? <ExpandMore /> : <ExpandDown />}
                      Labels
                      <Button className='btnplusright' onClick={labelhandleOpen}><Add /></Button>
                    </ListItemButton>

                    <Modal className="labelbox"
                      open={opento}
                      onClose={labelhandleClose}
                      aria-labelledby="child-modal-title"
                      aria-describedby="child-modal-description"
                    >
                      <Box sx={style} className="modal-prein">
                        <Close onClick={labelhandleClose} className='btnclose m-3' />
                        <div className='px-5 py-4 text-center'>
                          <Typography id="modal-modal-title" variant="b" component="h4">
                            New label
                          </Typography>

                          <Typography component="p" sx={{ mt: 2 }} align='left'>
                            Please enter a new label name:
                          </Typography>
                          <div className='input-box'>
                            <input type='text' placeholder='Name' id="LabelId" />
                            {LabelNameError && <p style={{ color: "red" }}>{LabelNameError}</p>}
                          </div>
                        </div>
                        <div className='d-flex btn-50'>
                          <Button className='btn btn-pre greybtn' variant="contained" size="medium" onClick={() => { labelhandleClose(); }}>
                            Cancel
                          </Button>
                          <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { AddNewLabel(item.AccountID); }}>
                            Create
                          </Button>
                        </div>
                      </Box>
                    </Modal>

                  </List>
                  <Collapse in={OutBoxID == "3" + item._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {[...item.LabelField].sort((a, b) => (isNaN(a.LableName) || isNaN(b.LableName)) ? a.LableName.localeCompare(b.LableName) : parseFloat(a.LableName) - parseFloat(b.LableName))?.map((label, index) => {
                        
                        if (label.LableName === "INBOX" || label.LableName === "Trash" || label.LableName === "Bin") {
                          return null; // Skip rendering INBOX, Trash and Bin labels
                        }

                        const labelId = label.RecieverEmailLableID;
                        const selected = SelectMenuItem === `/LabelByID${labelId}`;

                        // Find the corresponding email account for the current item
                        const matchingAccount = emailAccounts.find((acc) => acc.AccountID === item.AccountID);

                        // Calculate the unseen label count based on matching account and label ID
                        let unseenLabelCount = 0;
                        // if (matchingAccount) {
                        //   const matchingLabel = matchingAccount.LabelsCounts?.find((row) => row.LabelID === labelId);
                        //   unseenLabelCount = matchingLabel ? matchingLabel.UnSeenLabelCounts : 0;
                        // }
                        // else {
                        unseenLabelCount = label.TotalLableMailCount - label.TotalSeenLableMailCount;
                        // }

                        // Calculate the label count for display
                        var displayLabelCount = unseenLabelCount > 0 ? `(${unseenLabelCount})` : "(0)";
                        if (label.LableName == "Trash" || label.LableName == "Bin") {
                          displayLabelCount = "";
                        }

                        return (
                          <>
                            <ListItemButton
                              key={labelId}
                              sx={{ pl: 4 }}
                              onClick={(event) => handleListItemClick(event, "/LabelByID", labelId)}
                              component={Link}
                              selected={selected}
                            >
                              <div style={{ background: labelID == labelId ? bgColor : label.LabelColorCode ? label.LabelColorCode : defaultBgColor }} className={`labelcolorbox label-color-${labelId}`}></div> {label.LableName.length > 10 ? label.LableName.slice(0, 10) + '...' + displayLabelCount : label.LableName + displayLabelCount}
                            </ListItemButton>
                            {/* <Button className='labelinside' aria-describedby={`${labelId}-${index}`} variant="contained" onClick={(event) => dothandleClick(event, index, labelId)}>  <MoreVertIcon /></Button> */}
                            <Button
                              className='labelinside'
                              aria-describedby="001"
                              variant="contained"
                              index={index}
                              labelid={labelId}
                              labelcolorcode={label.LabelColorCode}
                              accountid={item.AccountID}
                              // onClick={handleColorClick}
                              onClick={handleLabelMenuClick}
                            >
                              <MoreVertIcon />
                            </Button>

                          </>
                        );
                      })}
                    </List>

                  </Collapse>

                    {/* Created new trash file */}
                  {/* <Collapse in={OutBoxID == "3" + item._id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                      {[...item.LabelField].map((label, index) => {
                        if (label.LableName != "Trash") {
                          return null; // Skip rendering labels except trash
                        }

                        const labelId = label.RecieverEmailLableID;
                        const selected = SelectMenuItem === `/Trash${labelId}`;

                        return (
                          <>
                            <ListItemButton
                              key={labelId}
                              sx={{ pl: 4 }}
                              onClick={(event) => handleListItemClick(event, "/Trash", labelId)}
                              component={Link}
                              selected={selected}
                            >
                              <div style={{ background: labelID == labelId ? bgColor : label.LabelColorCode ? label.LabelColorCode : defaultBgColor }} className={`labelcolorbox label-color-${labelId}`}></div> {label.LableName}
                            </ListItemButton>
                            <Button
                              className='labelinside'
                              aria-describedby="001"
                              variant="contained"
                              index={index}
                              labelid={labelId}
                              labelcolorcode={label.LabelColorCode}
                              accountid={item.AccountID}
                              // onClick={handleColorClick}
                              onClick={handleLabelMenuClick}
                            >
                              <MoreVertIcon />
                            </Button>

                          </>
                        );
                      })}
                    </List>

                  </Collapse> */}
                </List>
              </Collapse>
            </List>
          ))}

          <Popover
            id="001"
            open={anchorEl}
            anchorEl={anchorEl ? anchorEl : 'simple-popover'}
            onClose={handleColorClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className="colorboxmain" id="001">
              <div className="btncolor">
                <Typography className="btnleft">Label Color</Typography>
                <Button className="full-right"
                  variant="contained"
                  style={{ backgroundColor: selectedColor, color: 'white' }}
                  onClick={() => colorhandleChange(selectedAccountID, colorLabelId, selectedColor)}
                >
                  Set
                </Button>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <HexColorPicker color={selectedColor} onChange={handleColorChange} />
              </div>
              <div className="colorpaletlist">
                <button style={{ background: "#ff6961" }} onClick={() => handleColorChange("#ff6961")}></button>
                <button style={{ background: "#ffb480" }} onClick={() => handleColorChange("#ffb480")}></button>
                <button style={{ background: "#f8f38d" }} onClick={() => handleColorChange("#f8f38d")}></button>
                <button style={{ background: "#42d6a4" }} onClick={() => handleColorChange("#42d6a4")}></button>
                <button style={{ background: "#08cad1" }} onClick={() => handleColorChange("#08cad1")}></button>
                <button style={{ background: "#59adf6" }} onClick={() => handleColorChange("#59adf6")}></button>
                <button style={{ background: "#9d94ff" }} onClick={() => handleColorChange("#9d94ff")}></button>
                <button style={{ background: "#c780e8" }} onClick={() => handleColorChange("#c780e8")}></button>
              </div>
            </div>
          </Popover>

          <Menu className="mindroplab"
            id="001"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorMenuEl ? anchorMenuEl : 'simple-popover'}
            open={anchorMenuEl}
            onClose={handleLabelMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            style={{ width: '190px', maxWidth: '100%', padding: '0 10px' }}
          >
            <MenuItem labelid={colorLabelId} labelcolorcode={selectedColor} accountid={selectedAccountID} onClick={handleColorClick}>Label Color</MenuItem>
            <Divider />
            <MenuItem labelid={colorLabelId} accountid={selectedAccountID} onClick={OpenDeletePopModel}>Remove Label</MenuItem>

          </Menu>


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
    </>
  );
}













