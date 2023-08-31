import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, EditorVariableNames, LoaderShow, IsGreaterDate, ValidateEmail, decrypt, Plain2HTML, RemoveForwardPop, RemoveCurrentEmailFromCC, RemoveCurrentEmailFromBCC } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import UnansweredResponsesComposePage from '../FocusedComposePage/FocusedComposePage';

import InputBase from '@mui/material/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { styled, alpha } from '@material-ui/core/styles';

import ToggleButton from '@mui/material/ToggleButton';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import { Box } from '@material-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@mui/material/Pagination';
import TablePagination from '@mui/material/TablePagination';
import RefreshIcon from '@material-ui/icons/Refresh';

import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icons_replyall from '../../images/icons_replyall.svg';
import icondelete from '../../images/icon_delete.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import icontimer from '../../images/icon_timer.svg';
import inbox from '../../images/icons/inbox.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import Close from '../../images/icons/w-close.svg';
import Chatgpt from '../../images/icons/chatgpt-icon.svg';

import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { toast } from "react-toastify";

import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import IntroJs from 'intro.js';
import 'intro.js/introjs.css';
import { IntroJsReact } from 'react-intro.js';
import PeopleOutlineIcon from '@material-ui/icons/PeopleAltOutlined';
import Popover from '@mui/material/Popover';
import { ArrowDropDown } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';
import Frame from 'react-frame-component';
import { useDispatch } from 'react-redux';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
];

toast.configure();

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

const Style = {
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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export default function UnansweredResponsesPage(props) {

  const [FollowUpList, SetFollowUpList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(50);
  const [SortField, SetsortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const StarhandleOpen = () => setOpen(true);
  const StarhandleClose = () => setOpen(false);
  const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
  const FollowupPopOpen = () => SetFollowupPopModel(true);
  const FollowupPopClose = () => SetFollowupPopModel(false);
  const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [OtherInboxPopModel, SetOtherInboxPopModel] = React.useState(false);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [temopen, setTemOpen] = React.useState(false);
  const [CountPage, SetCountPage] = React.useState(0);
  const [TotalRecord, SetTotalRecord] = React.useState(0);
  const [PageValue, SetPageValue] = React.useState(1)
  const [MenuID, SetMenuID] = React.useState("");
  const [Active, SetActive] = useState("");
  const [Ccflag, SetCcflag] = useState(false);
  const [Bccflag, SetBccflag] = useState(false);
  const [CcReplyflag, SetCcReplyflag] = useState(false);
  const [BccReplyflag, SetBccReplyflag] = useState(false);
  const [isstarActive, setstarActive] = React.useState(false);
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [ToEmailValue, SetToEmailValue] = React.useState([]);
  const [CCEmailValue, SetCCEmailValue] = React.useState([]);
  const [CCMessages, SetCCMessages] = React.useState([])
  const [BCCMessages, SetBCCMessages] = React.useState([])
  const [BCCEmailValue, SetBCCEmailValue] = React.useState([]);
  // const [state, setState] = useState(true)
  const [state, setState] = useState(false)
  const [ValueMail, SetValueMail] = useState()
  const [ForwardToEmailValue, SetForwardToEmailValue] = useState([])
  const [ForwardCCEmailValue, SetForwardCCEmailValue] = useState([])
  const [ForwardBCCEmailValue, SetForwardBCCEmailValue] = useState([])
  const [TemplateID, SetTemplateID] = React.useState("");
  const [ClientData, SetClientData] = useState()
  const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
  const [NewTemplateID, SetNewTemplateID] = useState([])
  const [subject, setSubject] = useState()
  const [GetReplyMessageDetails, SetGetReplyMessageDetails] = useState()
  const [GetReplyMessageDetailsTextBody, SetGetReplyMessageDetailsTextBody] = useState()
  const [ChatGPTMOdel, SetChatGPTModel] = useState(false)
  const [NewObjectionID, SetNewObjectionID] = useState([])
  const [CheckedID, SetCheckedID] = useState([])
  const [isChecked, setIsChecked] = useState(false);
  const [ShowCheckBox, SetShowCheckBox] = useState("")
  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
  const [MUIClass, SetMUIClass] = useState("Mui-selected")
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const OpenChatGPTModel = () => SetChatGPTModel(true)

  const HanleChatGPTClose = () => SetChatGPTModel(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ccanchorEl, setCCAnchorEl] = React.useState(null);
  const [bccanchorEl, setBCCAnchorEl] = React.useState(null);

  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const tableRef = useRef(null);
  const dispatch = useDispatch();

  const tohandleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const tohandleClose = () => {
    setAnchorEl(null);
  };

  const cchandleClick = (event) => {
    setCCAnchorEl(event.currentTarget);
  };
  const cchandleClose = () => {
    setCCAnchorEl(null);
  };

  const bcchandleClick = (event) => {
    setBCCAnchorEl(event.currentTarget);
  };
  const bcchandleClose = () => {
    setBCCAnchorEl(null);
  };

  const toopen = Boolean(anchorEl);
  const ccopen = Boolean(ccanchorEl);
  const bccopen = Boolean(bccanchorEl);
  const idto = toopen ? 'simple-popover' : undefined;
  const idcc = ccopen ? 'simple-popover' : undefined;
  const idbcc = bccopen ? 'simple-popover' : undefined;


  useEffect(() => {
    document.title = 'Focused | MAXBOX';
    GetClientID();
  }, [SearchInbox, state])

  const wizard = (ID) => {

    const intro = IntroJs();

    if (ID == undefined || ID == "") {
      document.getElementById("OpenNavigation").classList.add("show");

      intro.onafterchange(function (targetElement) {
        const currentStepIndex = intro._currentStep;
        if (currentStepIndex === 0) {
          const element = document.getElementById("OpenNavigation");
          element.classList.add("show");
        }
      });
    }


    intro.setOptions({
      steps: [
        {
          element: '.one-step',
          title: '<b>Welcome</b> to MaxBox',
          intro: 'Your gateway to efficient communication and limitless possibilities, welcome to a world of streamlined productivity and personalized inbox magic.',
          tooltipClass: 'tooltipmaxbox backbtnnon',
          highlightClass: 'bgwhiter',
          position: 'right',

        },
        {
          element: '.one-step',
          title: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="user"> <g> <path d="M20,21V19a4,4,0,0,0-4-4H8a4,4,0,0,0-4,4v2" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <circle cx="12" cy="7" fill="none" r="4" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle> </g> </g> </g> </g></svg>  Add your client',
          intro: 'Click on add client, you can create your client here',
          tooltipClass: 'tooltipmaxbox',
          highlightClass: 'bgwhiter',
          position: 'right',

        },
        {
          element: '#two-step',
          title: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="mail"> <g> <polyline fill="none" points="4 8.2 12 14.1 20 8.2" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polyline> <rect fill="none" height="14" rx="2" ry="2" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" width="18" x="3" y="6.5"></rect> </g> </g> </g> </g></svg>  Email account',
          intro: 'Click on add account, you can configure your email for client here',
          tooltipClass: 'tooltipmaxbox',
          highlightClass: 'bgwhiter',
          position: 'right',
        },
        {
          element: '.three-step',
          title: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></polygon> </g> </g> </g> </g></svg>  Compose',
          intro: 'Click on compose button, you can write your mail here ',
          tooltipClass: 'tooltipmaxbox',
          highlightClass: 'bgwhiter',
          position: 'left',
        },
        {
          element: '.fore-step',
          title: '<svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>template</title><path d="M26,6v4H6V6H26m0-2H6A2,2,0,0,0,4,6v4a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"></path><path d="M10,16V26H6V16h4m0-2H6a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2h4a2,2,0,0,0,2-2V16a2,2,0,0,0-2-2Z"></path><path d="M26,16V26H16V16H26m0-2H16a2,2,0,0,0-2,2V26a2,2,0,0,0,2,2H26a2,2,0,0,0,2-2V16a2,2,0,0,0-2-2Z"></path><rect class="cls-1" width="32" height="32"></rect></g></svg> Template',
          intro: 'Create template, you can create your template here',
          tooltipClass: 'tooltipmaxbox',
          highlightClass: 'bgwhiter',
          position: 'bottom-right',
        },
      ],

    });

    if (ID == undefined || ID == "") {
      intro.oncomplete(function () {
        intro.exit();
        // const element = document.getElementById("OpenNavigation");
        // element.classList.remove("show");
      });

      intro.onbeforeexit(function () {
        intro.exit();
        // const element = document.getElementById("OpenNavigation");
        // element.classList.remove("show");
      });
    }

    if (ID == undefined || ID == "") {
      intro.start();
    } else {
      intro.exit()
    }

  }


  const ContainerRef = useRef(null);

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    var ID = decrypt(props.location.search.replace('?', ''))
    var WClientID = UserDetails.ClientID
    wizard(WClientID)

    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }


    // Listen for incoming messages
    if (!state) {
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        // GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "", "SeenEmails", "");
        if (isstarActive) {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "showloader", "SeenEmails", "IsStarredEmails");
        } else {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "showloader", "SeenEmails", "");
        }
      } else {
        // GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "", "SeenEmails", "")
        if (isstarActive) {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "SeenEmails", "IsStarredEmails")
        } else {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "SeenEmails", "")
        }
      }
    } else {
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        if (isstarActive) {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "showloader", "", "IsStarredEmails")
        } else {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "showloader", "", "")
        }
      } else {
        if (isstarActive) {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "", "IsStarredEmails")
        } else {
          GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "", "")
        }
      }
    }
    GetClientList(UserDetails.ClientID)
  }

  const GetClientList = (ID) => {
    let Data
    Data = {
      ID: ID
    };

    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/client/ClientGetByID",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetClientData(Result?.data?.Data[0]?.SignatureText)
      }
    });
  };

  const [IsStarEmai, SetIsStarEmail] = useState(false)

  // Start From Email List
  const FromEmailList = async (CID, UID, ID, ShowEmails, IsStarred) => {

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
          if (ID?.length > 0) {
            var total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount : 0

            var StarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount : 0
            var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount : 0
            var startotal = StarredCount - SeenStarredCount;
            dispatch({ type: 'unSeenStarredCount', payload: startotal });

            var FocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount : 0
            var SeenFocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount : 0
            var UnSeenFoucsedtotal = FocusedCount - SeenFocusedCount
            dispatch({ type: 'unSeenFocusedCount', payload: UnSeenFoucsedtotal });

            // if (ShowEmails == "SeenEmails" && IsStarred == "") {
            //   total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount : 0
            // } else
            if (ShowEmails == "" && IsStarred == "IsStarredEmails") {
              var StarredFocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredFocusedCount : 0
              var SeenStarredFocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredFocusedCount : 0
              total = StarredFocusedCount - SeenStarredFocusedCount;

            } else if (ShowEmails == "SeenEmails" && IsStarred == "IsStarredEmails") {
              total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredFocusedCount : 0
              var StarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount : 0
              var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount : 0
              var startotal = StarredCount - SeenStarredCount;
              dispatch({ type: 'unSeenStarredCount', payload: startotal });

            } else if (ShowEmails == "" && IsStarred == "") {
              var FocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].FocusedCount : 0
              var SeenFocusedCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenFocusedCount : 0
              total = FocusedCount - SeenFocusedCount;
              dispatch({ type: 'unSeenFocusedCount', payload: total });
            }


            SetTotalRecord(total);
          } else {
            var total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.FocusedCount)?.reduce((a, b) => a + b, 0) : 0
            var StarredCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenStarredCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredCount)?.reduce((a, b) => a + b, 0) : 0
            var startotal = StarredCount - SeenStarredCount;
            dispatch({ type: 'unSeenStarredCount', payload: startotal });

            var FocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.FocusedCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenFocusedCount)?.reduce((a, b) => a + b, 0) : 0
            var UnSeenFoucsedtotal = FocusedCount - SeenFocusedCount
            dispatch({ type: 'unSeenFocusedCount', payload: UnSeenFoucsedtotal });

            var InboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.InboxCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenInboxCount)?.reduce((a, b) => a + b, 0) : 0
            var unSeenInboxCount = InboxCount - SeenInboxCount
            dispatch({ type: 'unSeenInboxCount', payload: unSeenInboxCount });

            var SpamCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SpamCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenSpamCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenSpamCount)?.reduce((a, b) => a + b, 0) : 0
            var UnSeenSpamtotal = SpamCount - SeenSpamCount;
            dispatch({ type: 'unSeenSpamCount', payload: UnSeenSpamtotal });

            var OtherInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.OtherInboxCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenOtherInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenOtherInboxCount)?.reduce((a, b) => a + b, 0) : 0
            var unSeenOtherInboxCount = OtherInboxCount - SeenOtherInboxCount
            dispatch({ type: 'unSeenOtherInboxCount', payload: unSeenOtherInboxCount });

            var FollowUpLaterCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.FollowUpLaterCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenFollowUpLaterCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenFollowUpLaterCount)?.reduce((a, b) => a + b, 0) : 0
            var unSeenFollowUpLaterCount = FollowUpLaterCount - SeenFollowUpLaterCount
            dispatch({ type: 'unSeenFollowUpLaterCount', payload: unSeenFollowUpLaterCount });

            if (ShowEmails == "" && IsStarred == "IsStarredEmails") {
              if (isstarActive) {
                var StarredCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                var SeenStarredFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                total = StarredCount - SeenStarredFocusedCount
              } else {
                var StarredFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                var SeenStarredFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                total = StarredFocusedCount - SeenStarredFocusedCount
              }
            }
            else if (ShowEmails == "SeenEmails" && IsStarred == "IsStarredEmails") {
              if (isstarActive && state) {
                var StarredFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                var SeenStarredFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                total = StarredFocusedCount - SeenStarredFocusedCount
              } else if (!state && isstarActive) {
                total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
              } else {
                total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
              }
              var StarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount : 0
              var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount : 0
              var startotal = StarredCount - SeenStarredCount;
              dispatch({ type: 'unSeenStarredCount', payload: startotal });
            }
            else if (ShowEmails == "" && IsStarred == "") {
              var FocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.FocusedCount)?.reduce((a, b) => a + b, 0) : 0
              var SeenFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenFocusedCount)?.reduce((a, b) => a + b, 0) : 0
              total = FocusedCount - SeenFocusedCount
              dispatch({ type: 'unSeenFocusedCount', payload: total });
            }
            SetTotalRecord(total);
          }
        } else {
          SetTotalRecord(0);
          // toast.error(<div>Please add email configuration.</div>)
        }
      }
      else {
        SetFromEmailDropdownList([]);
        SetTotalRecord(0);
        toast.error(Result?.data?.Message);
      }
    });


  }


  // Start Get Follow Up Later List
  const GetUnansweredResponcesList = (CID, UID, PN, ID, str, ShowEmails, IsStarred, RefreshString) => {
    FromEmailList(CID, UID, ID, ShowEmails, IsStarred);
    let AccountIDs = []
    if (ID.length > 0) {
      AccountIDs.push(ID)
    } else {
      AccountIDs = [-1]
    }
    var UnseenEmails

    if (ShowEmails == "SeenEmails") {
      UnseenEmails = true
    } else {
      UnseenEmails = false
    }

    SetShowCheckBox(UnseenEmails)

    var IsStarredEmails

    if (IsStarred == "IsStarredEmails") {
      IsStarredEmails = true
    } else {
      IsStarredEmails = false
    }

    if (str == "showloader") {
      LoaderShow()
    }
    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      IsInbox: true,
      IsStarred: false,
      IsFollowUp: false,
      IsOtherInbox: false,
      IsSpam: false,
      AccountIDs: AccountIDs,
      UnseenEmails: UnseenEmails,
      IsStarredEmails: IsStarredEmails,
      IsFocued: true
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          // SetFollowUpList([...FollowUpList, ...Result.data.PageData])
          SetFollowUpList(Result.data.PageData)
          var SelectedIDCount = 0
          Result.data.PageData.map((e) => {
            var SameID = CheckedID.find((s) => s === e._id)
            if (SameID != undefined) {
              SelectedIDCount++
            }
          })
          if (!state) {
            if (49 > SelectedIDCount) {
              setSelectAllChecked(false)
            } else {
              setSelectAllChecked(true)
            }
          } else {
            if (50 > SelectedIDCount) {
              setSelectAllChecked(false)
            } else {
              setSelectAllChecked(true)
            }
          }
          if (RefreshString == "Refresh") {
            setSelectAllChecked(false)
            const updatedArr = [...Result.data.PageData];

            // Update the IsSeen property of the first element
            updatedArr[0].IsSeen = true;

            // Update the state with the modified array
            SetFollowUpList(updatedArr)
          }
          if (!str == "hideloader") {
            OpenMessageDetails(Result.data.PageData[0]._id, '', 'showloader', '');
          } else {
            OpenMessageDetails(Result.data.PageData[0]._id, '', '', '');
          }
          SetCountPage(Result.data.PageCount);
          // SetTotalRecord(Result.data.TotalCount);
          SetMailNumber(1)
          SetPageValue(PN)
          LoaderHide()
        } else {
          SetFollowUpList([])
          SetOpenMessageDetails([]);
          SetCountPage(0)
          SetTotalRecord(0);
          SetPageValue(0)
          LoaderHide()
        }
      }
    })
  }
  // End Get Follow Up Later List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index, str, updatestr) => {
    if (ID != '') {
      SetMailNumber(index + 1)

      let UpdatedList = FollowUpList.map(item => {
        if (item._id == ID) {
          return { ...item, IsSeen: true };
        }
        return item;
      });
      if (updatestr == "updatelist") {
        SetFollowUpList(UpdatedList)
      }

      var Data = {
        _id: ID,
        IsFocusedPage: true,
      };
      if (str == "showloader") {
        LoaderShow()
      }
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        var element2 = document.getElementsByClassName("temp-class")
        if (element2.length > 0) {
          element2[0].classList.remove('Mui-selected')
        }
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetToEmailValue(Result.data.Data)
            SetValueMail(Result.data.Data[0]?.FromEmail)
            SetOpenMessageDetails(Result.data.Data[0]);
            SetCCMessages(Result.data.Data[0]?.CcNameEmail);
            SetBCCMessages(Result.data.Data[0]?.BccNameEmail);
            localStorage.setItem("CCMessage", JSON.stringify(Result.data.Data[0]?.CcNameEmail))
            localStorage.setItem("BCCMessage", JSON.stringify(Result.data.Data[0]?.BccNameEmail))
            SetActive(ID);
            // let UpdatedList = FollowUpList.map(item => {
            //   if (item._id == ID) {
            //     return { ...item, IsSeen: true };
            //   }
            //   return item;
            // });
            // if (updatestr == "updatelist") {
            //   SetFollowUpList(UpdatedList)
            // }
            LoaderHide()
          } else {
            SetFollowUpList([])
            SetOpenMessageDetails([]);
            SetActive("");
            LoaderHide()
          }

          if (Result?.data?.Data[0]?.IsStarred == false) {
            SetMUIClass("")
            if (element2.length > 0) {
              element2[0].classList.remove("Mui-selected");
            }
          }
          else {
            if (element2.length > 0) {
              element2[0].classList.add("Mui-selected")
            }
          }
        }
        else {
          let UpdatedList = FollowUpList.map(item => {
            if (item._id == ID) {
              return { ...item, IsSeen: false };
            }
            return item;
          });
          if (updatestr == "updatelist") {
            SetFollowUpList(UpdatedList)
          }
          SetOpenMessageDetails([]);
          LoaderHide()
        }
      });
    }
    else {
      SetOpenMessageDetails([]);
      LoaderHide()
    }
  };
  //End Open Message Details

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(50);
      SetFollowUpList([])
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Start PopModel Open and Close and Delete Message
  const OpenDeletePopModel = () => {
    SetDeletePopModel(true);
  }
  const CloseDeletePopModel = () => {
    SetDeletePopModel(false);
  }
  const DeleteMessage = (ID) => {
    if (ID != '') {
      var DeleteArray = []
      DeleteArray.push(ID)
      var Data = {
        IDs: DeleteArray,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Delete mail successfully.</div>);
          setSelectedRowIndex(0)
          CloseDeletePopModel();
          OpenMessageDetails('', '', 'showloader', '')
          LoaderShow()
          // var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID != "" && ID != null && ID != "undefined") {
          //   if (FollowUpList?.length - 1 == 0) {
          //     GetUnansweredResponcesList(ClientID, UserID, 1, ID, "", "", "");
          //   } else {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "", "");
          //   }
          // } else {
          //   if (FollowUpList?.length - 1 == 0) {
          //     GetUnansweredResponcesList(ClientID, UserID, 1, 0, "", "", "")
          //   } else {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
          //   }
          // }
          var ID = decrypt(props.location.search.replace('?', ''))
          if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
              // GetUnansweredResponcesList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "", "SeenEmails", "");
              if (isstarActive) {
                GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "IsStarredEmails");
              } else {
                GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "");
              }
            } else {
              // GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "")
              if (isstarActive) {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "IsStarredEmails")
              } else {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "")
              }
            }
          } else {
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "", "");
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
            }
          }

        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close and Delete Message

  // Start Followup Message
  const OpenFollowupPopModel = () => {
    SetFollowupPopModel(true);
  }
  const CloseFollowupPopModel = () => {
    SetFollowupPopModel(false);
  }
  const SelectFollowupDate = (NewValue) => {
    SetFollowupDate(NewValue);
  };
  const UpdateFollowupMessage = (ID) => {
    const IsValidDate = Moment(FollowupDate).isValid()
    const IsGreater = IsGreaterDate(FollowupDate)
    var StarID = ID
    if (ID != '') {
      if (FollowupDate != null) {
        if (IsValidDate & IsGreater) {
          var IsStarred
          var IsStarMail = FollowUpList?.find((e) => e._id === ID)?.IsStarred
          if (IsStarMail) {
            IsStarred = true
          } else {
            IsStarred = false
          }
          var Data = {
            ID: ID,
            IsFollowUp: true,
            FollowupDate: FollowupDate,
            IsInbox: false,
            IsFocusedPage: true,
            IsStarred: IsStarred,
            LastUpdatedBy: -1
          };
          const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/FollowupUpdate",
            method: "POST",
            data: Data,
          });
          ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
              toast.success(<div>Follow up later updated successfully.</div>);
              CloseFollowupPopModel();
              setSelectedRowIndex(0)
              // OpenMessageDetails('')
              LoaderShow()
              var ID = decrypt(props.location.search.replace('?', ''))
              // if (ID !== undefined && ID!="") {
              // if (props !== undefined) {
              //   const ID = props.location.state;

              // var element = document.getElementById("star_" + StarID);

              // var className = element.className;
              // var isStar = className.includes("Mui-selected")

              // if (isStar) {
              //   element.classList.remove("Mui-selected");
              // }

              if (!state) {
                if (ID != "" && ID != null && ID != "undefined") {
                  GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "");
                } else {
                  GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "")
                }
              }
              else {
                if (ID != "" && ID != null && ID != "undefined") {
                  GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "", "");
                } else {
                  GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
                }
              }
              // }
            }
            else {
              toast.error(Result?.data?.Message);
            }
          });
        } else {
          toast.error(<div>Please enter valid date.</div>)
        }
      } else {
        toast.error(<div>Please enter date.</div>)
      }
    }
  }
  // End Followup Message

  // Start Update Star Message and model open and close
  const OpenStarPopModel = () => {
    SetStarPopModel(true);
  }
  const CloseStarPopModel = () => {
    SetStarPopModel(false);
  }
  const UpdateStarMessage = (ID, str, index) => {
    if (str === "opnemodel") {
      CloseStarPopModel();
    }
    if (ID != '') {

      let UpdatedList = FollowUpList.map(item => {
        if (item._id == ID) {
          if (item.IsStarred) {
            return { ...item, IsStarred: false };
          } else {
            return { ...item, IsStarred: true };
          }
        }
        return item;
      });

      SetFollowUpList(UpdatedList)

      if (!state) {
        if (isstarActive == true) {
        } else {
          var element = document.getElementById("star_" + ID);
          var element2 = document.getElementById("starbelow_" + ID);

          var className = element.className;
          var isStar = className.includes("Mui-selected")

          if (isStar) {
            element.classList.remove("Mui-selected");
            if (element2) {
              element2.classList.remove("Mui-selected");
            }
          }
          else {
            element.classList.add("Mui-selected");
            if (element2) {
              element2.classList.add("Mui-selected");
            }
          }
          // OpenMessageDetails(ID, index, "", "",)
        }
      }
      else {
        if (isstarActive == true) {
        } else {
          var element = document.getElementById("star_" + ID);
          var element2 = document.getElementById("starbelow_" + ID);

          var className = element.className;
          var isStar = className.includes("Mui-selected")

          if (isStar) {
            element.classList.remove("Mui-selected");
            if (element2) {
              element2.classList.remove("Mui-selected");
            }
          }
          else {
            element.classList.add("Mui-selected");
            if (element2) {
              element2.classList.add("Mui-selected");
            }
          }
        }
        // OpenMessageDetails(ID, index, "", "",)
      }

      var Data = {
        _id: ID,
        IsStarred: true,
        IsFocusedPage: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then(async (Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

          if (isstarActive && state) {
            GetUnansweredResponcesList(ClientID, UserID, Page, 0, "hideloader", "", "IsStarredEmails")
          } else if (isstarActive) {
            GetUnansweredResponcesList(ClientID, UserID, Page, 0, "hideloader", "SeenEmails", "IsStarredEmails")
          }

          var accessToken = Result.data.accessToken
          var RFC822MessageID = Result.data.RFC822MessageID
          var IsStarred_DB = Result.data.IsStarred_DB

          if (accessToken != null && accessToken != '') {
            const rfcEncode = encodeURIComponent(RFC822MessageID);
            var Url = "https://www.googleapis.com/gmail/v1/users/me/messages" + "?q='rfc822msgid:" + rfcEncode + "&format=metadata&metadataHeaders=Subject&metadataHeaders=References&metadataHeaders=Message-ID" + "&includeSpamTrash=true";
            Url = Url + "&format=raw";

            const headers = {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            }

            await Axios.get(Url, {
              headers: headers
            }).then((response) => {
              if (response.data.resultSizeEstimate == 0) {
                return Result;
              }
              var MessageID = response.data.messages[0].id

              var LabelUpdateUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages/" + MessageID + "/modify"

              var StarredUpdateVaribleGmail

              if (IsStarred_DB) {
                StarredUpdateVaribleGmail = '{"addLabelIds": ["STARRED"]}';
              } else {
                StarredUpdateVaribleGmail = '{"removeLabelIds": ["STARRED"]}';
              }

              Axios.post(LabelUpdateUrl, StarredUpdateVaribleGmail, {
                headers: headers
              }).then(async (responseone) => {

              })
            })

          }

          // if (!state) {
          //   if (isstarActive == true) {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, 0, "hideloader", "SeenEmails", "IsStarredEmails")
          //   } else {
          //     var element = document.getElementById("star_" + ID);
          //     var element2 = document.getElementById("starbelow_" + ID);

          //     var className = element.className;
          //     var isStar = className.includes("Mui-selected")

          //     if (isStar) {
          //       element.classList.remove("Mui-selected");
          //       element2.classList.remove("Mui-selected");
          //     }
          //     else {
          //       element.classList.add("Mui-selected");
          //       element2.classList.add("Mui-selected");
          //     }
          //     OpenMessageDetails(ID, index, "", "",)
          //   }
          // }
          // else {
          //   if (isstarActive == true) {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, 0, "hideloader", "", "IsStarredEmails")
          //   } else {
          //     var element = document.getElementById("star_" + ID);
          //     var element2 = document.getElementById("starbelow_" + ID);

          //     var className = element.className;
          //     var isStar = className.includes("Mui-selected")

          //     if (isStar) {
          //       element.classList.remove("Mui-selected");
          //       element2.classList.remove("Mui-selected");
          //     }
          //     else {
          //       element.classList.add("Mui-selected");
          //       element2.classList.add("Mui-selected");
          //     }
          //   }
          //   OpenMessageDetails(ID, index, "", "",)
          // }

        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Update Star Message and model open and close

  // Start Other inbox Message and model open and close
  const OpenOtherInboxPopModel = () => {
    SetOtherInboxPopModel(true);
  }
  const CloseOtherInboxPopModel = () => {
    SetOtherInboxPopModel(false);
  }
  const UpdateOtherInbox = (ID) => {
    var StarID = ID
    if (ID != '') {
      var Data = {
        _id: ID,
        IsOtherInbox: true,
        IsFocusedPage: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Other inbox updated successfully.</div>);
          CloseOtherInboxPopModel();
          setSelectedRowIndex(0)
          // OpenMessageDetails('')
          LoaderShow()
          var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID !== undefined && ID!="") {
          // if (props !== undefined) {
          //   const ID = props.location.state;

          // var element = document.getElementById("star_" + StarID);

          // var className = element.className;
          // var isStar = className.includes("Mui-selected")

          // if (isStar) {
          //   element.classList.remove("Mui-selected");
          // }

          if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "");
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "")
            }
          }
          else {
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "", "");
            } else {
              GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
            }
          }
          // }
        }
        else {
          CloseOtherInboxPopModel();
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Other inbox  Message and model open and close

  // Starts Handle Change
  const HandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  // End Handle Change

  // Select Template Starts
  const SelectTemplate = () => {
    var GetByClass = document.getElementsByClassName('active');
    LoaderShow()
    if (GetByClass.length > 0) {
      SetNewTemplateID([...NewTemplateID, document.getElementsByClassName('active')[0].id])
      var TemplateID = document.getElementsByClassName('active')[0].id;
      var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
      var BodyData = Signature.Data;
      document.getElementById("Subject").value = DivData.Subject;
      var NewData = DivData.BodyText + BodyData
      SetTemplateID(TemplateID);
      SetSignature({ Data: NewData });
      // var body = "";
      // BodyData.split(ClientData).map(function (address, index) {
      //   if (index == 0) {
      //     body = address
      //     SetTemplateID("");
      //   }
      // });
      // var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
      // document.getElementById("Subject").value = DivData.Subject;
      // // var NewData = BodyData + '</br>' + DivData.BodyText;
      // var NewData = "";
      // if (body != "" && chckEmptyBody != "") {
      //   NewData = body + DivData.BodyText + ClientData;
      //   SetTemplateID(TemplateID)
      // } else {
      //   NewData = DivData.BodyText + BodyData
      //   SetTemplateID(TemplateID)
      // }
      LoaderHide()
      handleTemClose()
    } else {
      toast.error("Please select template");
      LoaderHide()
    }
  }
  // Select Template Starts

  // Select Object Templates Starts
  const SelectObjectTemplate = () => {
    var GetByClass = document.getElementsByClassName('active');
    LoaderShow()
    if (GetByClass.length > 0) {
      SetNewObjectionID([...NewObjectionID, document.getElementsByClassName('active')[0].id])
      var ObjectionTemplateID = document.getElementsByClassName('active')[0].id;
      var DivData = ObjectData.find(data => data.ObjectionTemplateID === ObjectionTemplateID);
      var BodyData = Signature.Data;
      var NewData = DivData.BodyText + BodyData
      document.getElementById("Subject").value = DivData.Subject;
      SetObjectIDTemplateID(ObjectionTemplateID)
      SetSignature({ Data: NewData });
      // var body = "";
      // BodyData.split(ClientData).map(function (address, index) {
      //   if (index == 0) {
      //     body = address
      //     SetObjectIDTemplateID("")
      //   }
      // });
      // var chckEmptyBody = body.replace(/<[\/]{0,1}(p)[^><]*>/ig, '').replace(/<\/?[^>]+(>|$)/g, "").trim()
      // document.getElementById("Subject").value = DivData.Subject;
      // var NewData = "";
      // if (body != "" && chckEmptyBody != "") {
      //   NewData = body + DivData.BodyText + ClientData;
      //   SetObjectIDTemplateID(ObjectionTemplateID)
      // } else {
      //   NewData = DivData.BodyText + BodyData
      //   SetObjectIDTemplateID(ObjectionTemplateID)
      // }
      LoaderHide()
      handleClose()
    } else {
      toast.error("Please select object template");
      LoaderHide()
    }
  }
  // Select Object Templates Ends

  // Active Class Starts
  const ActiveClass = (panel) => () => {
    const element = document.getElementById(panel)
    const elementcs = document.getElementsByClassName("active")
    if (elementcs.length > 0) {
      for (var i = elementcs.length - 1; i >= 0; i--) {
        elementcs[i].classList.remove("active");
      }
    }
    element.classList.add("active");
  }
  // Active Class Ends

  // Starts Reply Send Mail
  // Open Compose
  const OpenComposeReply = (e) => {
    const elementforward = document.getElementById("UserComposeForward")
    elementforward.classList.remove("show");

    // SetToEmailValue([])
    SetSignature({ Data: "" })
    SetNewObjectionID([])
    SetNewTemplateID([])
    SetCCEmailValue([])
    SetBCCEmailValue([])

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        SetSignature({ Data: Result?.data?.Data + ClientData })
      } else {
        toast.error(Result?.data?.Message);
      }
    })
    const element = document.getElementById("UserComposeReply")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
      // document.getElementById("CcReply").style.display = 'none'
      // document.getElementById("BccReply").style.display = 'none'
      SetCCMessages([])
      SetBCCMessages([])
    }

    const elementreply = document.getElementById("UserCompose")
    elementreply.classList.remove("show");
    // const elementreplytwo = document.getElementById("UserComposeForward")
    // elementreplytwo.classList.remove("show");
  };

  const OpenReplyAll = () => {
    RemoveForwardPop()

    SetSignature({ Data: "" })

    const element = document.getElementById("UserComposeReply")

    var CC = localStorage.getItem("CCMessage")
    var BCC = localStorage.getItem("BCCMessage")

    const NewCCEmail = RemoveCurrentEmailFromCC(OpenMessage)
    const NewBCCEmail = RemoveCurrentEmailFromBCC(OpenMessage)

    SetCCMessages(NewCCEmail)

    if (JSON.parse(BCC)[0]?.Email == NewBCCEmail) {
      SetBCCMessages([])
    } else {
      SetBCCMessages(JSON.parse(BCC))
    }

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        SetSignature({ Data: Result?.data?.Data + ClientData })
      } else {
        toast.error(Result?.data?.Message);
      }
    })

    // document.getElementById("CcReply").style.display = 'block'
    // document.getElementById("BccReply").style.display = 'block'

    var elementcc = document.getElementById("CcReply");
    elementcc.classList.add("showcc");

    var elementbcc = document.getElementById("BccReply");
    elementbcc.classList.add("showbcc");

    const elementreply = document.getElementById("UserCompose")
    elementreply.classList.remove("show");
  }

  /* start navcode */
  const mincomposeonReply = () => {
    const element = document.getElementById("maxcomposeReply")
    if (element.classList.contains("minmusbox")) {
      element.classList.remove("minmusbox");
    }
    else {
      element.classList.add("minmusbox");
      element.classList.remove("largebox");
    }
  }

  const maxcomposeonReply = () => {
    const element = document.getElementById("maxcomposeReply")
    if (element.classList.contains("largebox")) {
      element.classList.remove("largebox");
    }
    else {
      element.classList.add("largebox");
      element.classList.remove("minmusbox");
    }
  }
  /* end code*/

  // Open CC
  const OpenCcForward = () => {
    if (Ccflag == false) {
      document.getElementById("CcForward").style.display = 'block'
      SetCcflag(true);
    }
    else {
      document.getElementById("CcForward").style.display = 'none'
      SetCcflag(false);
    }
  };

  // Open BCC
  const OpenBccForward = () => {
    if (Bccflag == false) {
      document.getElementById("BccForward").style.display = 'block'
      SetBccflag(true);
    }
    else {
      document.getElementById("BccForward").style.display = 'none'
      SetBccflag(false);
    }
  };


  // Open CC
  const OpenCcReply = () => {
    var element = document.getElementById("CcReply");
    if (element) {
      element.classList.toggle("showcc");
    }
  };

  // Open BCC
  const OpenBccReply = () => {
    var element = document.getElementById("BccReply");
    if (element) {
      element.classList.toggle("showbcc");
    }
  };

  // Close Compose
  const CloseComposeReply = () => {
    const element = document.getElementById("UserComposeReply")
    element.classList.remove("show");
  }

  // Sent Mail Starts
  const ReplySendMail = async () => {

    var Response, Response2, Response3

    if (ToEmailValue.length > 1) {
      var r = ToEmailValue[0]?.FromEmail
      var s = ToEmailValue.shift()
      Response = ToEmailValue.concat(r)

    } else if (typeof ToEmailValue[0] == "string") {
      Response = ToEmailValue
    } else if (ToEmailValue.length == 0) {
      Response = ""
    }
    else {
      Response = [ToEmailValue[0].FromEmail]
    }

    if (CCMessages.length > 1) {
      // var r = CCMessages[0]?.Email
      // var s = CCMessages.shift()
      // var sr = CCMessages.concat(r)

      Response2 = CCMessages.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (item.Email) {
          return item.Email;
        }
      })

    } else if (typeof CCMessages[0] == "string") {
      Response2 = CCMessages
    } else if (CCMessages.length == 0) {
      Response2 = ""
    } else {
      Response2 = [CCMessages[0].Email]
    }

    if (BCCMessages.length > 1) {
      // var r = BCCMessages[0]?.Email
      // var s = BCCMessages.shift()
      // var sr = BCCMessages.concat(r)

      Response3 = BCCMessages.map(item => {
        if (typeof item === 'string') {
          return item;
        } else if (item.Email) {
          return item.Email;
        }
      })

    } else if (typeof BCCMessages[0] == "string") {
      Response3 = BCCMessages
    } else if (BCCMessages.length == 0) {
      Response3 = ""
    } else {
      Response3 = [BCCMessages[0].Email]
    }

    let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // var EmailResponse = Response.filter(e => e && e.toLowerCase().match(EmailRegex));
    var CCResponse = CCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var BCCResponse = BCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

    var ToEmail = OpenMessage.FromEmail;
    var ToName = OpenMessage.FromName
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = Signature?.Data
    if (Response == "") {
      toast.error("Please specify at least one recipient");
    }
    else if (Body == "") {
      toast.error("Please enter body");
    }
    else {
      LoaderShow()
      var Data = {
        ToEmail: Response.toString(),
        CC: Response2.toString(),
        BCC: Response3.toString(),
        ToName: ToName,
        ID: ID,
        Subject: Subject,
        Body: Body,
        TemplateID: NewTemplateID,
        ObjectIDTemplateID: NewObjectionID
      };
      Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/SentReplyMessage",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
          toast.success(<div>Reply Mail sent successfully.</div>);
          setSelectedRowIndex(0)
          var ID = decrypt(props.location.search.replace('?', ''))
          if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
              if (isstarActive) {
                GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "IsStarredEmails");
              } else {
                GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "");
              }
            } else {
              if (isstarActive) {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "IsStarredEmails")
              } else {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "")
              }
            }
          } else {
            if (ID != "" && ID != null && ID != "undefined") {
              GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "", "");
            } else {
              if (isstarActive) {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "IsStarredEmails")
              } else {
                GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
              }
            }
          }

          OpenComposeReply();
          CloseComposeReply()
          SetToEmailValue([ValueMail])
          LoaderHide()
        } else {
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      })
    }
  }
  // Sent Mail Ends

  const ChatGPT = async () => {
    var VoiceOfTone = document.getElementById("tone").value
    var EmailSummary = document.getElementById("emailsummary").value

    if (VoiceOfTone.length > 0) {
      LoaderShow()
      //remove white space html code 
      const plaiTextBody = GetReplyMessageDetailsTextBody.replace(/&\w+;/g, '').replace(/[\n\t]/g, '');
      var GetReplyMessageDetailsData = plaiTextBody + ' \n\n' + VoiceOfTone + '  \n\n' + EmailSummary;
      var SubjectParamData = {
        prompt: GetReplyMessageDetailsData,
      };
      await Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/GetChatGPTMessageResponse",
        method: "POST",
        data: SubjectParamData,
      }).then((Result) => {
        if (Result.data.StatusMessage == "Success") {
          var body = Result.data?.data;
          setSubject(body)
          var HTMLData = Plain2HTML(body)
          SetSignature({ Data: HTMLData + Signature.Data })
          LoaderHide()
          HanleChatGPTClose()
        } else {
          toast.error("ChatGPT is not responding")
          LoaderHide()
        }
      });
    } else {
      toast.error("Please Add Tone of Voice.")
    }
  }

  // Frola Editor Starts
  Froalaeditor.RegisterCommand('SendReply', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: ReplySendMail
  });
  Froalaeditor.RegisterCommand('DeleteReply', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
    callback: function (cmd, val) {
      CloseComposeReply()
    },
  });
  Froalaeditor.RegisterCommand('ReplySendoption', {
    colorsButtons: ["colorsBack", "|", "-"],
    title: '',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: EditorVariableNames(),
    callback: function (cmd, val) {
      var editorInstance = this;
      editorInstance.html.insert("{" + val + "}");
      SetSignature({
        Data: editorInstance.html.get()
      });
    },
    // Callback on refresh.
    refresh: function ($btn) {
    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {
    }
  });
  Froalaeditor.RegisterCommand('TemplatesOptions', {
    title: 'Templates Option',
    type: 'dropdown',
    focus: false,
    undo: false,
    className: 'tam',
    refreshAfterCallback: true,
    // options: EditorVariableNames(),
    options: {
      'opt1': 'Objections',
      'opt2': 'Templates'
    },
    callback: function (cmd, val) {
      var editorInstance = this;
      if (val == "opt1") {
        LoaderShow()
        var Data = {
          ClientID: ClientID,
          UserID: UserID,
        };
        const ResponseApi = Axios({
          url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateGetAll",
          method: "POST",
          data: Data,
        });
        ResponseApi.then((Result) => {
          if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            if (Result.data.PageData.length > 0) {
              setExpanded(false)
              SetAllObjectData(Result.data.PageData)
              setOpen(true);
              LoaderHide()
            } else {
              toast.error(Result?.data?.Message);
              LoaderHide()
            }
          } else {
            SetAllObjectData('');
            toast.error(Result?.data?.Message);
          }
        });
        // editorInstance.html.insert("{" + val + "}");
      }
      if (val == "opt2") {
        LoaderShow()
        var Data = {
          ClientID: ClientID,
          UserID: UserID,
        };
        const ResponseApi = Axios({
          url: CommonConstants.MOL_APIURL + "/templates/TemplateGetAll",
          method: "POST",
          data: Data,
        });
        ResponseApi.then((Result) => {
          if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            if (Result.data.PageData.length > 0) {
              setExpanded(false);
              SetAllTemplateData(Result.data.PageData)
              setTemOpen(true);
              LoaderHide()
            } else {
              toast.error(Result?.data?.Message);
              LoaderHide()
            }
          } else {
            SetAllTemplateData('');
            toast.error(Result?.data?.Message);
          }
        });

        // editorInstance.html.insert("{" + val + "}");
      }
    },
    // Callback on refresh.
    refresh: function ($btn) {

    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {
    }
  });
  Froalaeditor.RegisterCommand('moreMisc', {
    title: '',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: EditorVariableNames(),
    callback: function (cmd, val) {
      var editorInstance = this;
      editorInstance.html.insert("{" + val + "}");
    },
    // Callback on refresh.
    refresh: function ($btn) {
    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {
    }
  });
  Froalaeditor.RegisterCommand('Chat', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: OpenChatGPTModel,
    icon: `<img src=${Chatgpt} alt=[ALT] />`,
    title: 'Generate auto response',
  });
  const config = {
    quickInsertEnabled: false,
    placeholderText: 'Edit your content here!',
    charCounterCount: false,
    toolbarButtons: [['SendReply', 'ReplySendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions', 'Chat'], ['DeleteReply']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
    imageEditButtons: false,
    key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
  }
  const HandleModelChange = (Model) => {
    SetSignature({
      Data: Model
    });
  }
  var editor = new FroalaEditor('.send', {}, function () {
    editor.button.buildList();
  })
  // Frola Editor Ends
  // Ends Reply Send Mail

  // Starts Forward Reply Send Mail
  // Open Compose
  const OpenComposeForward = (e) => {
    document.getElementById("ToForward").value = ""
    SetForwardSignature({ Data: "" })

    SetForwardToEmailValue([])
    SetForwardCCEmailValue([])
    SetForwardBCCEmailValue([])


    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetForwardMssageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetForwardSignature({ Data: Result?.data?.Data + ClientData })
      } else {
        toast.error(Result?.data?.Message);
      }
    })

    const element = document.getElementById("UserComposeForward")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }

    const elementforward = document.getElementById("UserCompose")
    elementforward.classList.remove("show");

    const elementforwardtwo = document.getElementById("UserComposeReply")
    elementforwardtwo.classList.remove("show");
  };

  // Close Compose
  const CloseComposeForward = () => {
    const element = document.getElementById("UserComposeForward")
    element.classList.remove("show");
  }

  /* start navcode */
  const mincomposeonForward = () => {
    const element = document.getElementById("maxcomposeForward")
    if (element.classList.contains("minmusbox")) {
      element.classList.remove("minmusbox");
    }
    else {
      element.classList.add("minmusbox");
      element.classList.remove("largebox");
    }
  }

  const maxcomposeonForward = () => {
    const element = document.getElementById("maxcomposeForward")
    if (element.classList.contains("largebox")) {
      element.classList.remove("largebox");
    }
    else {
      element.classList.add("largebox");
      element.classList.remove("minmusbox");
    }
  }
  /* end code*/

  // Forward Send Mail Starts
  const ForwardSendMail = () => {

    let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var EmailResponse = ForwardToEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var ForwardCCEmailResponse = ForwardCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var ForwardBCCEmailResponse = ForwardBCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

    var ToEmail = document.getElementById("ToForward").value;
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = ForwardSignature.Data


    if (EmailResponse == "") {
      toast.error("Please specify at least one recipient");
    } else if (Body == "") {
      toast.error("Please enter body");
    }
    else {
      LoaderShow()
      var Data = {
        ToEmail: EmailResponse.toString(),
        CC: ForwardCCEmailResponse.toString(),
        BCC: ForwardBCCEmailResponse.toString(),
        ToName: "",
        ID: ID,
        Subject: Subject,
        Body: ForwardSignature.Data
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/SentForwardMessage",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Forward mail sent successfully.</div>);
          CloseComposeForward()
          SetForwardSignature({ Data: "" })
          LoaderHide()
        }
        else {
          CloseComposeForward()
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      });
    }
  }
  // Forward Send Mail Ends

  // Forward  Reply Frola Editor Starts
  Froalaeditor.RegisterCommand('ForwardReply', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: ForwardSendMail
  });
  Froalaeditor.RegisterCommand('DeleteForward', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
    callback: function (cmd, val) {
      CloseComposeForward()
    },
  });
  Froalaeditor.RegisterCommand('ForwardSendoption', {
    colorsButtons: ["colorsBack", "|", "-"],
    title: '',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: EditorVariableNames(),
    callback: function (cmd, val) {
      var editorInstance = this;
      editorInstance.html.insert("{" + val + "}");
      SetForwardSignature({
        Data: editorInstance.html.get()
      });
    },
    // Callback on refresh.
    refresh: function ($btn) {
    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {

    }
  });
  Froalaeditor.RegisterCommand('moreMisc', {
    title: '',
    type: 'dropdown',
    focus: false,
    undo: false,
    refreshAfterCallback: true,
    options: EditorVariableNames(),
    callback: function (cmd, val) {
      var editorInstance = this;
      editorInstance.html.insert("{" + val + "}");
    },
    // Callback on refresh.
    refresh: function ($btn) {

    },
    // Callback on dropdown show.
    refreshOnShow: function ($btn, $dropdown) {

    }
  });
  const forwardconfig = {
    quickInsertEnabled: false,
    placeholderText: 'Edit your content here!',
    charCounterCount: false,
    toolbarButtons: [['ForwardReply', 'ForwardSendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['DeleteForward']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
    imageEditButtons: false,
    key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4=='
  }
  const ForwardHandleModelChange = (Model) => {
    SetForwardSignature({
      Data: Model
    });
  }
  var editor = new FroalaEditor('.send', {}, function () {
    editor.button.buildList();
  })
  // Forward  Reply Frola Editor Ends
  // Ends Forward Reply Send Mail

  // const HandleChangePage = (Event, NewPage) => {
  //
  //   SetPage(NewPage);
  //   // if (props !== undefined) {
  //   //   const ID = props.location.state;
  //   //   if (ID != "" && ID != null && ID != "undefined") {
  //   //     GetUnansweredResponcesList(ClientID, UserID, NewPage, ID);
  //   //   } else {
  //   //     GetUnansweredResponcesList(ClientID, UserID, NewPage, 0)
  //   //   }
  //   // }
  // };

  const HandleChangePage = (
    event,
    newPage,
  ) => {

    setSelectAllChecked(false)

    ContainerRef.current.scrollTop = 0;
    SetPage(newPage + 1);

    var pn = newPage + 1;
    var ID = decrypt(props.location.search.replace('?', ''))
    // if (ID !== undefined && ID!="") {
    // if (props !== undefined) {
    //   const ID = props.location.state;
    if (!state) {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetUnansweredResponcesList(ClientID, UserID, pn, ID, "", "SeenEmails", "");
      } else {
        GetUnansweredResponcesList(ClientID, UserID, pn, 0, "", "SeenEmails", "")
      }
    } else {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetUnansweredResponcesList(ClientID, UserID, pn, ID, "", "", "");
      } else {
        GetUnansweredResponcesList(ClientID, UserID, pn, 0, "", "", "")
      }
    }
    // }
  };

  const RefreshTable = () => {
    setSelectedRowIndex(0)
    if (selectAllChecked) {
      setSelectAllChecked(!selectAllChecked)
      SetCheckedID([])
    } else {
      SetCheckedID([])
    }
    ContainerRef.current.scrollTop = 0;
    var element = document.getElementById("AllInoxRefreshpanel")
    element.style.display = "none";
    var ID = decrypt(props.location.search.replace('?', ''))
    if (!state) {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetUnansweredResponcesList(ClientID, UserID, 1, ID, "", "SeenEmails", "", "Refresh");
      } else {
        if (isstarActive) {
          setstarActive(false)
        }
        GetUnansweredResponcesList(ClientID, UserID, 1, 0, "", "SeenEmails", "", "Refresh")
      }
    } else {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetUnansweredResponcesList(ClientID, UserID, 1, ID, "", "", "", "Refresh");
      } else {
        if (isstarActive) {
          setstarActive(false)
        }
        GetUnansweredResponcesList(ClientID, UserID, 1, 0, "", "", "", "Refresh")
      }
    }
    dispatch({ type: "refreshClientDetails", payload: true });
  }

  const handleChange = (event) => {
    setSelectedRowIndex(0)
    SetPage(1);
    setState(event.target.checked);
    if (selectAllChecked) {
      setSelectAllChecked(!selectAllChecked)
      SetCheckedID([])
    } else {
      SetCheckedID([])
    }
    if (tableRef.current) {
      tableRef.current.focus();
    }
  };

  const ToggleStartClass = () => {
    setSelectedRowIndex(0)
    setstarActive(!isstarActive);
  };

  const HandleStarredChange = () => {
    if (selectAllChecked) {
      setSelectAllChecked(!selectAllChecked)
      SetCheckedID([])
    } else {
      SetCheckedID([])
    }
    SetPage(1);
    var ID = decrypt(props.location.search.replace('?', ''))
    if (!isstarActive) {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        // GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "IsStarredEmails");
        if (!state) {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "SeenEmails", "IsStarredEmails");
        } else {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "", "IsStarredEmails");
        }
      } else {
        // GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "IsStarredEmails")
        if (!state) {
          GetUnansweredResponcesList(ClientID, UserID, Page, 0, "showloader", "SeenEmails", "IsStarredEmails")
        } else {
          GetUnansweredResponcesList(ClientID, UserID, Page, 0, "showloader", "", "IsStarredEmails")
        }
      }
    } else {
      if (ID != "" && ID != null && ID != "undefined") {
        if (!state) {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "SeenEmails", "");
        } else {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "", "");
        }
      } else {
        // GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "", "")
        if (!state) {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "SeenEmails", "");
        } else {
          GetUnansweredResponcesList(ClientID, UserID, Page, ID, "showloader", "", "");
        }
      }
    }
  }
  const HandleCheckedID = (event, ID) => {
    const { checked } = event.target;

    if (checked) {
      SetCheckedID([...CheckedID, ID])
    } else {
      setSelectAllChecked(false)
      SetCheckedID(state => state.filter((el) => el !== ID));
    }
  }

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    setSelectAllChecked(checked);

    if (checked) {
      const allIds = FollowUpList.map(item => item._id);
      var tempCheckIds = []
      if (CheckedID.length > 0) {
        tempCheckIds = CheckedID
        allIds.map((e) => tempCheckIds.push(e))
        SetCheckedID(tempCheckIds);
      } else {
        SetCheckedID(allIds)
      }
    } else {
      SetCheckedID([]);
    }

  };

  const MarkUnreadEmails = () => {

    if (CheckedID.length > 0) {
      var IdsToUnread

      const idsWithIsSeenTrue = FollowUpList.filter(item => item.IsSeen).map(item => item._id);

      if (!state) {
        IdsToUnread = CheckedID
      } else {
        if (selectAllChecked) {
          IdsToUnread = CheckedID
        } else {
          IdsToUnread = idsWithIsSeenTrue
        }
      }

      var arr2Set = new Set(idsWithIsSeenTrue);

      FollowUpList.forEach(item => {
        if (CheckedID.includes(item._id)) {
          item.IsSeen = false;
        }
      });

      LoaderShow()
      toast.success("Mails are unread successfully.")
      setSelectAllChecked(false)
      LoaderHide()
      SetFollowUpList(FollowUpList)
      SetCheckedID([])

      var Data = {
        EmailsIds: CheckedID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/MarkUnreadEmails",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          SetCheckedID([])
          // LoaderHide()
          // toast.success("Mails are unread successfully.")
          // var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID != "" && ID != null && ID != "undefined") {
          //   GetUnansweredResponcesList(ClientID, UserID, Page, ID, "", "SeenEmails", "");
          // } else {
          //   if (isstarActive) {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "IsStarredEmails");
          //   } else {
          //     GetUnansweredResponcesList(ClientID, UserID, Page, 0, "", "SeenEmails", "");
          //   }
          // }
        } else {
          // LoaderHide()
        }
      });
    } else {
      toast.error("Please select email")
    }

  }


  const MarkReadEmails = () => {
    if (CheckedID.length > 0) {
      var IdsToUnread

      const idsWithIsSeenTrue = FollowUpList.filter(item => item.IsSeen == false).map(item => item._id);

      if (!state) {
        IdsToUnread = CheckedID
      } else {
        if (selectAllChecked) {
          IdsToUnread = CheckedID
        } else {
          IdsToUnread = idsWithIsSeenTrue
        }
      }

      var arr2Set = new Set(idsWithIsSeenTrue);

      FollowUpList.forEach(item => {
        if (CheckedID.includes(item._id)) {
          item.IsSeen = true;
        }
      });

      LoaderShow()
      toast.success("Mails are read successfully.")
      setSelectAllChecked(false)
      LoaderHide()
      SetFollowUpList(FollowUpList)
      SetCheckedID([])

      var Data = {
        EmailsIds: CheckedID,
      };

      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/MarkReadEmails",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          setIsChecked(false);
          SetCheckedID([])
        } else {
          // LoaderHide()
        }
      });
    } else {
      toast.error("Please select email")

    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowUp') {
      index--;
      scrollToSelectedRow(index, 1)

      setSelectedRowIndex((prevIndex) => Math.max(prevIndex - 1, 0));

    } else if (e.key === 'ArrowDown') {
      index++;
      scrollToSelectedRow(index, 1);
      setSelectedRowIndex((prevIndex) =>
        Math.min(prevIndex + 1, FollowUpList.length - 1)
      );
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (index >= 0 && index < FollowUpList.length) {
        const selectedMessage = FollowUpList[index];
        OpenMessageDetails(selectedMessage._id, index, "", "updatelist");
      }
    }
  };

  const scrollToSelectedRow = (index) => {
    const selectedRow = document.getElementById(`row-${index}`);
    if (!selectedRow) {
      return;
    }
    const mainDiv = document.getElementById('eventselectedrow');
    const targetScrollPosition = selectedRow.offsetTop - 70;
    mainDiv.scrollTop = targetScrollPosition;
  };


  useEffect(() => {
    // Focus on the table when the component mounts
    if (tableRef.current) {
      tableRef.current.focus();
    }
  }, []);

  return (
    <>
      <Modal className="modal-lister max-767"
        open={ChatGPTMOdel}
        onClose={HanleChatGPTClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='m-head'>
            <Typography id="modal-modal-title" variant="h4" component="h4">
              ChatGPT
            </Typography>
          </div>
          <div className='m-body'>
            <Row className='mb-3 px-3'>
              <Col xs={3} className="">
                <h6 className='mt-2'>Tone of Voice :</h6>
              </Col>
              <Col xs={9} className="textarea-box my-0">
                <textarea className='hei-50' id='tone' name='tone' />
              </Col>
            </Row>
            <Row className='px-3'>
              <Col xs={3} className="">
                <h6>Email Summary :</h6>
              </Col>
              <Col xs={9} className="textarea-box">
                <textarea id='emailsummary' name='emailsummary' />
              </Col>
            </Row>
          </div>
          <div className='m-fotter' align="right">
            <ButtonGroup variant="text" aria-label="text button group">
              <Button variant="contained btn btn-orang smallbtn mr-3" onClick={HanleChatGPTClose}> Cancel</Button>
              <Button variant="contained btn btn-primary smallbtn" onClick={ChatGPT} > Request</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>

      <Modal className="modal-lister"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='m-head'>
            <Typography id="modal-modal-title" variant="h4" component="h4">
              Select Objection
            </Typography>
          </div>
          <div className='m-body'>
            <div className='listcardman'>
              {ObjectData?.length > 0 && ObjectData?.map((row, index) => (
                <div className='cardtemplate' onClick={ActiveClass(row.ObjectionTemplateID)} id={row.ObjectionTemplateID} >
                  <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
                  <Accordion className='activetemplate' expanded={expanded === row.ObjectionTemplateID} onChange={HandleChange(row.ObjectionTemplateID)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                    </AccordionSummary>
                    <AccordionDetails >
                      <Typography >
                        {parse(row.BodyText)}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>

              ))}


            </div>

          </div>
          <div className='m-fotter' align="right">
            <ButtonGroup variant="text" aria-label="text button group">
              <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleClose}> Cancel</Button>
              <Button variant="contained btn btn-primary smallbtn" onClick={SelectObjectTemplate}> Select</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
      <Modal className="modal-lister"
        open={temopen}
        onClose={handleTemClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className='m-head'>
            <Typography id="modal-modal-title" variant="h4" component="h4">
              Select Template
            </Typography>
          </div>
          <div className='m-body'>
            <div className='listcardman'>

              {TemplateData?.length > 0 && TemplateData?.map((row, index) => (
                <div className='cardtemplate' onClick={ActiveClass(row.TemplatesID)} id={row.TemplatesID} >
                  <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
                  <Accordion className='activetemplate' expanded={expanded === row.TemplatesID} onChange={HandleChange(row.TemplatesID)}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2bh-content"
                      id="panel2bh-header"
                    >
                    </AccordionSummary>
                    <AccordionDetails >
                      <Typography >
                        {parse(row.BodyText)}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
            </div>

          </div>
          <div className='m-fotter' align="right">
            <ButtonGroup variant="text" aria-label="text button group">
              <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleTemClose}> Cancel</Button>
              <Button variant="contained btn btn-primary smallbtn" onClick={SelectTemplate}> Select</Button>
            </ButtonGroup>
          </div>
        </Box>
      </Modal>
      <Modal className="modal-pre"
        open={StarPopModel}
        onClose={CloseStarPopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Style} className="modal-prein">
          <div className='p-5 text-center'>
            <img src={Emailinbox} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Are you sure
            </Typography>
            {
              FollowUpList?.find((e) => e?._id === OpenMessage?._id)?.IsStarred === false ?
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to star an email ?
                </Typography>
                :
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to unstar an email ?
                </Typography>
            }
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateStarMessage(OpenMessage._id, "opnemodel", MailNumber - 1); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseStarPopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal className="modal-pre"
        open={FollowupPopModel}
        onClose={FollowupPopClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-prein">
          <div className='px-5 pt-5 text-center'>
            <img src={Emailcall} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Follow Up Later
            </Typography>
          </div>
          <div className='px-5 pb-5 text-left datepikclen'>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Choose date for follow up later.
            </Typography>
            <div className="pt-3">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={0}>
                  <DesktopDatePicker
                    inputFormat="MM/dd/yyyy"
                    value={FollowupDate}
                    onChange={SelectFollowupDate}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
            </div>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateFollowupMessage(OpenMessage._id); }}>
              OK
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseFollowupPopModel(); }}>
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={OtherInboxPopModel}
        onClose={CloseOtherInboxPopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="modal-prein">
          <div className='p-5 text-center'>
            <img src={Emailinbox} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Are you sure
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              you want to move this e-mail into other inbox ?
            </Typography>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateOtherInbox(OpenMessage._id); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseOtherInboxPopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal className="modal-pre"
        open={DeletePopModel}
        onClose={CloseDeletePopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Style} className="modal-prein">
          <div className='p-5 text-center'>
            <img src={Emailinbox} width="130" className='mb-4' />
            <Typography id="modal-modal-title" variant="b" component="h6">
              Are you sure
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              you want to delete a email ?
            </Typography>
          </div>
          <div className='d-flex btn-50'>
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteMessage(OpenMessage._id); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
              No
            </Button>
          </div>
        </Box>
      </Modal>

      <div className='lefter'>
        {/* <Navigation menupage="/Focused" MenuID={MenuID} /> */}
      </div>
      <div className='righter'>
        <header className='minisearchhed'>
          <Row>
            <Col sm={8}>
              <Search className='serchinbox' onKeyUp={(e) => SearchBox(e, this)}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  defaultValue={SearchInbox}
                  placeholder="Search…"
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Search>
            </Col>
          </Row>
        </header>
        <div className='bodyview' >
          <SplitPane className='d-block-child'
            split="horizontal"
            minSize={150}
            maxSize={-200}
            defaultSize={"40%"}
          >
            <>
              <div className='orangbg-table'>
                <Button className='btn-mark' title='Mark as unread' onClick={MarkUnreadEmails} >
                  <VisibilityOffIcon />
                </Button>
                <Button className='btn-mark' title='Mark as read' onClick={MarkReadEmails} >
                  <Visibility />
                </Button>
                <div className='rigter-coller'>
                  <ToggleButton title="Starred" onChange={HandleStarredChange} onClick={ToggleStartClass}
                    className={`starfilter startselct ${isstarActive ? "Mui-selected" : "null"}`}
                    value="check" >  {/* Mui-selected */}
                    <StarBorderIcon className='starone' />
                    <StarIcon className='selectedstart startwo' />
                    Starred
                  </ToggleButton>
                  {/* <FormControlLabel className='check-unseen' control={<Checkbox defaultChecked onChange={handleChange} />} label="Unread" /> */}
                  <FormControlLabel className='check-unseen' control={<Checkbox onChange={handleChange} />} label="Unread" />

                  <a onClick={RefreshTable} className='Refreshbtn' ><RefreshIcon /><span id="AllInoxRefreshpanel" style={{ display: "none" }} className='roundgreenemail'  ></span></a>
                  {
                    OpenMessage?.length == 0 ? "" :
                      <div className='pagination-pa' >
                        <TablePagination
                          component="div"
                          count={TotalRecord}
                          page={parseInt(PageValue) - 1}
                          rowsPerPage="50"
                          onPageChange={HandleChangePage}

                        />
                      </div>
                  }
                </div>
              </div>
              <div id="eventselectedrow" className="simulationDiv" ref={ContainerRef}>
                <div tabIndex={0} onKeyDown={(e) => handleKeyDown(e, selectedRowIndex)} ref={tableRef}>
                  <Table className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell component="th" className='px-0 w-0'>
                          <Checkbox
                            name="selectall"
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={(e) => handleSelectAll(e)}
                          />
                        </TableCell>
                        <TableCell component="th" width={'30px'} align="center"></TableCell>
                        {/* <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell> */}
                        <TableCell component="th">From Email</TableCell>
                        <TableCell component="th">Subject</TableCell>
                        <TableCell component="th">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {FollowUpList.map((item, index) => {
                        var fullName = item.FromName;
                        var cleanedName = fullName.replace(/<[^>]+>/, "");
                        cleanedName.trim();
                        return (
                          <TableRow
                            // className={`${Active === item._id ? "selected-row" : ""}`}
                            // className={`${Active === item._id ? "selected-row" : ""} ${item.IsSeen ? "useen-email" : "seen-email"}`}
                            // key={item.name}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={item.name}
                            className={`${selectedRowIndex === index ? 'selected-row' : ''} ${item?.IsSeen ? "useen-email" : "seen-email"}`}
                            onClick={() => setSelectedRowIndex(index)}
                            id={"row-" + index}
                          >
                            <TableCell align='center'>
                              <Checkbox type="checkbox" className='my-checkbox' checked={CheckedID.includes(item._id)} onChange={(e) => HandleCheckedID(e, item._id)} />
                              {/* <Checkbox onChange={(e) => HandleCheckedID(e, item._id)} color="primary" /> */}
                            </TableCell>
                            <TableCell width={'35px'} align="center">
                              <ToggleButton title="Starred" className='startselct' value="check" selected={item.IsStarred} id={"star_" + item._id} onClick={() => UpdateStarMessage(item._id, "", index)} >
                                <StarBorderIcon className='starone' />
                                <StarIcon className='selectedstart startwo' />
                              </ToggleButton>
                            </TableCell>
                            {/* <TableCell width={'35px'}></TableCell> */}
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {cleanedName + " " + "(" + item.FromEmail + ")"}</TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {item?.Subject ? (
                              <>
                                {item.Subject.split(' ').slice(0, 8).join(' ')}
                                {item.Subject.split(' ').length > 8 ? '...' : ''}
                              </>
                            ) : null}</TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')}>{Moment(item.MessageDatetime).format("MM/DD/YYYY hh:mm a")}</TableCell>
                          </TableRow>)
                      }
                      )}
                    </TableBody>
                  </Table>

                  {/* <Stack className='my-4 page-dec' spacing={2}> */}
                  {/* <Pagination onChange={HandleChangePage} variant="outlined" shape="rounded" /> */}
                  {/* </Stack> */}
                </div>
              </div>
            </>
            <div className="statisticsDiv">
              <div className='composehead px-3'>
                <Row>
                  <Col sm={6}>
                    {
                      OpenMessage == 0 ? '' :
                        <div className='lablebox'>
                          <label>
                            <b>From : </b>
                            {OpenMessage.FromEmail}
                          </label>
                          {/* <label><b>To : </b>{OpenMessage?.ToNameEmail?.map((e) => e?.Email)?.join(", ")}</label> */}
                          {
                            OpenMessage?.ToNameEmail?.length > 0 ?
                              <label>

                                <b>To : </b>
                                {OpenMessage?.ToNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')}

                                <Button className='btnemail' aria-describedby={idto} variant="contained" onClick={tohandleClick}>
                                  <ArrowDropDown />
                                </Button>

                                <Popover className='popupemails'
                                  id={idto}
                                  open={toopen}
                                  anchorEl={anchorEl}
                                  onClose={tohandleClose}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  {OpenMessage?.ToNameEmail?.map((e) => e?.Email)?.join(", ")}
                                </Popover>
                              </label> : ""
                          }
                          {
                            OpenMessage?.CcNameEmail?.length > 0 ?
                              // <label><b>Cc : </b>{OpenMessage?.CcNameEmail?.map((e) => e?.Email)?.join(", ")}</label> : ""
                              <label>

                                <b>CC : </b>
                                {OpenMessage?.CcNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')}

                                <Button className='btnemail' aria-describedby={idcc} variant="contained" onClick={cchandleClick}>
                                  <ArrowDropDown />
                                </Button>

                                <Popover className='popupemails'
                                  id={idcc}
                                  open={ccopen}
                                  anchorEl={ccanchorEl}
                                  onClose={cchandleClose}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  {OpenMessage?.CcNameEmail?.map((e) => e?.Email)?.join(", ")}
                                </Popover>
                              </label> : ""
                          }
                          {
                            OpenMessage?.BccNameEmail?.length > 0 ?
                              // <label><b>Bcc : </b>{OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")}</label> : ""
                              <label>
                                <b>BCC : </b>
                                {OpenMessage?.BccNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')}
                                <Button className='btnemail' aria-describedby={idbcc} variant="contained" onClick={bcchandleClick}>
                                  <ArrowDropDown />
                                </Button>

                                <Popover className='popupemails'
                                  id={idbcc}
                                  open={bccopen}
                                  anchorEl={bccanchorEl}
                                  onClose={bcchandleClose}
                                  anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                                  transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                  }}
                                >
                                  {OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")}
                                </Popover>

                              </label> : ""
                          }
                          <label><b>Subject : </b>{OpenMessage.Subject}</label>
                        </div>
                    }
                  </Col>
                  <Col sm={6}>
                    <div className='lablebox text-right'>
                      <label>{OpenMessage == 0 ? '' : Moment(OpenMessage.MessageDatetime).format("MM/DD/YYYY hh:mm A")}</label>
                    </div>

                    {
                      OpenMessage == 0 ? '' :
                        <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                          <Button>
                            <label>{MailNumber} / {FollowUpList.length}</label>
                          </Button>
                          <Button>
                            <ToggleButton className={"startselct temp-class" + " " + MUIClass} title="Starred" value="check" id={"starbelow_" + OpenMessage._id} onClick={() => OpenStarPopModel()}>
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Button>
                          <Button onClick={OpenFollowupPopModel}>
                            <img src={icontimer} title={"Follow up later"} />
                          </Button>
                          <Button onClick={OpenOtherInboxPopModel}>
                            <img src={inbox} title={"Other inbox"} />
                          </Button>
                          <Button>
                            <a><img src={iconsarrow2} onClick={OpenComposeReply} title={"Reply"} /></a>
                          </Button>
                          <Button>
                            <a><img src={icons_replyall} onClick={OpenReplyAll} title={"Reply all"} /></a>
                          </Button>
                          <Button>
                            <a><img src={iconsarrow1} onClick={OpenComposeForward} title={"Forward"} /></a>
                          </Button>
                          {<Button onClick={OpenDeletePopModel}>
                            <img src={icondelete} title="Delete" />
                          </Button>}
                        </ButtonGroup>
                    }
                  </Col>
                </Row>
              </div>
              {/* <div className='emailbodybox'>
                {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
              </div> */}
              {/* <div className='emailbodybox' dangerouslySetInnerHTML={{ __html: OpenMessage.HtmlBody }}></div> */}
              <Frame className='emailbodybox' width="100%" ><div dangerouslySetInnerHTML={{ __html: OpenMessage.HtmlBody }}></div></Frame>
            </div>
          </SplitPane>
        </div>
      </div>
      <div className='composebody' id='maxcomposeReply'>
        <div className="usercompose userdefual" id="UserComposeReply">
          <div className='hcompose px-3'>
            <Row>
              <Col><h4>Reply message</h4></Col>
              <Col className='col text-right'>
                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                  <Button onClick={mincomposeonReply} className="minicon">
                    <img src={Minimize} />
                  </Button>
                  <Button onClick={maxcomposeonReply} className="maxicon">
                    <img src={Maximize} />
                  </Button>
                  <Button onClick={CloseComposeReply}>
                    <img src={Close} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3'>
            <Row className='px-3 py-1'>
              <Col xs={1} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={8} className="px-0">
                {/* <Input className='input-clend' id='To' name='To' value={OpenMessage?.FromEmail} disabled /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="To"
                    value={ToEmailValue}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetToEmailValue(newValue);
                    }}
                    freeSolo
                    clearOnBlur
                    onKeyDown={(event, newValue) => {
                      if (event.key === 'Tab') {
                        const newInputValue = event.target.value;
                        SetToEmailValue([...ToEmailValue, newInputValue]);
                      }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetToEmailValue([...ToEmailValue, newInputValue]);
                        event.target.value = '';
                      }
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = false
                        if (option?.FromEmail != undefined && option?.FromEmail != "") {
                          ValidEmail = ValidateEmail(option?.FromEmail)
                        } else {
                          ValidEmail = ValidateEmail(option)
                        }
                        if (ValidEmail) {
                          if (option?.FromEmail != undefined && option?.FromEmail != "") {
                            return (<Chip variant="outlined" label={option?.FromEmail} {...getTagProps({ index })} />)
                          } else {
                            return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                          }
                        }
                      }
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                </div>
              </Col>
              <Col xs={3} className='col text-right d-flex px-0 btn-whitedp'>
                <Button className='lable-btn' onClick={OpenCcReply}>Cc</Button>
                <Button className='lable-btn' onClick={OpenBccReply}>Bcc</Button>
              </Col>
            </Row>
          </div>
          <div className='subcompose cc px-3 hidecc' id='CcReply'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Cc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='CC' name='Cc' /> */}
                <div className='multibox-filter'>
                  {/* <Autocomplete
                    multiple
                    id="CC"
                    value={CCEmailValue}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetCCEmailValue(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = ValidateEmail(option)
                        if (ValidEmail) {
                          return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                        }
                      }
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "SetToEmailValue
                        placeholder=" "
                      />
                    )}
                  /> */}
                  <Autocomplete
                    multiple
                    id="Cc"
                    value={CCMessages}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetCCMessages(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = false
                        if (option?.Email != undefined && option?.Email != "") {
                          ValidEmail = ValidateEmail(option?.Email)
                        } else {
                          ValidEmail = ValidateEmail(option)
                        }
                        if (ValidEmail) {
                          if (option?.Email != undefined && option?.Email != "") {
                            return (<Chip variant="outlined" label={option?.Email} {...getTagProps({ index })} />)
                          } else {
                            return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                          }
                        }
                      }
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                  {/* <Autocomplete
                    multiple
                    id="Cc"
                    value={CCMessages}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetCCMessages(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = false
                        if (option?.Email != undefined && option?.Email != "") {
                          ValidEmail = ValidateEmail(option?.Email)
                        } else {
                          ValidEmail = ValidateEmail(option)
                        }
                        if (ValidEmail) {
                          if (option?.Email != undefined && option?.Email != "") {
                            return (
                              <Chip variant="outlined" label={option?.Email} {...getTagProps({ index })} />
                            )
                          } else {
                            return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                          }
                        }
                      }
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  /> */}
                </div>
              </Col>
            </Row>
          </div>
          <div className='subcompose bcc px-3 hidebcc' id='BccReply'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Bcc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='BCC' name='Bcc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="BCC"
                    value={BCCMessages}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetBCCMessages(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = false
                        if (option?.Email != undefined && option?.Email != "") {
                          ValidEmail = ValidateEmail(option?.Email)
                        } else {
                          ValidEmail = ValidateEmail(option)
                        }
                        if (ValidEmail) {
                          if (option?.Email != undefined && option?.Email != "") {
                            return (<Chip variant="outlined" label={option?.Email} {...getTagProps({ index })} />)
                          } else {
                            return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                          }
                        }
                      }
                      )
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className='bodycompose'>
            <Row className='pt-2'>
              <Col>
                <div className='FroalaEditor'>
                  <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className='composebody' id='maxcomposeForward'>
        <div className="usercompose userdefual" id="UserComposeForward">
          <div className='hcompose px-3'>
            <Row>
              <Col><h4>Forward message</h4></Col>
              <Col className='col text-right'>
                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                  <Button onClick={mincomposeonForward} className="minicon">
                    <img src={Minimize} />
                  </Button>
                  <Button onClick={maxcomposeonForward} className="maxicon">
                    <img src={Maximize} />
                  </Button>
                  <Button onClick={CloseComposeForward}>
                    <img src={Close} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={8} className="px-0">
                {/* <Input className='input-clend' id='ToForward' name='ToForward' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="ToForward"
                    options={top100Films.map((option) => option.title)}
                    value={ForwardToEmailValue}
                    onChange={(event, newValue) => {
                      SetForwardToEmailValue(newValue);
                    }}
                    freeSolo
                    clearOnBlur
                    onKeyDown={(event, newValue) => {
                      if (event.key === 'Tab') {
                        const newInputValue = event.target.value;
                        SetForwardToEmailValue([...ForwardToEmailValue, newInputValue]);
                      }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetForwardToEmailValue([...ForwardToEmailValue, newInputValue]);
                        event.target.value = '';
                      }
                    }}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = ValidateEmail(option)
                        if (ValidEmail) {
                          return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                        }
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                </div>
              </Col>
              <Col xs={3} className='col text-right d-flex px-0 btn-whitedp'>
                <Button className='lable-btn' onClick={OpenCcForward}>Cc</Button>
                <Button className='lable-btn' onClick={OpenBccForward}>Bcc</Button>
              </Col>
            </Row>
          </div>
          <div className='subcompose cc px-3' id='CcForward'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Cc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='CC' name='Cc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="CC"
                    options={top100Films.map((option) => option.title)}
                    value={ForwardCCEmailValue}
                    onChange={(event, newValue) => {
                      SetForwardCCEmailValue(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = ValidateEmail(option)
                        if (ValidEmail) {
                          return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                        }
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className='subcompose bcc px-3' id='BccForward'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Bcc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='BCC' name='Bcc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="BCC"
                    options={top100Films.map((option) => option.title)}
                    value={ForwardBCCEmailValue}
                    onChange={(event, newValue) => {
                      SetForwardBCCEmailValue(newValue);
                    }} freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = ValidateEmail(option)
                        if (ValidEmail) {
                          return (<Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                        }
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label=" "
                        placeholder=" "
                      />
                    )}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className='bodycompose'>
            <Row className='pt-2'>
              <Col>
                <div className='FroalaEditor'>
                  {/* <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} /> */}
                  <FroalaEditor tag='textarea' id="signature" config={forwardconfig} onModelChange={ForwardHandleModelChange} model={ForwardSignature.Data} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <UnansweredResponsesComposePage GetUnansweredResponcesList={GetUnansweredResponcesList} />
    </>
  );
}













