import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import MaxboxLoading from '../../images/Maxbox-Loading.svg';
import TablePagination from '@mui/material/TablePagination';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames, ValidateEmail, decrypt } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import DraftComposePage from '../DraftComposePage/DraftComposePage';
import AddDraftPage from "../AddDraftPage/AddDraftPage"
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Input } from '@mui/material';

import icondelete from '../../images/icon_delete.svg';
import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import Plusion from '../../images/icons/composeion.svg';
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
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Emailinbox from '../../images/email_inbox_img.png';
import { Box } from '@material-ui/core';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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

function useOutsideAlerter(ref) {
}

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
  const [DraftList, SetDraftList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(50);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MailTo");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [TotalCount, SetTotalCount] = useState(0)
  const [IsBottom, SetIsBottom] = useState(false)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [temopen, setTemOpen] = React.useState(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [ClientData, SetClientData] = useState()
  const [TemplateID, SetTemplateID] = React.useState("");
  const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
  const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
  const [TotalRecord, SetTotalRecord] = React.useState(0);
  const [PageValue, SetPageValue] = React.useState(1)
  const [Active, SetActive] = useState("");
  const [ClientSignatureData, SetClientSignatureData] = React.useState("");
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [MailChange, SetMailChange] = useState({
    To: "",
    Subject: ""
  })
  const [ToEmailValue, SetToEmailValue] = React.useState([]);
  const [CCEmailValue, SetCCEmailValue] = React.useState([]);
  const [BCCEmailValue, SetBCCEmailValue] = React.useState([]);
  const [NewTemplateID, SetNewTemplateID] = useState([])
  const [NewObjectionID, SetNewObjectionID] = useState([])

  const HandleScroll = (e) => {
    const target = e.target
    if (target.scrollHeight - target.scrollTop === target.clientHeight && DraftList?.length < TotalCount) {
      SetPage(Page + 1)
      SetIsBottom(true)
    }
  }

  useEffect(() => {
    if (IsBottom) {
      GetDraftList(ClientID, UserID, Page, "scroll");
      SetIsBottom(false)
    }
  }, [IsBottom])

  const ContainerRef = useRef(null)

  // Selected Email Account User
  const SelectEmailAccountUser = (e) => {
    SetSelectedEmailAccountUser(e.target.value)
    const str = "<br>"
    if (ClientSignatureData == "") {
      SetClientSignatureData(ClientData)
      SetSignature({ Data: Signature.Data + str + ClientData })
    } else {
      Signature.Data = Signature.Data.replace(ClientSignatureData, ClientData)
      SetSignature({ Data: Signature.Data })
    }
  }

  useEffect(() => {
    document.title = 'Drafts | MAXBOX';
    GetClientID();
  }, [SearchInbox])

  // Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    if (props !== undefined) {
      const ID = props.location.state;
      if (ID != "" && ID != null && ID != "undefined") {
        GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page, "");
      } else {
        GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page, "")
      }
    }
    GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
    GetClientList(UserDetails.ClientID, UserDetails.UserID)
  }

  // Start Get Draft List
  const GetDraftList = (CID, UID, PN, str) => {
    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
    };
    LoaderShow()
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetDraftList(Result.data.PageData)
          SetTotalCount(Result.data.TotalCount)
          OpenMessageDetails(Result.data.PageData[0]._id, false);
          SetMailNumber(1)
          SetTotalRecord(Result.data.TotalCount);
          SetPageValue(PN)
          LoaderHide()
        } else {
          SetDraftList([]);
          SetOpenMessageDetails([]);
          SetTotalRecord(0);
          SetPageValue(0)
          LoaderHide()
        }
      }
    });
  };
  // End Get Draft List

  const HandleMailChange = (e) => {
    SetMailChange({ [e.target.name]: e.target.value })
  }

  //Start Open Message Details
  const OpenMessageDetails = (ID, index, IsComposeData) => {
    if (ID != "") {
      SetMailNumber(index + 1)
      var Data = {
        _id: ID,
      };
      LoaderShow()
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data != "" && Result.data.Data != null && Result.data.Data != undefined) {
            SetOpenMessageDetails(Result?.data?.Data);
            SetActive(ID);
            if (IsComposeData) {
              OpenCompose(Result.data.Data)
            }
            LoaderHide()
          } else {
            SetDraftList([])
            SetOpenMessageDetails([]);
            SetActive("");
            LoaderHide()
          }
        }
        else {
          SetOpenMessageDetails('');
          LoaderHide()
        }
      });
    }
  }
  //End Open Message Details



  // Open Compose
  const OpenCompose = (Data) => {
    if (ClientID == "" || ClientID == undefined || ClientID == null) {
      toast.error("Please add client.");
    }
    else {
      const el = document.getElementById("DraftCompose")
      el.classList.remove("show");
      if (EmailAccountUsers.length > 0) {
        SetSelectedEmailAccountUser(EmailAccountUsers[0]?._id);
        SetSignature({ Data: ClientData + Data.Body })
        SetClientSignatureData(ClientData)
      } else {
        SetSelectedEmailAccountUser(0);
      }
      SetNewObjectionID([])
      SetNewTemplateID([])
      SetToEmailValue([])
      SetCCEmailValue([])
      SetBCCEmailValue([])
      document.getElementById("ComposeTo").value = ""
      document.getElementById("ComposeSubject").value = ""
      document.getElementById("ComposeCC").value = ""
      document.getElementById("ComposeBCC").value = ""
      if (Data?._id?.length > 0) {
        SetSignature({ Data: "<br/>" + ClientData + Data.Body })
        SetToEmailValue([Data?.MailTo])
        document.getElementById("ComposeSubject").value = Data.Subject
        // SetMailChange({ To: "", Subject: "" })
      } else {
        SetSignature({ Data: "<br/>" + ClientData });
        SetMailChange({ To: "", Subject: "" })
      }


      const element = document.getElementById("UserCompose")

      if (element.classList.contains("show")) {
        element.classList.remove("show");
      }
      else {
        element.classList.add("show");
      }
    }
  };

  // Close Compose
  const CloseCompose = () => {
    const element = document.getElementById("UserCompose")
    element.classList.remove("show");
  }

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(50);
      SetDraftList([])
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
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Draft template deleted successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (DraftList.length - 1 == 0) {
            GetDraftList(ClientID, UserID, 1, "");
          } else {
            GetDraftList(ClientID, UserID, Page, "");
          }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Sent Mail Starts
  const ComposeSentDataMail = async () => {
    LoaderShow()

    let EmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var EmailResponse = ToEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var CCResponse = CCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));
    var BCCResponse = BCCEmailValue.filter(e => e && e.toLowerCase().match(EmailRegex));

    var Subject = document.getElementById("ComposeSubject").value;

    var CCEmail = true
    var BCCEmail = true

    if (EmailResponse == "" || Subject == "" || Signature.Data == "" || SelectedUser == undefined) {
      toast.error("All fields are mandatory!");
    } else if (!CCEmail) {
      toast.error("Please enter valid CC email");
    }
    else if (!BCCEmail) {
      toast.error("Please enter valid BCC email");
    }
    else {
      LoaderShow()
      const Data = {
        AccountID: SelectedUser?.AccountID,
        ToEmail: EmailResponse.toString(),
        Subject: Subject,
        SignatureText: Signature.Data,
        CC: CCResponse.toString(),
        BCC: BCCResponse.toString(),
        FromEmail: SelectedUser.Email,
        RefreshToken: SelectedUser.RefreshToken,
        FirstName: SelectedUser.FirstName,
        LastName: SelectedUser.LastName,
        UserID: UserID,
        ClientID: ClientID,
        IsUnansweredResponsesMail: false,
        IsStarredMail: false,
        IsFollowUpLaterMail: false,
        IsSpamMail: false,
        IsDraftMail: true,
        IsAllSentEmails: false,
        CreatedBy: 1,
        TemplateID: NewTemplateID,
        ObjectIDTemplateID: NewObjectionID
      }
      await Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
          toast.success(<div>Mail send successfully.</div>);
          CloseCompose()
          LoaderHide()
          GetDraftList(ClientID, UserID, Page, "")
          document.getElementById("ComposeTo").value = ""
          document.getElementById("ComposeSubject").value = ""
          document.getElementById("ComposeCC").value = ""
          document.getElementById("ComposeBCC").value = ""
        } else {
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      })
    }
    LoaderHide()
  }
  // Sent Mail Ends

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



  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const SelectTemplate = () => {
    var GetByClass = document.getElementsByClassName('active');
    LoaderShow()
    if (GetByClass.length > 0) {
      SetNewTemplateID([...NewTemplateID, document.getElementsByClassName('active')[0].id])
      var TemplateID = document.getElementsByClassName('active')[0].id;
      var DivData = TemplateData.find(data => data.TemplatesID === TemplateID);
      var BodyData = Signature.Data;
      document.getElementById("ComposeSubject").value = DivData.Subject;
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
      // document.getElementById("ComposeSubject").value = DivData.Subject;
      // var NewData = "";
      // if (body != "" && chckEmptyBody != "") {
      //   NewData = body + DivData.BodyText + ClientData;
      //   SetTemplateID(TemplateID)
      // } else {
      //   NewData = DivData.BodyText + BodyData;
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
      document.getElementById("ComposeSubject").value = DivData.Subject;
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
      // document.getElementById("ComposeSubject").value = DivData.Subject;
      // var NewData = "";
      // if (body != "" && chckEmptyBody != "") {
      //   NewData = body + DivData.BodyText + ClientData;
      //   SetObjectIDTemplateID(ObjectionTemplateID)
      // } else {
      //   NewData = DivData.BodyText + BodyData;
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

  // Get All Email Account Users
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
        SetEmailAccountUsers(Result.data.PageData)
      } else {
        toast.error(Result?.data?.Message);
      }
    })
  }
  // Selected User
  const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

  // Frola Editor Starts
  Froalaeditor.RegisterCommand('Send', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: ComposeSentDataMail
  });
  Froalaeditor.RegisterCommand('Delete', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
    callback: function (cmd, val) {
      CloseCompose()
    },
  });
  Froalaeditor.RegisterCommand('Sendoption', {
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
  Froalaeditor.RegisterCommand('TemplatesOption', {
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
    placeholderText: 'Edit your content here!',
    charCounterCount: false,
    toolbarButtons: [['Send', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOption'], ['Delete']],
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

  /* start navcode */
  const mincomposeon = () => {
    const element = document.getElementById("maxcompose")
    if (element.classList.contains("minmusbox")) {
      element.classList.remove("minmusbox");
    }
    else {
      element.classList.add("minmusbox");
      element.classList.remove("largebox");
    }
  }

  const maxcomposeon = () => {
    const element = document.getElementById("maxcompose")
    if (element.classList.contains("largebox")) {
      element.classList.remove("largebox");
    }
    else {
      element.classList.add("largebox");
      element.classList.remove("minmusbox");
    }
  }
  /* end code*/

  const WrapperRef = useRef(null);
  useOutsideAlerter(WrapperRef);

  const [Ccflag, SetCcflag] = useState(false);
  const [Bccflag, SetBccflag] = useState(false);

  // Open CC
  const OpenCc = () => {
    if (Ccflag == false) {
      document.getElementById("FlagCC").style.display = 'block'
      SetCcflag(true);
    }
    else {
      document.getElementById("FlagCC").style.display = 'none'
      SetCcflag(false);
    }
  };

  // Open BCC
  const OpenBcc = () => {
    if (Bccflag == false) {
      document.getElementById("FlagBCC").style.display = 'block'
      SetBccflag(true);
    }
    else {
      document.getElementById("FlagBCC").style.display = 'none'
      SetBccflag(false);
    }
  };


  const HandleChangePage = (
    event,
    newPage,
  ) => {

    ContainerRef.current.scrollTop = 0;
    SetPage(newPage + 1);

    var pn = newPage + 1;

    if (props !== undefined) {
      const ID = props.location.state;
      if (ID != "" && ID != null && ID != "undefined") {
        GetDraftList(ClientID, UserID, pn, "");
      } else {
        GetDraftList(ClientID, UserID, pn, "")
      }
    }
  };

  const RefreshTable = () => {
    ContainerRef.current.scrollTop = 0;
    var ID = decrypt(props.location.search.replace('?', ''))

    if (ID != "" && ID != null && ID != "undefined") {
      GetDraftList(ClientID, UserID, 1, ID);
    }
    else {
      GetDraftList(ClientID, UserID, 1, 0)
    }
  }

  return (

    <>
      <div id="hideloding" className="loding-display">
        <img src={MaxboxLoading} />
      </div>

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
        {/* <Navigation menupage="/Drafts" MenuID="" /> */}
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
              <div className="simulationDiv" ref={ContainerRef} >
                <Table className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell component="th" width={'30px'}><StarBorderIcon /></TableCell> */}
                      {/* <TableCell component="th" width={'30px'}><AttachFileIcon /></TableCell> */}
                      <TableCell component="th">Subject</TableCell>
                      <TableCell component="th">To Email</TableCell>
                      <TableCell component="th">Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DraftList.map((item, index) => (
                      <TableRow
                        className={`${Active === item._id ? "selected-row" : ""}`}
                        key={item.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        onClick={() => OpenMessageDetails(item._id, index, true)}
                      >
                        {/* <TableCell width={'35px'}><StarBorderIcon /></TableCell> */}
                        {/* <TableCell width={'35px'}></TableCell> */}
                        <TableCell scope="row"> {item.Subject} </TableCell>
                        <TableCell>{item.MailTo}</TableCell>
                        <TableCell>{Moment(item.CreatedDate).format("MM/DD/YYYY hh:mm a")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
            <div className="statisticsDiv">
              <div className='composehead px-3'>
                <Row>
                  <Col sm={6}>
                    {
                      OpenMessage == 0 ? "" :
                        <div className='lablebox'>
                          <label><b>To : </b>{OpenMessage.MailTo}</label>
                          <label><b>Subject : </b>{OpenMessage.Subject}</label>
                        </div>
                    }
                  </Col>
                  <Col sm={6}>
                    <div className='lablebox text-right'>
                      <label>{OpenMessage == 0 ? '' : Moment(OpenMessage.CreatedDate).format("MM/DD/YYYY hh:mm A")}</label>
                    </div>
                    {
                      OpenMessage == 0 ? "" :
                        <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                          <Button>
                            <label>{MailNumber} / {DraftList.length}</label>
                          </Button>
                          {<Button onClick={OpenDeletePopModel}>
                            <img src={icondelete} title={"Delete"} />
                          </Button>}
                        </ButtonGroup>
                    }
                  </Col>
                </Row>
              </div>
              <div className='emailbodybox'>
                {OpenMessage == 0 ? '' : parse(OpenMessage.Body)}
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
      {/* <DraftComposePage GetDraftList={GetDraftList} /> */}
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
                  <Accordion className='activetemplate' expanded={expanded === row.ObjectionTemplateID} onChange={handleChange(row.ObjectionTemplateID)}>
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
                  <Accordion className='activetemplate' expanded={expanded === row.TemplatesID} onChange={handleChange(row.TemplatesID)}>
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

      <div className='composebody' id='maxcompose'>
        <Button variant="contained btn btn-primary largbtn" onClick={() => OpenCompose("")}><img src={Plusion} /></Button>
        <div className="usercompose userdefual" id="UserCompose" ref={WrapperRef}>
          <div className='hcompose px-3'>
            <Row>
              <Col><h4>New Message</h4></Col>
              <Col className='col text-right'>
                <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                  <Button onClick={mincomposeon} className="minicon">
                    <img src={Minimize} />
                  </Button>
                  <Button onClick={maxcomposeon} className="maxicon">
                    <img src={Maximize} />
                  </Button>
                  <Button onClick={() => OpenCompose(OpenMessage)}>
                    <img src={Close} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3 py-1'>
            <Row className='px-3'>
              <Col xs={2} className="px-0">
                <h6>Email Account :</h6>
              </Col>
              <Col xs={8} className="px-1">
                <div className='comse-select'>
                  <Select
                    value={SelectedEmailAccountUser}
                    onChange={SelectEmailAccountUser}
                  >
                    {
                      EmailAccountUsers.map((row) => (
                        <MenuItem value={row?.AccountID}>{row?.Email}</MenuItem>
                      ))
                    }
                  </Select>
                </div>
              </Col>
            </Row>
          </div>
          <div className='subcompose px-3'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>To :</h6>
              </Col>
              <Col xs={8} className="px-0">
                {/* <Input className='input-clend' id='ComposeTo' name='To' value={MailChange.To} onChange={HandleMailChange} /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="ComposeTo"
                    value={ToEmailValue}
                    options={top100Films.map((option) => option.title)}
                    onChange={(event, newValue) => {
                      SetToEmailValue(newValue);
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
              <Col xs={3} className='col text-right d-flex px-0'>
                <Button className='lable-btn btnclean' onClick={OpenCc}>Cc</Button>
                <Button className='lable-btn btnclean' onClick={OpenBcc}>Bcc</Button>
              </Col>
            </Row>
          </div>
          <div className='subcompose cc px-3' id='FlagCC'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Cc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='ComposeCC' name='Cc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="ComposeCC"
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
          <div className='subcompose bcc px-3' id='FlagBCC'>
            <Row className='px-3'>
              <Col xs={1} className="px-0">
                <h6>Bcc :</h6>
              </Col>
              <Col xs={11} className="px-0">
                {/* <Input className='input-clend' id='ComposeBCC' name='Bcc' /> */}
                <div className='multibox-filter'>
                  <Autocomplete
                    multiple
                    id="ComposeBCC"
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
          <div className='subcompose px-3'>
            <Row className='px-3'>
              <Col xs={2} className="px-0">
                <h6>Subject :</h6>
              </Col>
              <Col xs={10} className="px-0">
                <Input className='input-clend' id='ComposeSubject' name='Subject' onChange={HandleMailChange} />
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
      <AddDraftPage GetDraftList={GetDraftList} />
    </>
  );
}

























