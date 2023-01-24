import React, { useState, useEffect } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames, ValidateEmail, decrypt } from "../../_helpers/Utility";
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
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
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
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
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
  const [ValueMail, SetValueMail] = useState()
  const [ForwardToEmailValue, SetForwardToEmailValue] = useState([])
  const [ForwardCCEmailValue, SetForwardCCEmailValue] = useState([])
  const [ForwardBCCEmailValue, SetForwardBCCEmailValue] = useState([])

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


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);
  const [ClientData, SetClientData] = useState()

  const HandleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const SelectTemplate = () => {
    var GetByClass = document.getElementsByClassName('active');
    LoaderShow()
    if (GetByClass.length > 0) {
      var TemplateID = document.getElementsByClassName('active')[0].id;
      var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
      var BodyData = Signature.Data;
      document.getElementById("Subject").value = DivData.Subject;
      // var NewData = BodyData + '</br>' + DivData.BodyText;
      var NewData = DivData.BodyText + BodyData
      SetSignature({ Data: NewData });
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
      var ObjectionTemplateID = document.getElementsByClassName('active')[0].id;
      var DivData = ObjectData.find(data => data.ObjectionTemplateID === ObjectionTemplateID);
      var BodyData = Signature.Data;
      document.getElementById("Subject").value = DivData.Subject;
      var NewData = DivData.BodyText + BodyData
      SetSignature({ Data: NewData });
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
    // if (props !== undefined) {
    //   const ID = props.location.state;
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      SetMenuID(ID)
      GetAllSent(UserDetails.ClientID, UserDetails.UserID, Page, ID, "");
    }
    else {
      GetAllSent(UserDetails.ClientID, UserDetails.UserID, Page, 0, "")
    }

  }
  // End Get Client ID

  // Start Get Follow Up Later List
  const GetAllSent = (CID, UID, PN, ID, str) => {
    let AccountIDs = []
    if (ID.length > 0) {
      AccountIDs.push(ID)
    } else {
      AccountIDs = [-1]
    }
    if (!str == "hideloader") {
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
          SetTotalCount(Result.data.TotalCount)
          if (!str == "hideloader") {
            OpenMessageDetails(Result.data.PageData[0]._id, '', 'showloader');
          } else {
            OpenMessageDetails(Result.data.PageData[0]._id, '', '');
          }
          SetTotalRecord(Result.data.TotalCount);
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
  const OpenMessageDetails = (ID, index, str) => {
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
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
            SetActive(ID);
            SetToEmailValue(Result.data.Data)
            SetValueMail(Result.data.Data[0]?.FromEmail)
            LoaderHide()
          } else {
            SetAllSentList([])
            SetOpenMessageDetails([]);
            SetActive("");
            LoaderHide()
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
          CloseDeletePopModel();
          OpenMessageDetails('', '', 'showloader')
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
      SetRowsPerPage(10);
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
    if (ID != '') {
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
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (str === "opnemodel") {
            CloseStarPopModel();
            // OpenMessageDetails('', '', '')
          }

          var ID = decrypt(props.location.search.replace('?', ''))

          if (ID != "" && ID != null && ID != "undefined") {
            GetAllSent(ClientID, UserID, Page, ID, "hideloader");
          }
          else {
            GetAllSent(ClientID, UserID, Page, 0, "hideloader")
          }

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

    // SetToEmailValue([])
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
        SetSignature({ Data: Result?.data?.Data })
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
    }

    const elementreply = document.getElementById("UserCompose")
    elementreply.classList.remove("show");
    // const elementreplytwo = document.getElementById("UserComposeForward")
    // elementreplytwo.classList.remove("show");
  };
  // end replay code

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

    var Response

    if (ToEmailValue.length > 1) {
      var r = ToEmailValue[0]?.FromEmail
      var s = ToEmailValue.shift()
      Response = ToEmailValue.concat(r)

    } else if (typeof ToEmailValue[0] == "string") {
      Response = ToEmailValue
    } else {
      Response = [ToEmailValue[0].FromEmail]
    }

    let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var EmailResponse = Response.filter(e => e && e.toLowerCase().match(EmailRegex));
    var CCResponse = CCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var BCCResponse = BCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

    var ToName = OpenMessage.ToName
    var FromEmail = OpenMessage.FromEmail;
    var FromName = OpenMessage.FromName
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = Signature?.Data

    if (Body == "" || EmailResponse == "") {
      toast.error("All Fields are Mandatory!");
    } else {
      LoaderShow()
      var Data = {
        ToEmail: EmailResponse.toString(),
        CC: CCResponse.toString(),
        BCC: BCCResponse.toString(),
        ToName: ToName,
        FromEmail: FromEmail,
        FromName: FromName,
        ID: ID,
        Subject: Subject,
        Body: Body
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
  const config = {
    quickInsertEnabled: false,
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [['SendReply', 'ReplySendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions'], ['DeleteReply']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
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


  // Starts Forward Reply Send Mail
  // Open Compose
  const OpenComposeForward = (e) => {
    document.getElementById("ToForward").value = ""

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
        SetForwardSignature({ Data: Result?.data?.Data })
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
    if (CcReplyflag == false) {
      document.getElementById("CcReply").style.display = 'block'
      SetCcReplyflag(true);
    }
    else {
      document.getElementById("CcReply").style.display = 'none'
      SetCcReplyflag(false);
    }
  };

  // Open BCC
  const OpenBccReply = () => {
    if (BccReplyflag == false) {
      document.getElementById("BccReply").style.display = 'block'
      SetBccReplyflag(true);
    }
    else {
      document.getElementById("BccReply").style.display = 'none'
      SetBccReplyflag(false);
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

    if (Body == "" || EmailResponse == "") {
      toast.error("Please Enter Body");
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
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [['ForwardReply', 'ForwardSendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['DeleteForward']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
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

  // Starts Pagination
  const HandleChangePage = (
    event,
    newPage,
  ) => {
    SetPage(newPage + 1);

    var pn = newPage + 1;

    // if (props !== undefined) {
    //   const ID = props.location.state;
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      GetAllSent(ClientID, UserID, pn, ID, "");
    } else {
      GetAllSent(ClientID, UserID, pn, 0, "")
    }

  };
  // Ends Pagination

  const RefreshTable = () => {
    LoaderShow()
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      GetAllSent(ClientID, UserID, Page, ID, "");
    }
    else {
      GetAllSent(ClientID, UserID, Page, 0, "")
    }
  }

  return (
    <>

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
              Are you sure ?
            </Typography>
            {
              OpenMessage?.IsStarred === false ?
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to Star an email ?
                </Typography>
                :
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  you want to UnStar an email ?
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
              Are you sure ?
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
        {/* <Navigation menupage="/AllSentEmails" /> */}
        <Navigation menupage="/AllSentEmails" MenuID={MenuID} />
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
            split="horizontal "
            minSize={150}
            maxSize={-200}
            defaultSize={"40%"}
          >
            <>
              <div className='orangbg-table'>
                <div className='rigter-coller'>
                  <a onClick={RefreshTable} className='Refreshbtn'><RefreshIcon /></a>
                </div>
              </div>
              {
                OpenMessage?.length == 0 ? "" :
                  <div className='pagination-pa' >
                    <TablePagination
                      component="div"
                      count={TotalRecord}
                      page={parseInt(PageValue) - 1}
                      rowsPerPage="10"
                      onPageChange={HandleChangePage}
                    />
                  </div>
              }
              <div className="simulationDiv">
                <Table id="pokemons-list" className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell component="th" width={'30px'}><StarBorderIcon /></TableCell>
                      {/* <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell> */}
                      <TableCell component="th">Subject</TableCell>
                      <TableCell component="th">From Email</TableCell>
                      <TableCell component="th">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {AllSentList.map((item, index) => {
                      return (
                        <TableRow
                          className={`${Active === item._id ? "selected-row" : ""}`}
                          key={item.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell width={'35px'}>
                            <ToggleButton title="Starred" className="startselct" value="check" selected={item.IsStarred} onClick={() => UpdateStarMessage(item._id, "")} >
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </TableCell>
                          {/* <TableCell width={'35px'}></TableCell> */}
                          <TableCell scope="row" onClick={() => OpenMessageDetails(item._id, index, 'showloader')}> {item.Subject} </TableCell>
                          <TableCell onClick={() => OpenMessageDetails(item._id, index, 'showloader')} >{item.FromEmail}</TableCell>
                          <TableCell onClick={() => OpenMessageDetails(item._id, index, 'showloader')} >{Moment(item.MailSentDatetime).format("MM/DD/YYYY")}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
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
                            <b>From</b>
                            {OpenMessage.FromEmail}
                          </label>
                          <label><b>To</b>{OpenMessage.ToEmail}</label>
                          <label><b>Subject</b>{OpenMessage.Subject}</label>
                        </div>
                    }
                  </Col>
                  <Col sm={6}>
                    <div className='lablebox text-right'>
                      <lable>{OpenMessage == 0 ? '' : Moment(OpenMessage.MailSentDatetime).format("MM/DD/YYYY hh:mm A")}</lable>
                    </div>
                    {
                      OpenMessage == 0 ? '' :
                        <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                          <Button>
                            <label>{MailNumber} / {AllSentList.length}</label>
                          </Button>
                          <Button>
                            <ToggleButton className='startselct' title={"Starred"} value="check" selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Button>
                          <Button>
                            <a><img src={iconsarrow2} title={"Reply"} onClick={OpenComposeReply} /></a>
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

              <div className='emailbodybox'>
                {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
              </div>
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
              <Col><h4>Reply Message</h4></Col>
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
              <Col xs={2} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={7} className="px-0">
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
          <div className='subcompose cc px-3' id='CcReply'>
            <Row className='px-3'>
              <Col xs={2} className="px-0">
                <h6>Cc :</h6>
              </Col>
              <Col xs={10} className="px-0">
                {/* <Input className='input-clend' id='CC' name='Cc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
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
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className='subcompose bcc px-3' id='BccReply'>
            <Row className='px-3'>
              <Col xs={2} className="px-0">
                <h6>Bcc :</h6>
              </Col>
              <Col xs={10} className="px-0">
                {/* <Input className='input-clend' id='BCC' name='Bcc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
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
      {/* </Button> */}
      <div className='composebody' id='maxcomposeForward'>
        <div className="usercompose userdefual" id="UserComposeForward">
          <div className='hcompose px-3'>
            <Row>
              <Col><h4>Forward Message</h4></Col>
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
              <Col xs={2} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={7} className="px-0">
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
              <Col xs={2} className="px-0">
                <h6>Cc :</h6>
              </Col>
              <Col xs={10} className="px-0">
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
              <Col xs={2} className="px-0">
                <h6>Bcc :</h6>
              </Col>
              <Col xs={10} className="px-0">
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

// import React, { useRef, useState, useEffect } from 'react';
// import Axios from "axios";
// import Moment from "moment";
// import parse from "html-react-parser";

// import { styled, alpha } from '@mui/material/styles';
// import RefreshIcon from '@material-ui/icons/Refresh';
// import DeleteIcon from '@material-ui/icons/Delete';
// import InputBase from '@mui/material/InputBase';
// import Button from '@mui/material/Button';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
// import Box from '@mui/material/Box';
// import SearchIcon from '@material-ui/icons/Search';
// import Typography from '@mui/material/Typography';
// import Modal from '@mui/material/Modal';
// import AttachFileIcon from '@material-ui/icons/AttachFile';
// import NotificationsIcon from '@material-ui/icons/Notifications';
// import Paper from '@mui/material/Paper';
// import ToggleButton from '@mui/material/ToggleButton';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import StarIcon from '@material-ui/icons/Star';
// import Stack from '@mui/material/Stack';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import downarrow from '../../images/icon_downarrow.svg';
// import Checkbox from '@mui/material/Checkbox';
// import Avatar from '@mui/material/Avatar';
// import Accordion from '@mui/material/Accordion';
// import AccordionDetails from '@mui/material/AccordionDetails';
// import AccordionSummary from '@mui/material/AccordionSummary';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// import Compose from '../ComposePage/ComposePage';
// import inboxuser1 from '../../images/avatar/1.jpg';
// import iconstar from '../../images/icon_star.svg';
// import iconsarrow1 from '../../images/icons_arrow_1.svg';
// import iconsarrow2 from '../../images/icons_arrow_2.svg';
// import icondelete from '../../images/icon_delete.svg';
// import iconmenu from '../../images/icon_menu.svg';
// import Emailinbox from '../../images/email_inbox_img.png';
// import Sent from '../../images/icons/sent.svg';
// import { Col, Row } from 'react-bootstrap';
// import defaultimage from '../../images/default.png';
// import { CommonConstants } from "../../_constants/common.constants";
// import { ResponseMessage } from "../../_constants/response.message";
// import { GetUserDetails, LoaderHide, LoaderShow } from "../../_helpers/Utility";
// import InfiniteScroll from "react-infinite-scroll-component";
// import ArrowRight from '@material-ui/icons/ArrowRight';
// import ArrowLeft from '@material-ui/icons/ArrowLeft';
// import Tooltip from "@material-ui/core/Tooltip";
// import timermenu from '../../images/icons/timermenu.svg';
// import AllSentEmailsComposePage from '../AllSentEmailsComposePage/AllSentEmailsComposePage';
// import { EditorVariableNames } from "../../_helpers/Utility";

// import 'froala-editor/js/froala_editor.pkgd.min.js';
// import 'froala-editor/css/froala_style.min.css';
// import 'froala-editor/css/froala_editor.pkgd.min.css';
// import Froalaeditor from 'froala-editor';
// import FroalaEditor from 'react-froala-wysiwyg';

// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// toast.configure();

// const Style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };
// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// function UseOutSideAlerter(Ref) {
//   useEffect(() => {
//     function HandleClickOutside(Event) {
//       if (Ref.current && !Ref.current.contains(Event.target)) {
//         const Element = document.getElementById("Userdropshow")
//         Element.classList.remove("show");
//       }
//     }
//     document.addEventListener("mousedown", HandleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", HandleClickOutside);
//     };
//   }, [Ref]);
// }
// localStorage.setItem("DropdownCheckData", 'Refresh');

// export default function AllSentEnailsPage() {
//   const [AllSentEmailsList, SetAllSentEmailsList] = React.useState([]);
//   const [Page, SetPage] = React.useState(1);
//   const [RowsPerPage, SetRowsPerPage] = React.useState(10);
//   const [SearchSent, SetSearchSent] = React.useState("");
//   const [SortField, SetSortField] = React.useState("MailSentDatetime");
//   const [SortedBy, SetSortedBy] = React.useState(-1);
//   const [ClientID, SetClientID] = React.useState(0);
//   const [UserID, SetUserID] = React.useState(0);
//   const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
//   const [DeletePopModel, SetDeletePopModel] = React.useState(false);
//   const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
//   const [StarPopModel, SetStarPopModel] = React.useState(false);
//   const [SentMailsChecked, SetSentMailsChecked] = React.useState([]);
//   const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
//   const [EmailDropdownList, SetEmailDropdownList] = useState([]);
//   const [EmailDropdownListChecked, SetEmailDropdownListChecked] = React.useState([-1]);
//   const [MailNumber, SetMailNumber] = React.useState(1);
//   const [ResponseData, SetResponseData] = useState([])
//   const [HasMore, SetHasMore] = useState(true)
//   const [TotalCount, SetTotalCount] = React.useState(0);
//   const [Signature, SetSignature] = useState({
//     Data: ""
//   })
//   const [ForwardSignature, SetForwardSignature] = useState({
//     Data: ""
//   })


//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [temopen, setTemOpen] = React.useState(false);
//   const handleTemOpen = () => setTemOpen(true);
//   const handleTemClose = () => setTemOpen(false);
//   const [expanded, setExpanded] = React.useState(false);
//   const [ObjectData, SetAllObjectData] = useState([])
//   const [TemplateData, SetAllTemplateData] = useState([])
//   const [ClientData, SetClientData] = useState()

//   const handleChange = (panel) => (event, isExpanded) => {
//     console.log(panel);
//     setExpanded(isExpanded ? panel : false);
//   };

//   const SelectTemplate = () => {
//     var GetByClass = document.getElementsByClassName('active');
//     LoaderShow()
//     if (GetByClass.length > 0) {
//       var TemplateID = document.getElementsByClassName('active')[0].id;
//       var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
//       var BodyData = Signature.Data;
//       document.getElementById("Subject").value = DivData.Subject;
//       // var NewData = BodyData + '</br>' + DivData.BodyText;
//       var NewData = DivData.BodyText + BodyData
//       SetSignature({ Data: NewData });
//       LoaderHide()
//       handleTemClose()
//     } else {
//       toast.error("Please select template");
//       LoaderHide()
//     }
//   }

//   const SelectObjectTemplate = () => {
//     var GetByClass = document.getElementsByClassName('active');
//     LoaderShow()
//     if (GetByClass.length > 0) {
//       var ObjectionTemplateID = document.getElementsByClassName('active')[0].id;
//       var DivData = ObjectData.find(data => data.ObjectionTemplateID === ObjectionTemplateID);
//       var BodyData = Signature.Data;
//       document.getElementById("Subject").value = DivData.Subject;
//       var NewData = DivData.BodyText + BodyData
//       SetSignature({ Data: NewData });
//       LoaderHide()
//       handleClose()
//     } else {
//       toast.error("Please select object template");
//       LoaderHide()
//     }
//   }

//   const ActiveClass = (panel) => () => {
//     const element = document.getElementById(panel)
//     const elementcs = document.getElementsByClassName("active")
//     if (elementcs.length > 0) {
//       for (var i = elementcs.length - 1; i >= 0; i--) {
//         elementcs[i].classList.remove("active");
//       }
//     }
//     element.classList.add("active");
//   }

//   useEffect(() => {
//     document.title = 'All Sent Emails | MAXBOX';
//     GetClientID();
//   }, [SearchSent]);

//   // Get ClientID
//   const GetClientID = () => {
//     var UserDetails = GetUserDetails();
//     if (UserDetails != null) {
//       SetClientID(UserDetails.ClientID);
//       SetUserID(UserDetails.UserID);
//     }
//     GetAllSentEmailsList(UserDetails.ClientID, UserDetails.UserID, Page, "", EmailDropdownListChecked);
//     // if (ResponseData.length <= 10) {
//     //   SetHasMore(false)
//     // }
//   }
//   const SetHasMoreData = (arr) => {
//     if (arr.length === 0) {
//       SetHasMore(false)
//     } else if (arr.length <= 9) {
//       SetHasMore(false)
//     } else if (arr.length === 10) {
//       SetHasMore(true)
//     }
//   }
//   // Start Get All SentEmails List
//   const GetAllSentEmailsList = (CID, UID, PN, Str, IDs) => {

//     let Data = {
//       Page: PN,
//       RowsPerPage: RowsPerPage,
//       sort: true,
//       Field: SortField,
//       Sortby: SortedBy,
//       Search: SearchSent,
//       ClientID: CID,
//       UserID: UID,
//       AccountIDs: IDs
//     };

//     const ResponseApi = Axios({
//       url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryGet",
//       method: "POST",
//       data: Data,
//     });
//     ResponseApi.then((Result) => {
//       if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//         if (Result.data.PageData.length > 0) {
//           SetResponseData(Result.data.PageData)
//           SetHasMore(Result.data.PageData)
//           // SetAllSentEmailsList([...AllSentEmailsList, ...Result.data.PageData]);
//           if (Str == "checkbox") {
//             SetAllSentEmailsList(Result.data.PageData);
//           } else if (Str == "scroll") {
//             SetAllSentEmailsList([...AllSentEmailsList, ...Result.data.PageData]);
//           } else {
//             SetAllSentEmailsList(Result.data.PageData);
//           }
//           OpenMessageDetails(Result.data.PageData[0]._id);
//           SetMailNumber(1)
//           LoaderHide()
//         }
//         else if (Result.data.PageData?.length === 0 && Str == "checkbox") {
//           SetAllSentEmailsList([])
//           OpenMessageDetails('')
//           LoaderHide()
//         }
//         else {
//           SetResponseData([])
//           SetHasMoreData(Result.data.PageData)
//           if (AllSentEmailsList && AllSentEmailsList?.length > 1) {
//             SetAllSentEmailsList([...AllSentEmailsList]);
//             let LastElement = AllSentEmailsList?.slice(-1)
//             OpenMessageDetails(LastElement[0]?._id, 0);
//           } else {
//             OpenMessageDetails('');
//             SetAllSentEmailsList([]);
//           }
//           LoaderHide()
//           if (OpenMessage.length == 0) {
//             toast.error(<div>All Sent Emails <br />No Data.</div>)
//           }
//         }
//         GetTotalRecordCount(CID, UID);
//       }
//       else {
//         SetAllSentEmailsList([]);
//         OpenMessageDetails('');
//         toast.error(Result?.data?.Message);
//       }
//     });
//   };

//   // End Get All SentEmails List

//   //Start Open Message Details
//   const OpenMessageDetails = (ID, index) => {
//     LoaderShow();
//     if (ID != '') {
//       SetMailNumber(index + 1)
//       var Data = {
//         _id: ID,
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryGetByID",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           if (Result.data.Data.length > 0) {
//             SetOpenMessageDetails(Result.data.Data[0]);
//             LoaderHide();
//           } else {
//             SetAllSentEmailsList([])
//             SetOpenMessageDetails([]);
//             LoaderHide();
//           }
//         }
//         else {
//           SetOpenMessageDetails('');
//           toast.error(Result?.data?.Message);
//           LoaderHide();
//         }
//       });
//     }
//     else {
//       SetOpenMessageDetails([]);
//       LoaderHide();
//     }
//   };
//   //End Open Message Details

//   // start PopModel Open and Close and Delete Message
//   const OpenDeletePopModel = () => {
//     SetDeletePopModel(true);
//   }
//   const CloseDeletePopModel = () => {
//     SetDeletePopModel(false);
//   }
//   const DeleteMessage = (ID) => {
//     if (ID != '') {
//       var DeleteArray = []
//       DeleteArray.push(ID)
//       var Data = {
//         IDs: DeleteArray,
//         LastUpdatedBy: -1
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryDelete",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           toast.success(<div>All Sent Emails <br />Mail deleted successfully.</div>);
//           CloseDeletePopModel();
//           OpenMessageDetails('')
//           LoaderShow()
//           GetAllSentEmailsList(ClientID, UserID, Page, "", EmailDropdownListChecked);
//         } else {
//           toast.error(Result?.data?.Message);
//         }
//       });
//     }
//   }
//   // End PopModel Open and Close And Delete Message

//   // Start Delete All Message
//   const OpenAllDeletePopModel = () => {
//     if (SentMailsChecked.length > 0) {
//       SetAllDeletePopModel(true);
//     } else {
//       toast.error("Please select atleast one email.")
//     }
//   }
//   const CloseAllDeletePopModel = () => {
//     SetAllDeletePopModel(false);
//   }
//   const DeleteAllMessage = () => {
//     if (SentMailsChecked.length > 0) {
//       var Data = {
//         IDs: SentMailsChecked,
//         LastUpdatedBy: -1
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryDelete",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           toast.success(<div>All Sent Emails <br />Mail deleted successfully.</div>);
//           CloseAllDeletePopModel();
//           OpenMessageDetails('')
//           LoaderShow()
//           GetAllSentEmailsList(ClientID, UserID, Page, "", EmailDropdownListChecked);
//           SetSelectAllCheckbox(false);
//           SetSentMailsChecked([]);
//         } else {
//           toast.error(Result?.data?.Message);
//         }
//       });
//     }
//   }
//   // End Delete All Message

//   // Start Update Star Message and model open and close
//   const OpenStarPopModel = () => {
//     SetStarPopModel(true);
//   }
//   const CloseStarPopModel = () => {
//     SetStarPopModel(false);
//   }
//   const UpdateStarMessage = (ID) => {
//     if (ID != '') {
//       var Data = {
//         _id: ID,
//         IsStarred: true,
//         LastUpdatedBy: -1
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/SentEmailHistoryStatusUpdate",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           toast.success(<div>All Sent Emails  <br />Starred  updated successfully.</div>);
//           CloseStarPopModel();
//           OpenMessageDetails('')
//           LoaderShow()
//           GetAllSentEmailsList(ClientID, UserID, Page, "", EmailDropdownListChecked);
//         } else {
//           toast.error(Result?.data?.Message);
//         }
//       });
//     }
//   }
//   // End Update Star Message and model open and close

//   // Start CheckBox Code
//   const InBoxCheckBox = (e) => {
//     var UpdatedList = [...SentMailsChecked];
//     if (e.target.checked) {
//       UpdatedList = [...SentMailsChecked, e.target.value];
//     } else {
//       UpdatedList.splice(SentMailsChecked.indexOf(e.target.value), 1);
//     }
//     SetSentMailsChecked(UpdatedList);
//   }
//   const SeleactAllSentMailCheckBox = (e) => {
//     if (e.target.checked) {
//       SetSelectAllCheckbox(true);
//       SetSentMailsChecked(AllSentEmailsList.map(item => item._id));
//     } else {
//       SetSelectAllCheckbox(false);
//       SetSentMailsChecked([]);
//     }

//   }
//   // End CheckBox Code

//   /* start navcode */

//   const NavBarClick = () => {
//     const element = document.getElementById("navclose")
//     if (element.classList.contains("opennav")) {
//       element.classList.remove("opennav");
//     }
//     else {
//       element.classList.add("opennav");
//     }
//   }
//   /* end code*/

//   /* start navcode */

//   const Userdropdown = () => {
//     const element = document.getElementById("Userdropshow")
//     if (element.classList.contains("show")) {
//       element.classList.remove("show");
//     }
//     else {
//       element.classList.add("show");
//     }
//   }
//   function UseOutsideAlerter(Ref) {
//     useEffect(() => {
//       function handleClickOutside(event) {
//         if (Ref.current && !Ref.current.contains(event.target)) {
//           const element = document.getElementById("Userdropshow")
//           element.classList.remove("show");
//         }
//       }
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, [Ref]);
//   }
//   /* end code*/

//   // Start Search
//   const SearchBox = (e) => {
//     if (e.keyCode == 13) {
//       SetPage(1);
//       SetRowsPerPage(10);
//       SetAllSentEmailsList([]);
//       SetSearchSent(e.target.value)
//     }
//   }
//   // End Search


//   const FromEmailList = () => {
//     var ResultData = (localStorage.getItem('DropdownCheckData'));
//     if (ResultData == "Refresh") {
//       var Data = {
//         ClientID: ClientID,
//         UserID: UserID,
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/EmailAccountGet",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           if (Result.data.PageData.length > 0) {
//             SetEmailDropdownListChecked()
//             SetEmailDropdownList(Result.data.PageData);
//             SetEmailDropdownListChecked(Result.data.PageData.map(item => item._id));
//             localStorage.setItem("DropdownCheckData", Result.data.PageData.map(item => item._id));
//             const element = document.getElementById("id_userboxlist")
//             if (element.classList.contains("show")) {
//               element.classList.remove("show");
//             }
//             else {
//               element.classList.add("show");
//             }
//           } else {
//             toast.error(<div>All Sent Emails <br />Please add email configuration.</div>)
//           }
//         }
//         else {
//           SetEmailDropdownList([]);
//           toast.error(Result?.data?.Message);
//         }
//       });
//     }
//     else {

//       const element = document.getElementById("id_userboxlist")
//       if (element.classList.contains("show")) {
//         element.classList.remove("show");
//       }
//       else {
//         element.classList.add("show");
//       }
//       SetEmailDropdownListChecked(ResultData.split(','));

//     }
//   }

//   // Handle Change Dropdown List Manage by on React Js
//   const EmailDropdownListCheckbox = (e) => {
//     localStorage.removeItem("DropdownCheckData");

//     var UpdatedList = [...EmailDropdownListChecked];
//     if (e.target.checked) {
//       UpdatedList = [...EmailDropdownListChecked, e.target.value];
//       SetPage(1)
//       LoaderShow()
//       GetAllSentEmailsList(ClientID, UserID, 1, "checkbox", UpdatedList)
//     } else {
//       UpdatedList.splice(EmailDropdownListChecked.indexOf(e.target.value), 1);
//       SetPage(1)
//       LoaderShow()
//       GetAllSentEmailsList(ClientID, UserID, 1, "checkbox", UpdatedList)
//     }
//     localStorage.setItem("DropdownCheckData", UpdatedList);
//     SetEmailDropdownListChecked(UpdatedList);
//   }


//   const RefreshPage = () => {
//     LoaderShow()
//     SetPage(1);
//     SetRowsPerPage(10);
//     SetAllSentEmailsList([]);
//     SetSelectAllCheckbox(false);
//     SetSearchSent('');
//     SetSentMailsChecked([]);
//     SetEmailDropdownListChecked([-1])
//     GetAllSentEmailsList(ClientID, UserID, Page, "", [-1])
//     const element = document.getElementById("id_userboxlist")
//     if (element.classList.contains("show")) {
//       element.classList.remove("show");
//     }
//     // else {
//     //   element.classList.add("show");
//     // }
//     localStorage.setItem("DropdownCheckData", 'Refresh');
//   }

//   // Fetch More Data
//   const FetchMoreData = async () => {
//     SetPage(Page + 1);
//     await GetAllSentEmailsList(ClientID, UserID, Page + 1, "scroll", EmailDropdownListChecked)

//   };

//   // Get Total Total Record Count
//   const GetTotalRecordCount = (CID, UID) => {
//     const Data = {
//       ClientID: CID,
//       UserID: UID,
//       IsAllSent: true

//     }
//     Axios({
//       url: CommonConstants.MOL_APIURL + "/sent_email_history/TotalRecordCount",
//       method: "POST",
//       data: Data,
//     }).then((Result) => {
//       if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

//         if (Result.data.TotalCount >= 0) {
//           SetTotalCount(Result.data.TotalCount);
//         } else {
//           SetTotalCount(0);
//           toast.error(Result?.data?.Message);
//         }

//       }
//     })
//   }

//   const ReplyPopModel = (ObjMailsData) => {

//     const Data = {
//       ID: OpenMessage?._id,
//     }
//     Axios({
//       url: CommonConstants.MOL_APIURL + "/sent_email_history/SentGetReplyMessageDetails",
//       method: "POST",
//       data: Data,
//     }).then((Result) => {
//       if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//         SetSignature({ Data: Result?.data?.Data })
//       } else {
//         toast.error(Result?.data?.Message);
//       }
//     })

//     const element = document.getElementsByClassName("user_editor")
//     SetSignature({ Data: "" });


//     const elementreply = document.getElementsByClassName("user_editor_frwd")
//     elementreply[0].classList.add("d-none");
//     if (element[0].classList.contains("d-none")) {
//       element[0].classList.remove("d-none");
//       if (ObjMailsData != '') {

//         var ToEmail = ObjMailsData.FromName + " (" + ObjMailsData.FromEmail + ")";

//         document.getElementById("lblreplytoemail").innerHTML = ToEmail
//         document.getElementById("lblreplytoemail").value = ToEmail
//       }
//     }

//   }

//   const ReplyPopModelClose = () => {
//     const element = document.getElementsByClassName("user_editor")
//     element[0].classList.add("d-none");
//   }

//   // Starts Reply Send Mail
//   const ReplySendMail = () => {
//     var ToEmail = OpenMessage.ToEmail;
//     var ToName = OpenMessage.ToName
//     var FromEmail = OpenMessage.FromEmail;
//     var FromName = OpenMessage.FromName
//     var ID = OpenMessage._id
//     var Subject = OpenMessage.Subject;
//     var Body = Signature?.Data

//     if (Body == "") {
//       toast.error("Please Enter Body");
//     } else {
//       LoaderShow()
//       var Data = {
//         ToEmail: ToEmail,
//         ToName: ToName,
//         FromEmail : FromEmail,
//         FromName : FromName,
//         ID: ID,
//         Subject: Subject,
//         Body: Body
//       };
//       const ResponseApi = Axios({
//         url: CommonConstants.MOL_APIURL + "/sent_email_history/AllSentReplyMessage",
//         method: "POST",
//         data: Data,
//       });
//       ResponseApi.then((Result) => {
//         if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//           toast.success(<div>Unanswered Responses <br />Reply mail send successfully.</div>);
//           ReplyPopModelClose();
//           SetSignature({ Data: "" })
//           LoaderHide()
//         } else {
//           ReplyPopModelClose();
//           toast.error(Result?.data?.Message);
//           LoaderHide()
//         }
//       });
//     }
//   }
//   // End Reply Send Mail

//   // Send Reply Frola Editor Starts
//   Froalaeditor.RegisterCommand('SendReply', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     callback: ReplySendMail
//   });
//   Froalaeditor.RegisterCommand('Delete', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     align: 'right',
//     buttonsVisible: 2,
//     title: 'Delete',
//   });
//   Froalaeditor.RegisterCommand('Sendoption', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     title: '',
//     type: 'dropdown',
//     focus: false,
//     undo: false,
//     refreshAfterCallback: true,
//     options: EditorVariableNames(),
//     callback: function (cmd, val) {
//       var editorInstance = this;
//       editorInstance.html.insert("{" + val + "}");
//     },
//     // Callback on refresh.
//     refresh: function ($btn) {
//     },
//     // Callback on dropdown show.
//     refreshOnShow: function ($btn, $dropdown) {
//     }
//   });
//   /* template option */
//   Froalaeditor.RegisterCommand('TemplatesOptions', {
//     title: 'Templates Option',
//     type: 'dropdown',
//     focus: false,
//     undo: false,
//     className: 'tam',
//     refreshAfterCallback: true,
//     // options: EditorVariableNames(),
//     options: {
//       'opt1': 'Objections',
//       'opt2': 'Templates'
//     },
//     callback: function (cmd, val) {
//       var editorInstance = this;
//       if (val == "opt1") {
//         LoaderShow()
//         var Data = {
//           ClientID: ClientID,
//           UserID: UserID,
//         };
//         const ResponseApi = Axios({
//           url: CommonConstants.MOL_APIURL + "/objection_template/ObjectionTemplateGetAll",
//           method: "POST",
//           data: Data,
//         });
//         ResponseApi.then((Result) => {
//           if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//             if (Result.data.PageData.length > 0) {
//               setExpanded(false)
//               SetAllObjectData(Result.data.PageData)
//               setOpen(true);
//               LoaderHide()
//             } else {
//               toast.error(Result?.data?.Message);
//               LoaderHide()
//             }
//           } else {
//             SetAllObjectData('');
//             toast.error(Result?.data?.Message);
//           }
//         });
//         // editorInstance.html.insert("{" + val + "}");
//       }
//       if (val == "opt2") {
//         LoaderShow()
//         var Data = {
//           ClientID: ClientID,
//           UserID: UserID,
//         };
//         const ResponseApi = Axios({
//           url: CommonConstants.MOL_APIURL + "/templates/TemplateGetAll",
//           method: "POST",
//           data: Data,
//         });
//         ResponseApi.then((Result) => {
//           if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//             if (Result.data.PageData.length > 0) {
//               setExpanded(false);
//               SetAllTemplateData(Result.data.PageData)
//               setTemOpen(true);
//               LoaderHide()
//             } else {
//               toast.error(Result?.data?.Message);
//               LoaderHide()
//             }
//           } else {
//             SetAllTemplateData('');
//             toast.error(Result?.data?.Message);
//           }
//         });

//         // editorInstance.html.insert("{" + val + "}");
//       }
//     },
//     // Callback on refresh.
//     refresh: function ($btn) {

//     },
//     // Callback on dropdown show.
//     refreshOnShow: function ($btn, $dropdown) {
//     }
//   });
//   /* end template option */
//   Froalaeditor.RegisterCommand('moreMisc', {
//     title: '',
//     type: 'dropdown',
//     focus: false,
//     undo: false,
//     refreshAfterCallback: true,
//     options: EditorVariableNames(),
//     callback: function (cmd, val) {
//       var editorInstance = this;
//       editorInstance.html.insert("{" + val + "}");
//     },
//     // Callback on refresh.
//     refresh: function ($btn) {

//     },
//     // Callback on dropdown show.
//     refreshOnShow: function ($btn, $dropdown) {

//     }
//   });
//   // Check Client Exists
//   const config = {
//     quickInsertEnabled: false,
//     placeholderText: 'Edit Your Content Here!',
//     charCounterCount: false,
//     toolbarButtons: [['SendReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions'], ['Delete']],
//     imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
//     fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
//     imageUploadRemoteUrls: false,
//   }
//   const HandleModelChange = (Model) => {
//     SetSignature({
//       Data: Model
//     });
//   }
//   var editor = new FroalaEditor('.send', {}, function () {
//     editor.button.buildList();
//   })
//   // Send Reply Frola Editor Ends

//   const ForwardPopModel = (ObjMailsData) => {
//     const Data = {
//       ID: OpenMessage?._id,
//     }
//     Axios({
//       url: CommonConstants.MOL_APIURL + "/sent_email_history/SentGetForwardMssageDetails",
//       method: "POST",
//       data: Data,
//     }).then((Result) => {
//       if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//         SetForwardSignature({ Data: Result?.data?.Data })
//       } else {
//         toast.error(Result?.data?.Message);
//       }
//     })

//     const element = document.getElementsByClassName("user_editor_frwd")

//     SetForwardSignature({ Data: "" });
//     document.getElementById("to").value = "";
//     const elementreply = document.getElementsByClassName("user_editor")
//     elementreply[0].classList.add("d-none");

//     if (element[0].classList.contains("d-none")) {
//       element[0].classList.remove("d-none");
//       if (ObjMailsData != '') {

//         var ToEmail = ObjMailsData.FromName + " (" + ObjMailsData.FromEmail + ")";
//         document.getElementById("lblreplytoemailfrwd").innerHTML = ToEmail
//         document.getElementById("lblreplytoemailfrwd").value = ToEmail
//       }
//     }

//   }


//   const ForwardPopModelClose = () => {
//     const element = document.getElementsByClassName("user_editor_frwd")
//     element[0].classList.add("d-none");
//   }

//   // Validate Email
//   const ValidateEmail = (Email) => {
//     if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)) {
//       return false;
//     }
//     else {
//       return true;
//     }
//   };

//   // Forward Send Mail Starts
//   const ForwardSendMail = (ObjMailData) => {
//     var ToEmail = document.getElementById("to").value;
//     var ID = OpenMessage._id
//     var Subject = OpenMessage.Subject;
//     var Body = ForwardSignature.Data

//     const IsEmailValid = ValidateEmail(ToEmail)



//     if (Body == "") {
//       toast.error("Please Enter Body");
//     } else if (ToEmail == "") {
//       toast.error("Please Enter Email")
//     }

//     else {
//       if (IsEmailValid) {
//         LoaderShow()
//         var Data = {
//           ToEmail: ToEmail,
//           ToName: "",
//           ID: ID,
//           Subject: Subject,
//           Body: ForwardSignature.Data
//         };
//         const ResponseApi = Axios({
//           url: CommonConstants.MOL_APIURL + "/sent_email_history/SentPageForwardMessage",
//           method: "POST",
//           data: Data,
//         });
//         ResponseApi.then((Result) => {
//           if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
//             toast.success(<div>Unanswered Responses <br />Forward mail send successfully.</div>);
//             ForwardPopModelClose();
//             SetForwardSignature({ Data: "" })
//             LoaderHide()
//           }
//           else {
//             ForwardPopModelClose();
//             toast.error(Result?.data?.Message);
//             LoaderHide()
//           }
//         });
//       } else {
//         toast.error("Please Enter Valid Email");
//       }
//     }
//   }
//   // Forward Send Mail Ends

//   // Forward  Reply Frola Editor Starts
//   Froalaeditor.RegisterCommand('ForwardReply', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     callback: ForwardSendMail
//   });
//   Froalaeditor.RegisterCommand('Delete', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     align: 'right',
//     buttonsVisible: 2,
//     title: 'Delete',
//   });
//   Froalaeditor.RegisterCommand('Sendoption', {
//     colorsButtons: ["colorsBack", "|", "-"],
//     title: '',
//     type: 'dropdown',
//     focus: false,
//     undo: false,
//     refreshAfterCallback: true,
//     options: EditorVariableNames(),
//     callback: function (cmd, val) {
//       var editorInstance = this;
//       editorInstance.html.insert("{" + val + "}");
//     },
//     // Callback on refresh.
//     refresh: function ($btn) {
//     },
//     // Callback on dropdown show.
//     refreshOnShow: function ($btn, $dropdown) {

//     }
//   });
//   Froalaeditor.RegisterCommand('moreMisc', {
//     title: '',
//     type: 'dropdown',
//     focus: false,
//     undo: false,
//     refreshAfterCallback: true,
//     options: EditorVariableNames(),
//     callback: function (cmd, val) {
//       var editorInstance = this;
//       editorInstance.html.insert("{" + val + "}");
//     },
//     // Callback on refresh.
//     refresh: function ($btn) {

//     },
//     // Callback on dropdown show.
//     refreshOnShow: function ($btn, $dropdown) {

//     }
//   });
//   // Check Client Exists
//   const forwardconfig = {
//     quickInsertEnabled: false,
//     placeholderText: 'Edit Your Content Here!',
//     charCounterCount: false,
//     toolbarButtons: [['ForwardReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['Delete']],
//     imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
//     fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
//     imageUploadRemoteUrls: false,
//   }
//   const ForwardHandleModelChange = (Model) => {
//     SetForwardSignature({
//       Data: Model
//     });
//   }
//   var editor = new FroalaEditor('.send', {}, function () {
//     editor.button.buildList();
//   })
//   // Forward  Reply Frola Editor Ends

//   const Search = styled('div')(({ theme }) => ({
//     position: 'relative',
//     borderRadius: theme.shape.borderRadius,
//     backgroundColor: alpha(theme.palette.common.white, 0.15),
//     '&:hover': {
//       backgroundColor: alpha(theme.palette.common.white, 0.25),
//     },
//     marginRight: theme.spacing(2),
//     marginLeft: 0,
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       marginLeft: theme.spacing(3),
//       width: 'auto',
//     },
//   }));

//   const SearchIconWrapper = styled('div')(({ theme }) => ({
//     padding: theme.spacing(0, 2),
//     height: '100%',
//     position: 'absolute',
//     pointerEvents: 'none',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   }));

//   const StyledInputBase = styled(InputBase)(({ theme }) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//       padding: theme.spacing(1, 1, 1, 0),
//       paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//       transition: theme.transitions.create('width'),
//       width: '100%',
//       [theme.breakpoints.up('md')]: {
//         width: '20ch',
//       },
//     },
//   }));

//   const Item = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(1),
//     textAlign: 'left',
//     color: theme.palette.text.secondary,
//   }));

//   const WrapperRef = useRef(null);
//   UseOutSideAlerter(WrapperRef);

//   return (
//     <>

//       <div>

//         <Modal className="modal-lister"
//           open={open}
//           onClose={handleClose}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <div className='m-head'>
//               <Typography id="modal-modal-title" variant="h4" component="h4">
//                 Select Objection
//               </Typography>
//             </div>
//             <div className='m-body'>
//               <div className='listcardman'>
//                 {ObjectData?.length > 0 && ObjectData?.map((row, index) => (
//                   <div className='cardtemplate' onClick={ActiveClass(row.ObjectionTemplateID)} id={row.ObjectionTemplateID} >
//                     <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
//                     <Accordion className='activetemplate' expanded={expanded === row.ObjectionTemplateID} onChange={handleChange(row.ObjectionTemplateID)}>
//                       <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                         aria-controls="panel2bh-content"
//                         id="panel2bh-header"
//                       >
//                       </AccordionSummary>
//                       <AccordionDetails >
//                         <Typography >
//                           {parse(row.BodyText)}
//                         </Typography>
//                       </AccordionDetails>
//                     </Accordion>
//                   </div>

//                 ))}


//               </div>

//             </div>
//             <div className='m-fotter' align="right">
//               <ButtonGroup variant="text" aria-label="text button group">
//                 <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleClose}> Cancel</Button>
//                 <Button variant="contained btn btn-primary smallbtn" onClick={SelectObjectTemplate}> Select</Button>
//               </ButtonGroup>
//             </div>
//           </Box>
//         </Modal>

//         <Modal className="modal-lister"
//           open={temopen}
//           onClose={handleTemClose}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <div className='m-head'>
//               <Typography id="modal-modal-title" variant="h4" component="h4">
//                 Select Template
//               </Typography>
//             </div>
//             <div className='m-body'>
//               <div className='listcardman'>

//                 {TemplateData?.length > 0 && TemplateData?.map((row, index) => (
//                   <div className='cardtemplate' onClick={ActiveClass(row.TemplatesID)} id={row.TemplatesID} >
//                     <Typography className='upperlable' sx={{ width: '33%', flexShrink: 0 }}>{row.Subject}</Typography>
//                     <Accordion className='activetemplate' expanded={expanded === row.TemplatesID} onChange={handleChange(row.TemplatesID)}>
//                       <AccordionSummary
//                         expandIcon={<ExpandMoreIcon />}
//                         aria-controls="panel2bh-content"
//                         id="panel2bh-header"
//                       >
//                       </AccordionSummary>
//                       <AccordionDetails >
//                         <Typography >
//                           {parse(row.BodyText)}
//                         </Typography>
//                       </AccordionDetails>
//                     </Accordion>
//                   </div>
//                 ))}
//               </div>

//             </div>
//             <div className='m-fotter' align="right">
//               <ButtonGroup variant="text" aria-label="text button group">
//                 <Button variant="contained btn btn-orang smallbtn mr-3" onClick={handleTemClose}> Cancel</Button>
//                 <Button variant="contained btn btn-primary smallbtn" onClick={SelectTemplate}> Select</Button>
//               </ButtonGroup>
//             </div>
//           </Box>
//         </Modal>

//         <Modal className="modal-pre"
//           open={DeletePopModel}
//           onClose={CloseDeletePopModel}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={Style} className="modal-prein">
//             <div className='p-5 text-center'>
//               <img src={Emailinbox} width="130" className='mb-4' />
//               <Typography id="modal-modal-title" variant="b" component="h6">
//                 Are you sure ?
//               </Typography>
//               <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                 you want to delete a email ?
//               </Typography>
//             </div>
//             <div className='d-flex btn-50'>
//               <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteMessage(OpenMessage._id); }}>
//                 Yes
//               </Button>
//               <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseDeletePopModel(); }}>
//                 No
//               </Button>
//             </div>
//           </Box>
//         </Modal>

//         <Modal className="modal-pre"
//           open={AllDeletePopModel}
//           onClose={CloseAllDeletePopModel}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={Style} className="modal-prein">
//             <div className='p-5 text-center'>
//               <img src={Emailinbox} width="130" className='mb-4' />
//               <Typography id="modal-modal-title" variant="b" component="h6">
//                 Are you sure ?
//               </Typography>
//               <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                 you want to delete selected email ?
//               </Typography>
//             </div>
//             <div className='d-flex btn-50'>
//               <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteAllMessage(); }}>
//                 Yes
//               </Button>
//               <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseAllDeletePopModel(); }}>
//                 No
//               </Button>
//             </div>
//           </Box>
//         </Modal>

//         <Modal className="modal-pre"
//           open={StarPopModel}
//           onClose={CloseStarPopModel}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={Style} className="modal-prein">
//             <div className='p-5 text-center'>
//               <img src={Emailinbox} width="130" className='mb-4' />
//               <Typography id="modal-modal-title" variant="b" component="h6">
//                 Are you sure
//               </Typography>
//               {
//                 OpenMessage?.IsStarred === false ?
//                   <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                     you want to Star an email ?
//                   </Typography>
//                   :
//                   <Typography id="modal-modal-description" sx={{ mt: 2 }}>
//                     you want to UnStar an email ?
//                   </Typography>
//               }
//             </div>
//             <div className='d-flex btn-50'>
//               <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateStarMessage(OpenMessage._id); }}>
//                 Yes
//               </Button>
//               <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseStarPopModel(); }}>
//                 No
//               </Button>
//             </div>
//           </Box>
//         </Modal>





//       </div>

//       <div className='bodymain'>
//         <Row className='mb-columfull'>
//           <Col className='maxcontainerix' id="navclose">
//             <div className='closeopennav'>
//               <a className='navicons m-4' onClick={(NavBarClick)}><ArrowRight /></a>
//               <Tooltip title="All Sent Emails"><a className='m-4'><img src={Sent} /></a></Tooltip>
//             </div>
//             <div className='navsmaller px-0 leftinbox'>
//               <div className='px-3 bgfilter'>
//                 <Row>
//                   <Col sm={9}><a className='navicons mr-2' onClick={(NavBarClick)}><ArrowLeft /></a> <h3 className='title-h3'>All Sent Emails</h3> </Col>
//                   <Col sm={3}>
//                     <div className="inboxnoti">
//                       <NotificationsIcon />
//                       {TotalCount}
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row className='my-3'>
//                   <Col>
//                     <div className='textbox-dek serchdek'>
//                       <Search onKeyUp={(e) => SearchBox(e, this)}>
//                         <SearchIconWrapper>
//                           <SearchIcon />
//                         </SearchIconWrapper>
//                         <StyledInputBase
//                           defaultValue={SearchSent}
//                           placeholder="Search…"
//                           inputProps={{ 'aria-label': 'search' }}
//                         />
//                       </Search>
//                     </div>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col xs={8}>
//                     <div class="selecter-m inboxtype">
//                       <a href="#" className="selectorall" onClick={FromEmailList}>
//                         All <img src={downarrow} />
//                       </a>
//                       <div className="userdropall" id="id_userboxlist" ref={WrapperRef}>
//                         <div className="bodyuserdop textdeclist">

//                           <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//                             {EmailDropdownList?.map((item, index) => {
//                               const labelId = `checkbox-list-secondary-label-${index}`;
//                               return (
//                                 <ListItem className='droplistchec'
//                                   key={index}
//                                   secondaryAction={
//                                     <Checkbox onChange={EmailDropdownListCheckbox}
//                                       value={item._id}
//                                       checked={EmailDropdownListChecked?.find(x => x === item?._id)}
//                                       inputProps={{ 'aria-labelledby': labelId }} />
//                                   }
//                                   disablePadding
//                                 >
//                                   <ListItemButton>
//                                     <ListItemAvatar>
//                                       <ListItemAvatar className="scvar">
//                                         <Avatar alt="Remy Sharp" src={inboxuser1} />
//                                       </ListItemAvatar>
//                                     </ListItemAvatar>
//                                     <ListItemText primary={item.FirstName} secondary={<React.Fragment>{item.Email}</React.Fragment>}
//                                     />
//                                   </ListItemButton>
//                                 </ListItem>
//                               );
//                             })}
//                           </List>
//                         </div>
//                       </div>
//                     </div>
//                   </Col>
//                   <Col xs={4} align='right'>
//                     <ButtonGroup variant="text" aria-label="text button group">
//                       <Button className='iconbtn' variant="contained" size="large" onClick={RefreshPage} title={"Refresh"}>
//                         <RefreshIcon />
//                       </Button>
//                       <Button className='iconbtn' variant="contained" size="large" onClick={OpenAllDeletePopModel} title={"Delete"}>
//                         <DeleteIcon />
//                       </Button>
//                     </ButtonGroup>
//                   </Col>
//                 </Row>
//                 <Row>
//                   <Col xs={12} className="mt-3">
//                     <FormGroup>
//                       <FormControlLabel control={<Checkbox checked={SelectAllCheckbox} onChange={SeleactAllSentMailCheckBox} />} label="Select All" />
//                     </FormGroup>
//                   </Col>
//                 </Row>
//               </div>
//               {
//                 AllSentEmailsList?.length === 0
//                   ?
//                   <div id="scrollableDiv" class="listinbox">
//                     <InfiniteScroll
//                       dataLength={AllSentEmailsList?.length}
//                       next={FetchMoreData}
//                       hasMore={false}
//                       loader={<h4></h4>}
//                       scrollableTarget="scrollableDiv"
//                     >
//                     </InfiniteScroll>
//                   </div>
//                   :
//                   AllSentEmailsList?.length <= 9
//                     ?
//                     <div id="scrollableDiv" class="listinbox">
//                       <InfiniteScroll
//                         dataLength={AllSentEmailsList?.length}
//                         next={FetchMoreData}
//                         hasMore={false}
//                         loader={<h4></h4>}
//                         scrollableTarget="scrollableDiv"
//                       >
//                         <Stack spacing={1} align="left">
//                           {AllSentEmailsList?.length >= 1 && AllSentEmailsList?.map((row, index) => (
//                             <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
//                               <Row>
//                                 <Col xs={1} className="pr-0">
//                                   <FormControlLabel control={<Checkbox defaultChecked={SentMailsChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
//                                 </Col>
//                                 <Col xs={11} className="pr-0">
//                                   <Row className='mx-0'>
//                                     <Col className='px-2' xs={2}>
//                                       <span className="inboxuserpic">
//                                         <img src={defaultimage} width="55px" alt="" />
//                                       </span>
//                                     </Col>
//                                     <Col className='px-2' xs={8}>
//                                       <h4>{row.FromEmail}</h4>
//                                       <h3>{row.Subject}</h3>
//                                     </Col>
//                                     <Col className='px-2' xs={2}>
//                                       <h6>
//                                         {
//                                           Moment(row.MailSentDatetime).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
//                                             ? Moment(row.MailSentDatetime).format("LT")
//                                             : Moment(row.MailSentDatetime).format("DD/MM/YYYY")
//                                         }
//                                       </h6>
//                                       <ToggleButton className='startselct' value="check" selected={row.IsStarred} onClick={() => UpdateStarMessage(row._id)}>
//                                         <StarBorderIcon className='starone' />
//                                         <StarIcon className='selectedstart startwo' />
//                                       </ToggleButton>
//                                     </Col>
//                                   </Row>
//                                   <Row className='mx-0'>
//                                     {/* <Col xs={2} className='ja-center'>
//                                       <div className='attachfile'>
//                                         <input type="file" />
//                                         <AttachFileIcon />
//                                       </div>
//                                     </Col> */}
//                                     <Col xs={10}>
//                                       <p>{row.Snippet}</p>
//                                     </Col>
//                                   </Row>
//                                 </Col>
//                               </Row>
//                             </Item>
//                           ))}
//                         </Stack>
//                       </InfiniteScroll>
//                     </div>
//                     :
//                     <div id="scrollableDiv" class="listinbox">
//                       <InfiniteScroll
//                         dataLength={AllSentEmailsList?.length}
//                         next={FetchMoreData}
//                         hasMore={HasMore}
//                         loader={<h4>Loading...</h4>}
//                         scrollableTarget="scrollableDiv"
//                         endMessage={
//                           <p style={{ textAlign: "center" }}>
//                             <b>Yay! You have seen it all</b>
//                           </p>
//                         }
//                       >
//                         <Stack spacing={1} align="left">
//                           {AllSentEmailsList?.length > 1 && AllSentEmailsList?.map((row, index) => (
//                             <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
//                               <Row>
//                                 <Col xs={1} className="pr-0">
//                                   <FormControlLabel control={<Checkbox defaultChecked={SentMailsChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
//                                 </Col>
//                                 <Col xs={11} className="pr-0">
//                                   <Row className='mx-0'>
//                                     <Col className='px-2' xs={2}>
//                                       <span className="inboxuserpic">
//                                         <img src={defaultimage} width="55px" alt="" />
//                                       </span>
//                                     </Col>
//                                     <Col className='px-2' xs={8}>
//                                       <h4>{row.FromEmail}</h4>
//                                       <h3>{row.Subject}</h3>
//                                     </Col>
//                                     <Col className='px-2' xs={2}>
//                                       <h6>
//                                         {
//                                           Moment(row.MailSentDatetime).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
//                                             ? Moment(row.MailSentDatetime).format("LT")
//                                             : Moment(row.MailSentDatetime).format("DD/MM/YYYY")
//                                         }
//                                       </h6>
//                                       <ToggleButton className='startselct' value="check" selected={row.IsStarred} onClick={() => UpdateStarMessage(row._id)}>
//                                         <StarBorderIcon className='starone' />
//                                         <StarIcon className='selectedstart startwo' />
//                                       </ToggleButton>
//                                     </Col>
//                                   </Row>
//                                   <Row className='mx-0'>
//                                     {/* <Col xs={2} className='ja-center'>
//                                       <div className='attachfile'>
//                                         <input type="file" />
//                                         <AttachFileIcon />
//                                       </div>
//                                     </Col> */}
//                                     <Col xs={10}>
//                                       <p>{row.Snippet}</p>
//                                     </Col>
//                                   </Row>
//                                 </Col>
//                               </Row>
//                             </Item>
//                           ))}
//                         </Stack>
//                       </InfiniteScroll>
//                     </div>
//               }
//             </div>
//           </Col>
//           <Col className='rightinbox'>
//             <div className='inxtexteditor'>
//               <Row className='bt-border pb-4 mb-4 colsm12'>
//                 <Col lg={6}>
//                   <Row className='userlist'>
//                     <Col xs={2}>
//                       {
//                         OpenMessage == 0 ? ''
//                           :
//                           <span className="inboxuserpic">
//                             <img src={defaultimage} width="63px" alt="" />
//                           </span>
//                       }
//                     </Col>
//                     <Col xs={10} className='p-0'>
//                       <h5>{OpenMessage == 0 ? '' : OpenMessage.EmailAccount.FirstName}</h5>
//                       {/* <h6>{OpenMessage == 0 ? '' : OpenMessage.ToEmail} <KeyboardArrowDownIcon /></h6> */}
//                       <h6> {OpenMessage == 0 ? '' : OpenMessage.ToEmail}
//                         {
//                           OpenMessage == 0 ? ''
//                             :
//                             <a onClick={Userdropdown}>
//                               <KeyboardArrowDownIcon />
//                             </a>
//                         }
//                       </h6>

//                       <div class="userdropall maxuserdropall" id="Userdropshow" ref={WrapperRef}>
//                         <div class="bodyuserdop textdeclist">
//                           <div className='columlistdrop'>
//                             <Row>
//                               <Col className='pr-0' sm={3} align="right"><lable>from:</lable></Col>
//                               <Col sm={9}><strong>{OpenMessage.FromName}</strong> {"<"}{OpenMessage.FromEmail}{">"}</Col>
//                             </Row>
//                             <Row>
//                               <Col className='pr-0' sm={3} align="right"><lable>to:</lable></Col>
//                               <Col sm={9}>
//                                 <p className='mb-0'>{OpenMessage.ToEmail}</p>
//                               </Col>
//                             </Row>
//                             <Row>
//                               <Col className='pr-0' sm={3} align="right"><lable>date:</lable></Col>
//                               <Col sm={9}>{Moment(OpenMessage.MailSentDatetime).format("LLL")}</Col>
//                             </Row>
//                             <Row>
//                               <Col className='pr-0' sm={3} align="right"><lable>subject:</lable></Col>
//                               <Col sm={9}>{OpenMessage.Subject}</Col>
//                             </Row>
//                           </div>
//                         </div>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Col>
//                 <Col lg={6} Align="right">
//                   {
//                     OpenMessage == 0 ? ''
//                       :
//                       <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">

//                         <Button>
//                           <label>{MailNumber} / {AllSentEmailsList.length}</label>
//                         </Button>
//                         {/* <Button onClick={OpenStarPopModel}>
//                           <img src={iconstar} title={"Starred"} />
//                         </Button> */}
//                         <ToggleButton className='startselct' value="check" selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
//                           <StarBorderIcon className='starone' />
//                           <StarIcon className='selectedstart startwo' />
//                         </ToggleButton>
//                         <Button>
//                           <a href="#replaybx" onClick={() => ReplyPopModel(OpenMessage)} className='p-1'><img src={iconsarrow2} className="arrowicon" title={"Reply"} /></a>
//                         </Button>
//                         <Button>
//                           <a href="#replaybx" onClick={() => ForwardPopModel(OpenMessage)} className='p-1'><img src={iconsarrow1} className="arrowicon" title={"Forward"} /></a>
//                         </Button>
//                         {<Button onClick={OpenDeletePopModel}>
//                           <img src={icondelete} title={"Delete"} />
//                         </Button>}
//                         {/* <Button>
//                           <img src={iconmenu} />
//                         </Button> */}
//                       </ButtonGroup>
//                   }
//                 </Col>
//               </Row>
//               <Row className='mb-3'>
//                 <Col>
//                   <h2>{OpenMessage == 0 ? '' : OpenMessage.Subject} </h2>
//                 </Col>
//                 <Col>
//                   <h6>{OpenMessage == 0 ? '' : Moment(OpenMessage.MailSentDatetime).format("LLL")}</h6>
//                 </Col>
//               </Row>
//               <Row>
//                 <Col>
//                   {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
//                 </Col>
//               </Row>

//               <div id="replaybx" className='d-flex mt-5 ml-2'>
//                 {
//                   OpenMessage == 0 ? ''
//                     :
//                     <Row>
//                       <Col sm={6} className='p-0'>
//                         <a onClick={() => ReplyPopModel(OpenMessage)} className='p-2'><img src={iconsarrow2} title={"Reply"} /></a>
//                       </Col>
//                       <Col sm={6} className='p-0'>
//                         <a onClick={() => ForwardPopModel(OpenMessage)} className='p-2'><img src={iconsarrow1} title={"Forward"} /></a>
//                       </Col>
//                     </Row>
//                 }
//               </div>

//               <div className='user_editor d-none my-5'>
//                 <Row className='userlist'>
//                   <Col className='fixwidleft'>
//                     <span className="inboxuserpic">
//                       <img src={inboxuser1} width="63px" alt="" />
//                     </span>
//                   </Col>
//                   <Col className='fixwidright p-0'>
//                     <div className='editorboxcard'>
//                       <Row className='edittoprow p-2'>
//                         <Col className='d-flex hedtopedit'>
//                           <a href='#' className='p-1'><img src={iconsarrow2} /></a>
//                           <h6><KeyboardArrowDownIcon /></h6>
//                           <label id='lblreplytoemail'></label>
//                         </Col>
//                       </Row>


//                       <div className='bodycompose'>
//                         <Row className='pt-2'>
//                           <Col>
//                             <div id='replybody' className='FroalaEditor'>
//                               <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} />
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                     </div>
//                   </Col>
//                 </Row>
//               </div>

//               <div className='user_editor_frwd  d-none my-5'>
//                 <Row className='userlist'>
//                   <Col className='fixwidleft'>
//                     <span className="inboxuserpic">
//                       <img src={inboxuser1} width="63px" alt="" />
//                     </span>
//                   </Col>
//                   <Col className='fixwidright p-0'>
//                     <div className='editorboxcard'>
//                       <Row className='edittoprow p-2'>
//                         <Col className='d-flex hedtopedit'>
//                           <a href='#' className='p-1'><img src={iconsarrow1} /></a>
//                           <h6><KeyboardArrowDownIcon /></h6>
//                           {/* <label id='lblreplytoemailfrwd'></label> */}
//                           {/* <TextareaAutosize className='input-clend' id='To' name='To'  /> */}
//                           <input type='text' className='border-none' placeholder='To' name='to' id='to' />
//                         </Col>
//                       </Row>

//                       <div className='bodycompose'>
//                         <Row className='pt-2'>
//                           <Col>
//                             <div id='replybodyfrwd' className='FroalaEditor'>
//                               <FroalaEditor tag='textarea' id="signature" config={forwardconfig} onModelChange={ForwardHandleModelChange} model={ForwardSignature.Data} />
//                             </div>
//                           </Col>
//                         </Row>
//                       </div>

//                     </div>
//                   </Col>
//                 </Row>
//               </div>

//             </div>
//           </Col>
//         </Row>
//       </div>

//       <AllSentEmailsComposePage GetAllSentEmailsList={GetAllSentEmailsList} />

//     </>
//   );
// }