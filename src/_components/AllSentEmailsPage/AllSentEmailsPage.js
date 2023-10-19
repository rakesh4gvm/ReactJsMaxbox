import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames, ValidateEmail, decrypt, Plain2HTML, RemoveForwardPop, RemoveCurrentEmailFromCC, RemoveCurrentEmailFromBCC } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import AllSentEmailsComposePage from '../AllSentEmailsComposePage/AllSentEmailsComposePage';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { styled, alpha } from '@material-ui/core/styles';
import TablePagination from '@mui/material/TablePagination';

import ToggleButton from '@mui/material/ToggleButton';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';

import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import Close from '../../images/icons/w-close.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icons_replyall from '../../images/icons_replyall.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import Chatgpt from '../../images/icons/chatgpt-icon.svg';

import { Box } from '@material-ui/core';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Popover from '@mui/material/Popover';
import { ArrowDropDown } from '@material-ui/icons';
import Frame from 'react-frame-component';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
];
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

export default function AllSentEmailsPage(props) {

  const [AllSentList, SetAllSentList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(50);
  const [SortField, SetsortField] = React.useState("MailSentDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [temopen, setTemOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [TotalRecord, SetTotalRecord] = React.useState(0);
  const [MenuID, SetMenuID] = React.useState("");
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [TotalCount, SetTotalCount] = useState(0)
  const [IsBottom, SetIsBottom] = useState(false)
  const [PageValue, SetPageValue] = React.useState(1)
  const [Active, SetActive] = useState("");
  const [Ccflag, SetCcflag] = useState(false);
  const [Bccflag, SetBccflag] = useState(false);
  const [CcReplyflag, SetCcReplyflag] = useState(false);
  const [BccReplyflag, SetBccReplyflag] = useState(false);
  const [ToEmailValue, SetToEmailValue] = React.useState([]);
  const [CCEmailValue, SetCCEmailValue] = React.useState([]);
  const [BCCEmailValue, SetBCCEmailValue] = React.useState([]);
  const [CCMessages, SetCCMessages] = React.useState([])
  const [BCCMessages, SetBCCMessages] = React.useState([])
  const [ValueMail, SetValueMail] = useState()
  const [ForwardToEmailValue, SetForwardToEmailValue] = useState([])
  const [ForwardCCEmailValue, SetForwardCCEmailValue] = useState([])
  const [ForwardBCCEmailValue, SetForwardBCCEmailValue] = useState([])
  const [TemplateID, SetTemplateID] = React.useState("");
  const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
  const [subject, setSubject] = useState()
  const [GetReplyMessageDetails, SetGetReplyMessageDetails] = useState()
  const [GetReplyMessageDetailsTextBody, SetGetReplyMessageDetailsTextBody] = useState()
  const [ChatGPTMOdel, SetChatGPTModel] = useState(false)
  const [NewObjectionID, SetNewObjectionID] = useState([])
  const [AllSentTotalRecords, SetAllSentTotalRecords] = useState()
  const [SentEmailTotalRecords, SetSentEmailTotalRecords] = useState()
  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
  const [MUIClass, SetMUIClass] = useState("Mui-selected")
  const [SenderDetails, SetSenderDetails] = React.useState(null);
  const [ReplyText, SetReplyText] = useState("Reply")
  const [EmailAccountUsers, SetEmailAccountUsers] = useState([])

  const OpenChatGPTModel = () => SetChatGPTModel(true)

  const HanleChatGPTClose = () => SetChatGPTModel(false);

  const HandleScroll = (e) => {
    const target = e.target
    if (target.scrollHeight - target.scrollTop === target.clientHeight && AllSentList?.length < TotalCount) {
      SetPage(Page + 1)
      SetIsBottom(true)
    }
  }

  useEffect(() => {
    if (IsBottom) {
      GetAllSent(ClientID, UserID, Page, 0);
      SetIsBottom(false)
    }
  }, [IsBottom])

  const ContainerRef = useRef(null)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);
  const [ClientData, SetClientData] = useState()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [ccanchorEl, setCCAnchorEl] = React.useState(null);
  const [bccanchorEl, setBCCAnchorEl] = React.useState(null)
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const tableRef = useRef(null);

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

  const HandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [NewTemplateID, SetNewTemplateID] = useState([])

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


  useEffect(() => {
    document.title = 'All Sent | MAXBOX';
    GetClientID();
  }, [SearchInbox])

  // Starts Get Client ID
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

    if (ID != "" && ID != null && ID != "undefined") {
      SetMenuID(ID)
      GetAllSent(UserDetails.ClientID, UserDetails.UserID, Page, ID, "showloader");
    }
    else {
      GetAllSent(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader")
    }

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

  //  comment this api because we retrieve counts from email collection that's have no use for this api ~Shubham
  // Get All Sent Emails Total Count
  // const GetAllSentEmailsTotalCount = (CID, UID) => {
  //   LoaderShow()
  //   const Data = {
  //     ClientID: CID,
  //     UserID: UID,
  //   }
  //   const ResponseApi = Axios({
  //     url: CommonConstants.MOL_APIURL + "/sent_email_history/AllTotalRecords",
  //     method: "POST",
  //     data: Data,
  //   });
  //   ResponseApi.then((Result) => {
  //     if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

  //       var total = Result.data?.AllSentEmailsCount != undefined ? Result.data?.AllSentEmailsCount : 0;
  //       SetTotalRecord(total)
  //       console.log(Result.data)
  //     } else {
  //       SetTotalRecord(0)
  //       toast.error(Result?.data?.Message);
  //     }
  //   });
  //   LoaderHide()
  // }

  // const GetSentEmailsTotalRecords = (CID, UID, ID) => {
  //   LoaderShow()
  //   const Data = {
  //     ClientID: CID,
  //     UserID: UID,
  //   }
  //   const ResponseApi = Axios({
  //     url: CommonConstants.MOL_APIURL + "/sent_email_history/GetEmailsTotalRecords",
  //     method: "POST",
  //     data: Data,
  //   });
  //   ResponseApi.then((Result) => {
  //     if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
  //       var total = Result.data?.AllSentEmailsCount.filter((e) => e._id === ID)[0]?.IsAllSent == undefined ? Result.data?.AllSentEmailsCount.filter((e) => e._id === ID)[0]?.IsAllSent : 0;
  //       SetTotalRecord(total)
  //     } else {
  //       SetTotalRecord(0)
  //       toast.error(Result?.data?.Message);
  //     }
  //   });
  //   LoaderHide()
  // }

  // Start From Email List
  const FromEmailList = async (CID, UID, ID) => {

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
            var total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SentCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SentCount : 0

            SetTotalRecord(total);
          } else {
            var total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SentCount)?.reduce((a, b) => a + b, 0) : 0

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
  const GetAllSent = (CID, UID, PN, ID, str) => {
    FromEmailList(CID, UID, ID);

    let AccountIDs = []
    if (ID.length > 0) {

      AccountIDs.push(ID)
    } else {
      AccountIDs = [-1]
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
      AccountIDs: AccountIDs
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetAllSentList(Result.data.PageData)
          // SetTotalCount(Result.data.TotalCount)
          if (!str == "hideloader") {
            OpenMessageDetails(Result.data.PageData[0]._id, '', 'showloader', '');
          } else {
            OpenMessageDetails(Result.data.PageData[0]._id, '', '', '');
          }
          // SetTotalRecord(Result.data.TotalCount);
          SetMailNumber(1)
          SetPageValue(PN)
          LoaderHide()
        } else {
          SetAllSentList([])
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
      if (str == "showloader") {
        LoaderShow()
      }
      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryGetByID",
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
            SetOpenMessageDetails(Result.data.Data[0]);
            SetCCMessages(Result.data.Data[0]?.CcNameEmail);
            SetBCCMessages(Result.data.Data[0]?.BccNameEmail);
            localStorage.setItem("CCMessage", JSON.stringify(Result.data.Data[0]?.CcNameEmail))
            localStorage.setItem("BCCMessage", JSON.stringify(Result.data.Data[0]?.BccNameEmail))
            SetActive(ID);
            SetToEmailValue(Result.data.Data)
            SetValueMail(Result.data.Data[0]?.FromEmail)
            // let UpdatedList = AllSentList.map(item => {
            //   if (item._id == ID) {
            //     return { ...item, IsSeen: true };
            //   }
            //   return item;
            // });
            // if (updatestr == "updatelist") {
            //   SetAllSentList(UpdatedList)
            // }
            LoaderHide()
          } else {
            SetAllSentList([])
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
        url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Mail deleted successfully.</div>);
          setSelectedRowIndex(0)
          CloseDeletePopModel();
          OpenMessageDetails('', '', 'showloader', '')
          LoaderShow()
          // if (props !== undefined) {
          //   const ID = props.location.state;
          var ID = decrypt(props.location.search.replace('?', ''))
          if (ID != "" && ID != null && ID != "undefined") {
            if (AllSentList.length - 1 == 0) {
              GetAllSent(ClientID, UserID, 1, ID, "");
            } else {
              GetAllSent(ClientID, UserID, Page, ID, "");
            }
          }
          else {
            if (AllSentList.length - 1 == 0) {
              GetAllSent(ClientID, UserID, 1, 0, "")
            } else {
              GetAllSent(ClientID, UserID, Page, 0, "")
            }
          }

        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }

  }
  // End PopModel Open and Close and Delete Message

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(50);
      SetAllSentList([])
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Start Update Star Message and model open and close
  const OpenStarPopModel = () => {
    SetStarPopModel(true);
  }
  const CloseStarPopModel = () => {
    SetStarPopModel(false);
  }
  const UpdateStarMessage = (ID, str) => {
    if (str === "opnemodel") {
      CloseStarPopModel();
    }

    if (ID != '') {

      let UpdatedList = AllSentList.map(item => {
        if (item._id == ID) {
          if (item.IsStarred) {
            return { ...item, IsStarred: false };
          } else {
            return { ...item, IsStarred: true };
          }
        }
        return item;
      });

      SetAllSentList(UpdatedList)

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

      var Data = {
        _id: ID,
        IsStarred: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryStatusUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then(async (Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

          var accessToken = Result.data.accessToken
          var RFC822MessageID = Result.data.RFC822MessageID
          var IsStarred = Result.data.IsStarred

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

              if (IsStarred) {
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
            })

          }

          // var ID = decrypt(props.location.search.replace('?', ''))
          // if (ID != "" && ID != null && ID != "undefined") {
          //   GetAllSent(ClientID, UserID, Page, ID, "hideloader");
          // }
          // else {
          //   GetAllSent(ClientID, UserID, Page, 0, "hideloader")
          // }

        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Update Star Message and model open and close

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

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/sent_email_history/SentGetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        var EmailAccountEmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        SetSignature({ Data: "<br/>" + EmailAccountEmailSignature + Result?.data?.Data })
        var SenderDetails = {
          SenderName: Result?.data?.SenderName,
          ReceiverName: Result?.data?.ReceiverName
        }
        SetSenderDetails(SenderDetails)
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
  // end replay code

  const OpenReplyAll = () => {
    SetReplyText("Reply All")
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
      url: CommonConstants.MOL_APIURL + "/sent_email_history/SentGetReplyMessageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetGetReplyMessageDetails(Result?.data?.Data)
        SetGetReplyMessageDetailsTextBody(Result?.data?.TextBody)
        var EmailAccountEmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        SetSignature({ Data: "<br/>" + EmailAccountEmailSignature + Result?.data?.Data })
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

    var ToName = OpenMessage.ToName
    var FromEmail = OpenMessage.FromEmail;
    var FromName = OpenMessage.FromName
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
        FromEmail: FromEmail,
        FromName: FromName,
        ID: ID,
        Subject: Subject,
        Body: Body,
        TemplateID: NewTemplateID,
        ObjectIDTemplateID: NewObjectionID,
        IsSentPage: true
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/sent_email_history/AllSentReplyMessage",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Reply mail sent successfully.</div>);
          CloseComposeReply()
          SetSignature({ Data: "" })
          SetToEmailValue([ValueMail])
          LoaderHide()
        } else {
          CloseComposeReply()
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      });
    }
  }
  // Sent Mail Ends

  const ChatGPT = async () => {
    var VoiceOfTone = document.getElementById("tone").value
    var EmailSummary = document.getElementById("emailsummary").value
    //remove white space html code 
    const plaiTextBody = GetReplyMessageDetailsTextBody.replace(/&\w+;/g, '').replace(/[\n\t]/g, '');
    //var GetReplyMessageDetailsData = plaiTextBody + ' \n\n' + VoiceOfTone + '  \n\n' + EmailSummary;
    // var GetReplyMessageDetailsData = CommonConstants.PROMPT + '\n\n' + VoiceOfTone + '\n\n' + EmailSummary + '\n\n' + plaiTextBody;
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
    if (VoiceOfTone.length > 0) {
      LoaderShow()
      var GetReplyMessageDetailsData = plaiTextBody + " make reply happy and respectfull tone";
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

  Froalaeditor.RegisterCommand('Chat', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: ChatGPT,
    icon: `<img src=${Chatgpt} alt=[ALT] />`,
    title: 'Generate auto response',
  });

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

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/sent_email_history/SentGetForwardMssageDetails",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        var EmailSignature = EmailAccountUsers?.find((e) => e?.AccountID == OpenMessage?.AccountID)?.EmailSignature
        SetForwardSignature({ Data: "<br/>" + EmailSignature + Result?.data?.Data })
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
        url: CommonConstants.MOL_APIURL + "/sent_email_history/SentPageForwardMessage",
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

  // Starts Pagination
  const HandleChangePage = (
    event,
    newPage,
  ) => {
    setSelectedRowIndex(0)
    ContainerRef.current.scrollTop = 0;
    SetPage(newPage + 1);

    var pn = newPage + 1;

    // if (props !== undefined) {
    //   const ID = props.location.state;
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      GetAllSent(ClientID, UserID, pn, ID, "showloader");
    } else {
      GetAllSent(ClientID, UserID, pn, 0, "showloader")
    }

  };
  // Ends Pagination

  const RefreshTable = () => {
    setSelectedRowIndex(0)
    ContainerRef.current.scrollTop = 0;
    LoaderShow()
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      GetAllSent(ClientID, UserID, 1, ID, "");
    }
    else {
      GetAllSent(ClientID, UserID, 1, 0, "")
    }
    if (tableRef.current) {
      tableRef.current.focus();
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
        Math.min(prevIndex + 1, AllSentList.length - 1)
      );
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (index >= 0 && index < AllSentList.length) {
        const selectedMessage = AllSentList[index];
        OpenMessageDetails(selectedMessage._id, index, "updatelist");
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
              AllSentList?.find((e) => e?._id === OpenMessage?._id)?.IsStarred === false ?
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
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateStarMessage(OpenMessage._id, "opnemodel"); }}>
              Yes
            </Button>
            <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseStarPopModel(); }}>
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
        {/* <Navigation menupage="/AllSentEmails" /> */}
        {/* <Navigation menupage="/AllSentEmails" MenuID={MenuID} /> */}
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
                <div className='rigter-coller'>
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
                  <Table id="pokemons-list" className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        {/* <TableCell component="th" width={'30px'} align="center"></TableCell> */}
                        {/* <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell> */}
                        <TableCell component="th">Subject</TableCell>
                        <TableCell component="th">From</TableCell>
                        <TableCell component="th">To</TableCell>
                        <TableCell component="th">Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {AllSentList.map((item, index) => {
                        var fullName = item.FromName;
                        var cleanedName = fullName.replace(/<[^>]+>/, "");
                        cleanedName.trim();
                        return (
                          <TableRow
                            // className={`${Active === item._id ? "selected-row" : ""}`}
                            // key={item.name}
                            // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={item.name}
                            className={`${selectedRowIndex === index ? 'selected-row' : ''}`}
                            onClick={() => setSelectedRowIndex(index)}
                            id={"row-" + index}
                          >
                            {/* <TableCell width={'35px'} align="center">
                              <ToggleButton title="Starred" className="startselct" value="check" selected={item.IsStarred} id={"star_" + item._id} onClick={() => UpdateStarMessage(item._id, "")} >
                                <StarBorderIcon className='starone' />
                                <StarIcon className='selectedstart startwo' />
                              </ToggleButton>
                            </TableCell> */}
                            {/* <TableCell width={'35px'}></TableCell> */}
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, "updatelist")} scope="row"> {item?.Subject ? (
                              <>
                                {item.Subject.split(' ').slice(0, 8).join(' ')}
                                {item.Subject.split(' ').length > 8 ? '...' : ''}
                              </>
                            ) : null}</TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {cleanedName + " " + "(" + item.FromEmail + ")"}</TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {item?.ToNameEmail[0]?.Email}</TableCell>
                            <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} >{Moment(item.MailSentDatetime).format("MM/DD/YYYY hh:mm a")}</TableCell>
                          </TableRow>
                        )
                      })}
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
                              // <label><b>Bcc : </b>{OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")}</label> : ""
                              // <label><b>Bcc : </b>{OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")}</label> : ""
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
                          <label><b>Subject : </b>{OpenMessage.Subject}</label>
                        </div>
                    }
                  </Col>
                  <Col sm={6}>
                    <div className='lablebox text-right'>
                      <label>{OpenMessage == 0 ? '' : Moment(OpenMessage.MailSentDatetime).format("MM/DD/YYYY hh:mm A")}</label>
                    </div>
                    {
                      OpenMessage == 0 ? '' :
                        <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                          <Button>
                            <label>{MailNumber} / {AllSentList.length}</label>
                          </Button>
                          {/* <Button>
                            <ToggleButton className={"startselct temp-class" + " " + MUIClass} title={"Starred"} value="check" id={"starbelow_" + OpenMessage._id} selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Button> */}
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
                            <a><img src={icondelete} title={"Delete"} /></a>
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
      <AllSentEmailsComposePage GetAllSent={GetAllSent} />
      {/* <Button onClick={() => OpenComposeReply(OpenMessage)}> */}
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
                {/* <Input className='input-clend' id='To' name='To' value={OpenMessage?.ToEmail} disabled /> */}
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
      {/* </Button> */}
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
                  <FroalaEditor tag='textarea' id="signature" config={forwardconfig} onModelChange={ForwardHandleModelChange} model={ForwardSignature.Data} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

    </>
  );
}