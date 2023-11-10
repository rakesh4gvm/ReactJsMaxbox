import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, IsGreaterDate, EditorVariableNames, ValidateEmail, decrypt, Plain2HTML, RemoveForwardPop, RemoveCurrentEmailFromCC, RemoveCurrentEmailFromBCC } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import StarredComposePage from '../StarredComposePage/StarredComposePage';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { Box } from '@material-ui/core';
import { styled, alpha } from '@material-ui/core/styles';
import { Input } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TablePagination from '@mui/material/TablePagination';
import RefreshIcon from '@material-ui/icons/Refresh';


import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import Close from '../../images/icons/w-close.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icons_replyall from '../../images/icons_replyall.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import inbox from '../../images/inbox.svg';
import icondelete from '../../images/icon_delete.svg';
import Emailcall from '../../images/email_call_img.png';
import Chatgpt from '../../images/icons/chatgpt-icon.svg';

import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { toast } from "react-toastify";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import StarIcon from '@material-ui/icons/Star';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Popover from '@mui/material/Popover';
import { ArrowDropDown } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';
import Frame from 'react-frame-component';
import { useDispatch, useSelector } from 'react-redux';
import { TurnLeft } from '@mui/icons-material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LabelIcon from '@material-ui/icons/Label';  
import InfoSharpIcon from '@mui/icons-material/InfoSharp';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

export default function OtherInboxPage(props) {
  const [StarredList, SetStarredList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(50);
  const [SortField, SetsortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
  const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
  const [OtherInboxPopModel, SetOtherInboxPopModel] = React.useState(false);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [temopen, setTemOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [TotalRecord, SetTotalRecord] = React.useState(0);
  const [MenuID, SetMenuID] = React.useState("");
  const [PageValue, SetPageValue] = React.useState(1)
  const [Active, SetActive] = useState("");
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [ToEmailValue, SetToEmailValue] = React.useState([]);
  const [CCEmailValue, SetCCEmailValue] = React.useState([]);
  const [BCCEmailValue, SetBCCEmailValue] = React.useState([]);
  const [CCMessages, SetCCMessages] = React.useState([])
  const [BCCMessages, SetBCCMessages] = React.useState([])
  const [TotalCount, SetTotalCount] = useState(0)
  const [IsBottom, SetIsBottom] = useState(false)
  const [Ccflag, SetCcflag] = useState(false);
  const [Bccflag, SetBccflag] = useState(false);
  const [CcReplyflag, SetCcReplyflag] = useState(false);
  const [BccReplyflag, SetBccReplyflag] = useState(false);
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
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [SenderDetails, SetSenderDetails] = React.useState(null);
  const [ReplyText, SetReplyText] = useState("Reply")
  const OpenChatGPTModel = () => SetChatGPTModel(true)
  const [EmailAccountUsers, SetEmailAccountUsers] = useState([])

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

  const editorRef = useRef(null); 
  const [labelsData, setLabelsData] = useState([])
  const [SelectedMultipleLabelValue, SetSelectedMultipleLabelValue] = useState(null);
  const [contextMenu, setContextMenu] = React.useState(null);
  const [isSubMenuOpen, setSubMenuOpen] = React.useState(false);
  const [MessageId, SetMessageId] = useState("");
  const [MessageIsSeen, SetMessageIsSeen] = useState();
  const [AccountId, SetAccountId] = useState();

  useEffect(() => {
    document.title = 'All Inbox | MAXBOX';
    GetClientID();

  }, [SearchInbox, state])

  const HandleMultipleLabelID = (event, newValue) => {
    SetSelectedMultipleLabelValue(newValue)
  }

  const Apply = () => {
    SetCheckedID([]);
    SetMessageId("");
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);
    var RecieverEmailLableIDs = SelectedMultipleLabelValue.map((e) => e.RecieverEmailLableID)
    if (CheckedID.length > 0) {
        const Data = {
            RecieverEmailLableIDs: RecieverEmailLableIDs,
            MessageIDs: CheckedID,
        }
        LoaderShow();
        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/AssignLabels",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                // setLabelBoxVisible(false)
                toast.success(Result?.data?.Message);
                GetClientID();
                LoaderHide();
                SetCheckedID([]);
                dispatch({ type: "refreshClientDetails", payload: true });
            }
            else {
                // setLabelBoxVisible(false);
                LoaderHide();
                toast.error(Result?.data?.Message);
            }
        });
    }
    else {
        // setLabelBoxVisible(false);
        LoaderHide();
        toast.error("Please select email");
    }
  }

  const MarkAsSpam = (MessageId, AccountId) => {
    SetCheckedID([]);
    SetMessageId("");
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);

    const Data = {
        AccountID: AccountId,
        MessageID: MessageId,
    }
    LoaderShow();
    const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/MarkAsSpam",
        method: "POST",
        data: Data,
    });
    ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            toast.success(Result?.data?.Message);
            GetClientID();
            LoaderHide();
            SetCheckedID([]);
            dispatch({ type: "refreshClientDetails", payload: true });
        }
        else {
            LoaderHide();
            toast.error(Result?.data?.Message);
        }
    });
}

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
  
  const handleContextMenu = (event) => {
    event.preventDefault();
    SetAccountId("");
    var msgId = event.currentTarget.getAttribute('messageid');
    var isSeen = event.currentTarget.getAttribute('isseen') == "true" ? true : false;
    var accountId = event.currentTarget.getAttribute('accountid');
    SetAccountId(accountId);
    // SetCheckedID([...CheckedID, msgId]);
    setSelectAllChecked(false);
    SetCheckedID([msgId]);
    SetMessageId(msgId);
    SetMessageIsSeen(isSeen);
    setContextMenu((prevContextMenu) => (prevContextMenu ? null : {
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
    }));

    // Get Label Details
    let Data = {
      AccountID: accountId
    };

    const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/GetEmailAccountLabels",
        method: "POST",
        data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if(Result.data.PageData.length > 0){
            setLabelsData(Result.data.PageData);
        }
      }
    });
  };
  
  const texthandleClose = (event) => {
    event.preventDefault();
    SetCheckedID([]);
    setLabelsData([]);
    SetMessageId("");
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false); // Close the submenu when the main menu is closed
  };
  
  const handleSubMenuOpen = (event) => {
    event.preventDefault();
    setSubMenuOpen(true);
    // setContextMenu({
    //   mouseX: event.clientX + 0, // Adjust the position as needed
    //   mouseY: event.clientY - 1,
    // });
  };
  
  const handleSubMenuClose = () => {
    setSubMenuOpen(false);
  };

  const toopen = Boolean(anchorEl);
  const ccopen = Boolean(ccanchorEl);
  const bccopen = Boolean(bccanchorEl);
  const idto = toopen ? 'simple-popover' : undefined;
  const idcc = ccopen ? 'simple-popover' : undefined;
  const idbcc = bccopen ? 'simple-popover' : undefined;

  useEffect(() => {
    document.title = 'Starred | MAXBOX';
    GetClientID();
    SetCheckedID([]);
    setSelectAllChecked(false);
  }, [SearchInbox, state])

  const ContainerRef = useRef(null);

  // Start Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetClientList(UserDetails.ClientID)
    GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
    // if (props !== undefined) {
    //   const ID = props.location.state;
    var ID = decrypt(props.location.search.replace('?', ''))
    // if (ID !== undefined && ID!="") {
    if (!state) {
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetStarredList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "SeenEmails","");
      } else {
        GetStarredList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "SeenEmails", "Refresh")
      }
    } else {
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetStarredList(UserDetails.ClientID, UserDetails.UserID, Page, ID, "","");
      } else {
        GetStarredList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "","")
      }
    }
    // }
  }
  // End Get Client ID

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

  const GetEmailAccountUsers = (CID, UID) => {
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/email_account/EmailAccountGetUsers",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {

        const UpdatedData = Result.data.PageData.slice(); // Create a shallow copy of the array

        const FirstIsSendDefaultTrue = UpdatedData.find((item) => item.IsSendDefault);

        if (FirstIsSendDefaultTrue) {
          // Move the first item with IsSendDefault true to the beginning of the array
          UpdatedData.splice(UpdatedData.indexOf(FirstIsSendDefaultTrue), 1);
          UpdatedData.unshift(FirstIsSendDefaultTrue);
        }

        if (UpdatedData[0]?.IsSendDefault) {
          SetEmailAccountUsers(UpdatedData)
        } else {
          SetEmailAccountUsers(Result.data.PageData)
        }

      } else {
        toast.error(Result?.data?.Message);
      }
    })
  }

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
            var total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount : 0
            // if (ShowEmails == "SeenEmails" ) {
            //   total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount : 0
            // }else 
            if (ShowEmails == "") {
              var StarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].StarredCount : 0
              var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenStarredCount : 0
              total = StarredCount - SeenStarredCount;
              dispatch({ type: 'unSeenStarredCount', payload: total });
            }

            if (total < 0) {
              total = 0
            }
            SetTotalRecord(total);
          } else {
            var total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredCount)?.reduce((a, b) => a + b, 0) : 0

            var StarredCount = total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenStarredCount = total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredCount)?.reduce((a, b) => a + b, 0) : 0
            var UnSeenStarredtotal = StarredCount - SeenStarredCount;
            dispatch({ type: 'unSeenStarredCount', payload: UnSeenStarredtotal });

            var InboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.InboxCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenInboxCount)?.reduce((a, b) => a + b, 0) : 0
            var unSeenInboxCount = InboxCount - SeenInboxCount
            dispatch({ type: 'unSeenInboxCount', payload: unSeenInboxCount });

            var FocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.FocusedCount)?.reduce((a, b) => a + b, 0) : 0
            var SeenFocusedCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenFocusedCount)?.reduce((a, b) => a + b, 0) : 0
            var UnSeenFoucsedtotal = FocusedCount - SeenFocusedCount
            dispatch({ type: 'unSeenFocusedCount', payload: UnSeenFoucsedtotal });

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

            if (ShowEmails == "SeenEmails") {
              total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredCount)?.reduce((a, b) => a + b, 0) : 0
            }
            else if (ShowEmails == "") {
              var StarredCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredCount)?.reduce((a, b) => a + b, 0) : 0
              var SeenStarredCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenStarredCount)?.reduce((a, b) => a + b, 0) : 0
              total = StarredCount - SeenStarredCount;
              dispatch({ type: 'unSeenStarredCount', payload: total });
            }
            // else if (ShowEmails == "" && IsStarred == "IsStarredEmails") {
            //   total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0

            // }
            // else if (ShowEmails == "SeenEmails" && IsStarred == "IsStarredEmails") {
            //   total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
            // }
            if (total < 0) {
              total = 0
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
  const GetStarredList = (CID, UID, PN, ID, ShowEmails, RefreshString) => {
    FromEmailList(CID, UID, ID, ShowEmails);
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

    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      IsInbox: false,
      IsStarred: true,
      IsFollowUp: false,
      IsSpam: false,
      IsOtherInbox: false,
      AccountIDs: AccountIDs,
      UnseenEmails: UnseenEmails
    };
    LoaderShow()
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/starredemailhistory/StarredEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetStarredList(Result.data.PageData)
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
            SetStarredList(updatedArr)
          }
          // SetTotalCount(Result.data.TotalCount)
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          // SetTotalRecord(Result.data.TotalCount);
          SetPageValue(PN)
          LoaderHide()
        } else {
          SetStarredList([])
          SetOpenMessageDetails([]);
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

      let UpdatedList = StarredList.map(item => {
        if (item._id == ID) {
          return { ...item, IsSeen: true };
        }
        return item;
      });
      if (updatestr == "updatelist") {
        SetStarredList(UpdatedList)
      }

      var Data = {
        _id: ID,
      };
      if (str == "showloader") {
        LoaderShow()
      }
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/starredemailhistory/StarredEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
            SetCCMessages(Result.data.Data[0]?.CcNameEmail);
            SetBCCMessages(Result.data.Data[0]?.BccNameEmail);
            localStorage.setItem("CCMessage", JSON.stringify(Result.data.Data[0]?.CcNameEmail))
            localStorage.setItem("BCCMessage", JSON.stringify(Result.data.Data[0]?.BccNameEmail))
            SetActive(ID);
            SetToEmailValue(Result.data.Data)
            SetValueMail(Result.data.Data[0]?.FromEmail)
            // let UpdatedList = StarredList.map(item => {
            //   if (item._id == ID) {
            //     return { ...item, IsSeen: true };
            //   }
            //   return item;
            // });
            // if (updatestr == "updatelist") {
            //   SetStarredList(UpdatedList)
            // }
            dispatch({ type: "refreshClientDetails", payload: true });
            LoaderHide()
          } else {
            SetStarredList([])
            SetOpenMessageDetails([]);
            SetActive("");
            LoaderHide()
          }
        }
        else {
          let UpdatedList = StarredList.map(item => {
            if (item._id == ID) {
              return { ...item, IsSeen: false };
            }
            return item;
          });
          if (updatestr == "updatelist") {
            SetStarredList(UpdatedList)
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
      SetStarredList([])
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
    SetCheckedID([]);
    SetMessageId("");
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);
    if (ID != '') {
      var DeleteArray = []
      DeleteArray.push(ID)
      var Data = {
        IDs: DeleteArray,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/starredemailhistory/StarredEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Delete mail successfully.</div>);
          setSelectedRowIndex(0)
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          dispatch({ type: "refreshClientDetails", payload: true });
          var ID = decrypt(props.location.search.replace('?', ''))
          if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
              GetStarredList(ClientID, UserID, Page, ID, "SeenEmails");
            } else {
              GetStarredList(ClientID, UserID, Page, 0, "SeenEmails")
            }
          } else {
            if (ID != "" && ID != null && ID != "undefined") {
              GetStarredList(ClientID, UserID, Page, ID, "");
            } else {
              GetStarredList(ClientID, UserID, Page, 0, "")
            }
          }
          // }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Start Other inbox Message and model open and close
  const OpenOtherInboxPopModel = () => {
    SetOtherInboxPopModel(true);
  }
  const CloseOtherInboxPopModel = () => {
    SetOtherInboxPopModel(false);
  }
  const UpdateOtherInbox = (ID) => {
    if (ID != '') {
      var Data = {
        _id: ID,
        IsOtherInbox: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/starredemailhistory/StarredEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Other inbox updated successfully.</div>);
          CloseOtherInboxPopModel();
          OpenMessageDetails('')
          LoaderShow()
          var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID !== undefined && ID!="") {
          // if (props !== undefined) {
          //   const ID = props.location.state;
          if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
              GetStarredList(ClientID, UserID, Page, ID, "SeenEmails");
            } else {
              GetStarredList(ClientID, UserID, Page, 0, "SeenEmails")
            }
          } else {
            if (ID != "" && ID != null && ID != "undefined") {
              GetStarredList(ClientID, UserID, Page, ID, "");
            } else {
              GetStarredList(ClientID, UserID, Page, 0, "")
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

  // Followup Message
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

    if (ID != '') {
      if (FollowupDate != null) {
        if (IsValidDate && IsGreater) {
          var Data = {
            ID: ID,
            IsFollowUp: true,
            FollowupDate: FollowupDate,
            IsStarred: true,
            IsOtherInbox: false,
            LastUpdatedBy: -1
          };
          const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/starredemailhistory/StarredFollowUpdate",
            method: "POST",
            data: Data,
          });
          ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
              toast.success(<div>Follow up later updated successfully.</div>);
              CloseFollowupPopModel();
              OpenMessageDetails('')
              LoaderShow()
              var ID = decrypt(props.location.search.replace('?', ''))

              if (!state) {
                if (ID != "" && ID != null && ID != "undefined") {
                  GetStarredList(ClientID, UserID, Page, ID, "SeenEmails");
                } else {
                  GetStarredList(ClientID, UserID, Page, 0, "SeenEmails")
                }
              } else {
                if (ID != "" && ID != null && ID != "undefined") {
                  GetStarredList(ClientID, UserID, Page, ID, "");
                } else {
                  GetStarredList(ClientID, UserID, Page, 0, "")
                }
              }

              // }
            } else {
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

  // Starts HandleChange
  const HandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  // Ends HandleChange

  // Starts Select Template
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
  // Ends Select Template

  // Starts Selection Object Templates
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
  // Ends Selection Object Templates

  // Starts Active Class
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
  // Starts Active Class

  // start replay code
  // Open Compose
  const OpenComposeReply = (e) => {
    SetReplyText("Reply")
    const elementforward = document.getElementById("UserComposeForward")
    elementforward.classList.remove("show");

    // SetToEmailValue([])
    SetSignature({ Data: "" })
    SetNewObjectionID([])
    SetNewTemplateID([])
    SetCCEmailValue([])
    SetBCCEmailValue([])

    SetCheckedID([]);
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);

    const Data = {
      ID: MessageId != "" ? MessageId : OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        // SetSignature({ Data: Result?.data?.Data + ClientData })
        var EmailAccountEmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        EmailAccountEmailSignature.sort(function (a, b) {
          return b.IsDefault - a.IsDefault;
      });

      let NewEmailSignatureText

        if (EmailAccountEmailSignature.length == 0) {
            NewEmailSignatureText = ""
        } else if (EmailAccountEmailSignature[0]?.IsDefault == false) {
            NewEmailSignatureText = ""
        } else {
            NewEmailSignatureText = EmailAccountEmailSignature[0]?.EmailSignature
        }

        SetSignature({ Data: "<br/>" + NewEmailSignatureText + Result?.data?.Data })

        var SenderDetails = {
          SenderName: Result?.data?.SenderName,
          ReceiverName: Result?.data?.ReceiverName
        }
        SetSenderDetails(SenderDetails)
      } else {
        toast.error(Result?.data?.Message);
      }
    })
    SetMessageId("");
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
  // end replay code

  const OpenReplyAll = () => {
    SetReplyText("Reply All")
    RemoveForwardPop()

    SetCheckedID([]);
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);

    if (ToEmailValue.length == 0) {
            SetToEmailValue([OpenMessage?.FromEmail])
        }

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
      ID: MessageId != "" ? MessageId : OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        // SetSignature({ Data: Result?.data?.Data + ClientData })
        var EmailAccountEmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        EmailAccountEmailSignature.sort(function (a, b) {
          return b.IsDefault - a.IsDefault;
      });

      let NewEmailSignatureText

        if (EmailAccountEmailSignature.length == 0) {
            NewEmailSignatureText = ""
        } else if (EmailAccountEmailSignature[0]?.IsDefault == false) {
            NewEmailSignatureText = ""
        } else {
            NewEmailSignatureText = EmailAccountEmailSignature[0]?.EmailSignature
        }

        SetSignature({ Data: "<br/>" + NewEmailSignatureText + Result?.data?.Data })

      } else {
        toast.error(Result?.data?.Message);
      }
    })
    SetMessageId("");

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
    } else {
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
          toast.success(<div>Reply mail sent successfully.</div>);
          setSelectedRowIndex(0)
          if (!state) {
            GetStarredList(ClientID, UserID, Page, 0, "SeenEmails")
          } else {
            GetStarredList(ClientID, UserID, Page, 0, "")
          }

          OpenComposeReply();
          CloseComposeReply()
          SetToEmailValue([ValueMail])
          LoaderHide()
        } else {
          CloseComposeReply()
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
    //remove white space html code 
    const plaiTextBody = GetReplyMessageDetailsTextBody.replace(/&\w+;/g, '').replace(/[\n\t]/g, '');
    //var GetReplyMessageDetailsData = plaiTextBody + ' \n\n' + VoiceOfTone + '  \n\n' + EmailSummary;
    var PROMPT = CommonConstants.PROMPT;
    var objSenderDetails = SenderDetails;
    if (objSenderDetails != null) {
      PROMPT = PROMPT.replace("{Sender Name}", objSenderDetails.SenderName);
      PROMPT = PROMPT.replace("{Receiver Name}", objSenderDetails.ReceiverName);
    }
    PROMPT = PROMPT.replace("{Tone Of Voice}", VoiceOfTone);
    PROMPT = PROMPT.replace("{Email Response Summary}", EmailSummary);
    PROMPT = PROMPT.replace("{Full Email Chain}", plaiTextBody);
    PROMPT = PROMPT.replace("{Full Email Chain}", plaiTextBody);
    var GetReplyMessageDetailsData = PROMPT;
    //var GetReplyMessageDetailsData = CommonConstants.PROMPT + '\n\n' + VoiceOfTone + '\n\n' + EmailSummary + '\n\n' + plaiTextBody;
    if (VoiceOfTone.length > 0) {
      LoaderShow()
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
    key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4==',
    events: { 
      'contentChanged': function () { 
       this.events.focus(true);
     } 
    }
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

  // Starts Forward Reply Send Mail
  // Open Compose
  const OpenComposeForward = (e) => {
    document.getElementById("ToForward").value = ""
    SetForwardSignature({ Data: "" })

    SetForwardToEmailValue([])
    SetForwardCCEmailValue([])
    SetForwardBCCEmailValue([])

    SetCheckedID([]);
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);

    const Data = {
      ID: MessageId != "" ? MessageId : OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetForwardMssageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        var ResultData = Result?.data?.Data
        var EmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        EmailSignature.sort(function (a, b) {
          return b.IsDefault - a.IsDefault;
        });

        let NewEmailSignatureText

                if (EmailSignature.length == 0) {
                    NewEmailSignatureText = ""
                } else if (EmailSignature[0]?.IsDefault == false) {
                    NewEmailSignatureText = ""
                } else {
                    NewEmailSignatureText = EmailSignature[0]?.EmailSignature
                }

                SetForwardSignature({ Data: "<br/>" + NewEmailSignatureText + ResultData })

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
    key: 're1H1qB1A1A5C7E6F5D4iAa1Tb1YZNYAh1CUKUEQOHFVANUqD1G1F4C3B1C8E7D2B4B4==',
    events: { 
      'contentChanged': function () { 
        const toForwardElement = document.getElementById('ToForward');
        if (toForwardElement) {
          toForwardElement.focus();
        }
     }
    } 
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

  const HandleChangePage = (
    event,
    newPage,
  ) => {
    setSelectedRowIndex(0)
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
        GetStarredList(ClientID, UserID, pn, ID, "SeenEmails");
      } else {
        GetStarredList(ClientID, UserID, pn, 0, "SeenEmails")
      }
    } else {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetStarredList(ClientID, UserID, pn, ID, "");
      } else {
        GetStarredList(ClientID, UserID, pn, 0, "")
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
    var ID = decrypt(props.location.search.replace('?', ''))
    if (!state) {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetStarredList(ClientID, UserID, 1, ID, "SeenEmails", "Refresh");
      } else {
        GetStarredList(ClientID, UserID, 1, 0, "SeenEmails", "Refresh")
      }
    } else {
      LoaderShow()
      if (ID != "" && ID != null && ID != "undefined") {
        SetMenuID(ID);
        GetStarredList(ClientID, UserID, 1, ID, "", "Refresh");
      } else {
        GetStarredList(ClientID, UserID, 1, 0, "", "Refresh")
      }
    }
    dispatch({ type: "refreshClientDetails", payload: true });
    if (tableRef.current) {
      tableRef.current.focus();
    }
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
      const allIds = StarredList.map(item => item._id);
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

      const idsWithIsSeenTrue = StarredList.filter(item => item.IsSeen).map(item => item._id);

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

      StarredList.forEach(item => {
        if (CheckedID.includes(item._id)) {
          item.IsSeen = false;
        }
      });

      LoaderShow()
      toast.success("Mails are unread successfully.")
      setSelectAllChecked(false)
      LoaderHide()
      SetStarredList(StarredList)
      SetCheckedID([])

      SetMessageId("");
      SetMessageIsSeen("");
      setContextMenu(null);
      setSubMenuOpen(false);

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
          setIsChecked(false);
          SetCheckedID([])
          dispatch({ type: "refreshClientDetails", payload: true });
          // LoaderHide()
          // toast.success("Mails are unread successfully.")
          // var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID != "" && ID != null && ID != "undefined") {
          //   GetStarredList(ClientID, UserID, Page, ID, "SeenEmails")
          // } else {
          //   GetStarredList(ClientID, UserID, Page, 0, "SeenEmails")
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

      const idsWithIsSeenTrue = StarredList.filter(item => item.IsSeen == false).map(item => item._id);

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

      StarredList.forEach(item => {
        if (CheckedID.includes(item._id)) {
          item.IsSeen = true;
        }
      });

      LoaderShow()
      toast.success("Mails are read successfully.")
      setSelectAllChecked(false)
      LoaderHide()
      SetStarredList(StarredList)
      // SetCheckedID([])

      SetMessageId("");
      SetMessageIsSeen("");
      setContextMenu(null);
      setSubMenuOpen(false);

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
          dispatch({ type: "refreshClientDetails", payload: true });
        } else {
          // LoaderHide()
        }
      });
    } else {
      toast.error("Please select email")

    }
  }

  const UpdateStarMessage = (ID) => {
    SetCheckedID([]);
    SetMessageId("");
    SetMessageIsSeen("");
    setContextMenu(null);
    setSubMenuOpen(false);
    LoaderShow()
    if (ID != '') {

      var Data = {
          _id: ID,
          IsStarred: true,
          LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
          url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryUpdate",
          method: "POST",
          data: Data,
      });
      ResponseApi.then(async (Result) => {
          if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            dispatch({ type: "refreshClientDetails", payload: true });
            if (!state) {
              GetStarredList(ClientID, UserID, 1, 0, "SeenEmails", "Refresh");
            }
            else{
              GetStarredList(ClientID, UserID, 1, 0, "", "Refresh");
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

                  // var LabelUpdatedData = '{"removeLabelIds": ["addLabelIds"]}';
                  // var LabelUpdatedData = '{"addLabelIds": ["STARRED"]}';

                  Axios.post(LabelUpdateUrl, StarredUpdateVaribleGmail, {
                      headers: headers
                  }).then(async (responseone) => {

                  })
              });
            }

          }
      });
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
        Math.min(prevIndex + 1, StarredList.length - 1)
      );
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (index >= 0 && index < StarredList.length) {
        const selectedMessage = StarredList[index];
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
  
  useEffect(() => { 
    const frameDocument = document.querySelector('.emailbodybox').contentDocument; 
    if (frameDocument) {
        const links = frameDocument.querySelectorAll('a'); 
        links.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer'); // Adding security measure
        });
    }
    }, [OpenMessage.HtmlBody]); 
    const renderEmailBody = () => { 
        return OpenMessage.HtmlBody;
    }; 


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
        open={FollowupPopModel}
        onClose={CloseFollowupPopModel}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Style} className="modal-prein">
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
      <Modal className="modal-pre"
        open={OtherInboxPopModel}
        onClose={CloseOtherInboxPopModel}
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
            you want to delete this email?
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
        {/* <Navigation menupage="/Starred" MenuID={MenuID} /> */}
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
                  {/* <FormControlLabel className='check-unseen' control={<Checkbox defaultChecked onChange={handleChange} />} label="Unread" /> */}
                  <FormControlLabel className='check-unseen' control={<Checkbox onChange={handleChange} />} label="Unread" />
                  <a onClick={RefreshTable} className='Refreshbtn'><RefreshIcon /></a>
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
                        {/* <TableCell component="th" width={'30px'}><StarBorderIcon /></TableCell> */}
                        {/* <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell> */}
                        <TableCell component="th" className='px-0 w-0'>
                          <Checkbox
                            name="selectall"
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={(e) => handleSelectAll(e)}
                          />
                        </TableCell>
                        <TableCell component="th" width={'30px'} align="center"></TableCell>
                        <TableCell component="th">Subject</TableCell>
                        <TableCell component="th">From Email</TableCell>
                        <TableCell component="th">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>

                      <Menu className="menurighter"
                        open={contextMenu !== null}
                        onClose={texthandleClose}
                        onContextMenu={texthandleClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                        }
                        > 
                        {
                            MessageIsSeen ? 
                            <MenuItem onClick={MarkUnreadEmails}><VisibilityOffIcon /> Mark as unread</MenuItem> 
                            :
                            <MenuItem onClick={MarkReadEmails}><Visibility /> Mark as read</MenuItem>
                            
                        }
                        <Divider sx={{ my: 0.3 }} /> 
                        <MenuItem onClick={OpenComposeReply}><img src={iconsarrow2} /> Reply</MenuItem>
                        <MenuItem onClick={OpenReplyAll}><img src={icons_replyall} /> Reply All</MenuItem> 
                        <MenuItem onClick={OpenComposeForward}><img src={iconsarrow1} /> Forward</MenuItem>
                        <Divider sx={{ my: 0.3 }} /> 

                        <MenuItem onClick={handleSubMenuOpen}><LabelIcon /> Edit Labels</MenuItem>

                          <Menu className="labelrighter"
                          open={isSubMenuOpen}
                          onClose={handleSubMenuClose}
                          anchorReference="anchorPosition"
                          anchorPosition={
                              isSubMenuOpen
                              ? { top: contextMenu.mouseY + 191, left: contextMenu.mouseX + 193 } // Adjust the position as needed
                              : undefined
                          }
                          > 
                            <div >
                                <h6>Label as:</h6>
                                <Autocomplete className="rightlabelul"
                                    open
                                    multiple
                                    disablePortal
                                    id="checkboxes-tags-demo"
                                    style={{ width: 230 }}
                                    options={labelsData.sort((a, b) => a.LableName.localeCompare(b.LableName)).filter(option => option.LableName !== "Trash" && option.LableName !== "INBOX" && option.LableName !== "Bin")}
                                    getOptionLabel={(option) => option.LableName}
                                    renderTags={() => []}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props} className="oragechecked">
                                            <Checkbox
                                                icon={icon}
                                                checkedIcon={checkedIcon}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.LableName.length > 10 ? option.LableName.slice(0,10) + '...' : option.LableName}
                                        </li>
                                    )}
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Search" />
                                    )}
                                    onChange={HandleMultipleLabelID}
                                />
                                <Button className="btnapply" onClick={Apply}
                                >Apply</Button>
                            </div>  
                          </Menu>

                        <MenuItem onClick={() => { DeleteMessage(MessageId); }}><img src={icondelete} />Delete</MenuItem> 
                        <MenuItem onClick={() => { MarkAsSpam(MessageId, AccountId); }}><InfoSharpIcon />Mark as Spam</MenuItem>
                        <MenuItem onClick={() => UpdateStarMessage(MessageId, "", "")}><StarIcon /> Unstarred</MenuItem>                            
                      </Menu>
                    
                      {StarredList.map((item, index) => {
                        var fullName = item.FromName;
                        var cleanedName = fullName.replace(/<[^>]+>/, "");
                        cleanedName.trim();
                        var defaultColor = CommonConstants.DEFAULTLABELCOLOR;
                        var labelColor = "";
                        if(item.LabelField?.length > 1){
                            var data = item.LabelField?.[item.LabelField.length - 1]
                            if(data.LableName == "INBOX"){
                            data = item.LabelField?.[item.LabelField.length - 2]
                            }
                            if(data.LabelColorCode != undefined){
                            labelColor = data.LabelColorCode;
                            }
                        }
                        else if(item.LabelField?.length == 1){
                            if(item.LabelField[0].LableName != "INBOX"){
                            labelColor = item.LabelField[0].LabelColorCode != undefined ? item.LabelField[0].LabelColorCode : defaultColor;
                            }
                        }
                        return (
                          <TableRow accountid={item?.AccountID} messageid={item._id} isseen={item?.IsSeen.toString()} onContextMenu={handleContextMenu} style={{ cursor: 'context-menu' }}
                            // className={`${Active === item._id ? "selected-row" : ""}`}
                            // className={`${Active === item._id ? "selected-row" : ""} ${item.IsSeen ? "useen-email" : "seen-email"}`}
                            // key={item.name}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={item.name}
                            className={`${selectedRowIndex === index ? 'selected-row' : ''} ${item?.IsSeen ? "useen-email" : "seen-email"}`}
                            onClick={() => setSelectedRowIndex(index)}
                            id={"row-" + index}
                          >
                            {/* <TableCell width={'35px'}><StarBorderIcon /></TableCell>
                      <TableCell width={'35px'}></TableCell> */}
                            <TableCell align='center'>
                              <Checkbox type="checkbox" className='my-checkbox' checked={CheckedID.includes(item._id)} onChange={(e) => HandleCheckedID(e, item._id)} />
                              {/* <Checkbox onChange={(e) => HandleCheckedID(e, item._id)} color="primary" /> */}
                            </TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index,"", "updatelist")} width={'35px'} align="center">
                              {
                                item?.IsReplied ? <TurnLeft /> : ""
                              }
                            </TableCell>
                            <TableCell style={{color : labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : ""}} onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {item?.Subject ? (
                              <>
                                {item.Subject.split(' ').slice(0, 8).join(' ')}
                                {item.Subject.split(' ').length > 8 ? '...' : ''}
                              </>
                            ) : null}</TableCell>
                            <TableCell style={{color : labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : ""}} onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {cleanedName + " " + "(" + item.FromEmail + ")"}</TableCell>
                            <TableCell style={{color : labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : ""}} onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')}>{Moment(item.MessageDatetime).format("MM/DD/YYYY hh:mm a")}</TableCell>
                          </TableRow>)
                      }
                      )}
                    </TableBody>
                  </Table>
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
                                {/* {OpenMessage?.ToNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')} */}
                                {OpenMessage?.ToNameEmail?.length > 1 ?
                                  OpenMessage?.ToNameEmail?.map((e, index) => e.Email )?.join(', ').split(', ')[0]
                                  : OpenMessage?.ToNameEmail?.map((e) => e.Email)}

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
                              // <label>
                              //     <b>Cc : </b>{OpenMessage?.CcNameEmail?.map((e) => e?.Email)?.join(", ")}
                              // </label> : "" 
                              <label>
                                <b>CC : </b>
                                {/* {OpenMessage?.CcNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')} */}
                                {OpenMessage?.CcNameEmail?.length > 1 ?
                                  OpenMessage?.CcNameEmail?.map((e, index) => e.Email )?.join(', ').split(', ')[0]
                                  : OpenMessage?.CcNameEmail?.map((e) => e.Email)}
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
                              <label>
                                <b>BCC : </b>
                                {/* {OpenMessage?.BccNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')} */}
                                {OpenMessage?.BccNameEmail?.length > 1 ?
                                  OpenMessage?.BccNameEmail?.map((e, index) => e.Email )?.join(', ').split(', ')[0]
                                  : OpenMessage?.BccNameEmail?.map((e) => e.Email)}

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
                          <label>
                            <b>Subject : </b>{OpenMessage.Subject}
                            {
                              <p className='subject-label'>
                                {
                                  OpenMessage.LabelField.map((e, index) => (
                                    // <span key={index}>{e.LableName}</span>
                                    <span key={index} style={{ background: e.LabelColorCode ? e.LabelColorCode : CommonConstants.DEFAULTLABELCOLOR }}>{e.LableName}</span>
                                  ))
                                }
                              </p>
                            }
                          </label>
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
                            <label>{MailNumber} / {StarredList.length}</label>
                          </Button>
                          <Button onClick={OpenFollowupPopModel}>
                            <img src={icontimer} title={"Follow Up Later"} />
                          </Button>
                          <Button onClick={OpenOtherInboxPopModel}>
                            <img src={inbox} title={"Other Inbox"} />
                          </Button>
                          <Button>
                            <a><img src={iconsarrow2} title={"Reply"} onClick={OpenComposeReply} /></a>
                          </Button>
                          <Button>
                            <a><img src={icons_replyall} onClick={OpenReplyAll} title={"Reply All"} /></a>
                          </Button>
                          <Button>
                            <a><img src={iconsarrow1} title={"Forward"} onClick={OpenComposeForward} /></a>
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
              <Col><h4>{ReplyText}</h4></Col>
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
          <div className='subcompose px-3 py-1'>
            <Row className='px-3'>
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
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetToEmailValue([...ToEmailValue, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetToEmailValue([...ToEmailValue, newInputValue]);
                      // }
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
                  <Autocomplete
                    multiple
                    id="Cc"
                    value={CCMessages}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetCCMessages(newValue);
                    }}
                    freeSolo
                    clearOnBlur
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetCCMessages([...CCMessages, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetCCMessages([...CCMessages, newInputValue]);
                      // }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetCCMessages([...CCMessages, newInputValue]);
                        event.target.value = '';
                      }
                    }}
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
                    id="CC"
                    value={CCEmailValue}
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
                    clearOnBlur
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetBCCMessages([...BCCMessages, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetBCCMessages([...BCCMessages, newInputValue]);
                      // }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetBCCMessages([...BCCMessages, newInputValue]);
                        event.target.value = '';
                      }
                    }}
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
                    id="BCC"
                    value={BCCEmailValue}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetBCCEmailValue(newValue);
                    }}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => {
                        var ValidEmail = ValidateEmail(option)
                        if (ValidEmail) {
                          return (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                          )
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
              <Col><h4>Forward </h4></Col>
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
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetForwardToEmailValue([...ForwardToEmailValue, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetForwardToEmailValue([...ForwardToEmailValue, newInputValue]);
                      // }
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
                    clearOnBlur
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetForwardCCEmailValue([...ForwardCCEmailValue, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetForwardCCEmailValue([...ForwardCCEmailValue, newInputValue]);
                      // }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetForwardCCEmailValue([...ForwardCCEmailValue, newInputValue]);
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
                    }}
                    freeSolo
                    clearOnBlur
                    onClose={(event, newValue) => {
                      const newInputValue = event.target.value;
                      SetForwardBCCEmailValue([...ForwardBCCEmailValue, newInputValue]);
                    }}
                    onKeyDown={(event, newValue) => {
                      // if (event.key === 'Tab') {
                      //   const newInputValue = event.target.value;
                      //   SetForwardBCCEmailValue([...ForwardBCCEmailValue, newInputValue]);
                      // }
                      if (event.keyCode === 188) {
                        event.preventDefault();
                        const newInputValue = event.target.value;
                        SetForwardBCCEmailValue([...ForwardBCCEmailValue, newInputValue]);
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
      <StarredComposePage GetStarredList={GetStarredList} />
    </>
  );
}













