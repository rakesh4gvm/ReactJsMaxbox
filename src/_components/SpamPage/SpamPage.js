import React, { useState, useEffect } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, IsGreaterDate, EditorVariableNames, ValidateEmail } from "../../_helpers/Utility";
import Navigation from '../Navigation/Navigation';
import SpamComposePage from '../SpamComposePage/SpamComposePage';

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
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Input } from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import StarIcon from '@material-ui/icons/Star';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Box } from '@material-ui/core';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import TablePagination from '@mui/material/TablePagination';

import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import icontimer from '../../images/icon_timer.svg';
import inbox from '../../images/icons/inbox.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import Close from '../../images/icons/w-close.svg';

import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { toast } from "react-toastify";

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

export default function SpamPage(props) {

  const [SpamPage, SetSpamList] = useState([])
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SortField, SetsortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
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
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [TotalCount, SetTotalCount] = useState(0)
  const [IsBottom, SetIsBottom] = useState(false)
  const [PageValue, SetPageValue] = React.useState(1)

  const HandleScroll = (e) => {
    const target = e.target
    if (target.scrollHeight - target.scrollTop === target.clientHeight && SpamPage?.length < TotalCount) {
      SetPage(Page + 1)
      SetIsBottom(true)
    }
  }

  useEffect(() => {
    if (IsBottom) {
      GetSpamList(ClientID, UserID, Page, 0);
      SetIsBottom(false)
    }
  }, [IsBottom])


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);



  useEffect(() => {
    document.title = 'Spam | MAXBOX';
    GetClientID();
  }, [])

  // Starts Get Client ID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    if (props !== undefined) {
      const ID = props.location.state;
      if (ID != "" && ID != null && ID != "undefined") {
        GetSpamList(UserDetails.ClientID, UserDetails.UserID, Page, ID);
      }
      else {
        GetSpamList(UserDetails.ClientID, UserDetails.UserID, Page, 0)
      }
    }
  }
  // End Get Client ID

  // Start Get Follow Up Later List
  const GetSpamList = (CID, UID, PN, ID) => {
    let AccountIDs = []
    if (ID.length > 0) {
      AccountIDs.push(ID)
    } else {
      AccountIDs = [-1]
    }
    LoaderShow()
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
      url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetSpamList(Result.data.PageData)
          SetTotalCount(Result.data.TotalCount)
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          SetPageValue(PN)
          SetTotalRecord(Result.data.TotalCount);
          LoaderHide()
        } else {
          SetSpamList([])
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
  const OpenMessageDetails = (ID, index) => {
    if (ID != '') {
      SetMailNumber(index + 1)
      LoaderShow()
      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
            LoaderHide()
          } else {
            SetSpamList([])
            SetOpenMessageDetails([]);
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

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(10);
      SetSpamList([])
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
  const UpdateStarMessage = (ID) => {
    if (ID != '') {
      var Data = {
        _id: ID,
        IsStarred: true,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Starred  updated successfully.</div>);
          CloseStarPopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              GetSpamList(ClientID, UserID, Page, ID);
            }
            else {
              GetSpamList(ClientID, UserID, Page, 0)
            }
          }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Update Star Message and model open and close

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
            IsOtherInbox: false,
            LastUpdatedBy: -1
          };
          const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/spamemailhistory/FollowupUpdate",
            method: "POST",
            data: Data,
          });
          ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
              toast.success(<div>Follow up later updated successfully.</div>);
              CloseFollowupPopModel();
              OpenMessageDetails('')
              LoaderShow()
              if (props !== undefined) {
                const ID = props.location.state;
                if (ID != "" && ID != null && ID != "undefined") {
                  GetSpamList(ClientID, UserID, Page, ID);
                }
                else {
                  GetSpamList(ClientID, UserID, Page, 0)
                }
              }
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
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryUpdate",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Other inbox updated successfully.</div>);
          CloseOtherInboxPopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              GetSpamList(ClientID, UserID, Page, ID);
            }
            else {
              GetSpamList(ClientID, UserID, Page, 0)
            }
          }
        }
        else {
          CloseOtherInboxPopModel();
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Other inbox  Message and model open and close

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
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Spam mail deleted successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          if (props !== undefined) {
            const ID = props.location.state;
            if (ID != "" && ID != null && ID != "undefined") {
              if (SpamPage.length - 1 == 0) {
                GetSpamList(ClientID, UserID, 1, ID);
              } else {
                GetSpamList(ClientID, UserID, Page, ID);
              }
            }
            else {
              if (SpamPage.length - 1 == 0) {
                GetSpamList(ClientID, UserID, 1, 0)
              } else {
                GetSpamList(ClientID, UserID, Page, 0)
              }
            }
          }
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  const HandleChange = (panel) => (event, isExpanded) => {
    console.log(panel);
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

  // start replay code
  // Open Compose
  const OpenComposeReply = (e) => {

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetReplyMessageDetails",
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
    var ToEmail = OpenMessage.FromEmail;
    var ToName = OpenMessage.FromName
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = Signature?.Data
    LoaderShow()
    var Data = {
      ToEmail: ToEmail,
      ToName: ToName,
      ID: ID,
      Subject: Subject,
      Body: Body
    };
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/SentReplyMessage",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
        toast.success(<div>Reply mail sent successfully.</div>);
        OpenComposeReply();
        CloseComposeReply()
        LoaderHide()
      } else {
        CloseComposeReply()
        toast.error(Result?.data?.Message);
        LoaderHide()
      }
    })
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
          debugger
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
    toolbarButtons: [['SendReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions'], ['DeleteReply']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
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

    const Data = {
      ID: OpenMessage?._id,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/receive_email_history/GetForwardMssageDetails",
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

  // Forward Send Mail Starts
  const ForwardSendMail = () => {
    var ToEmail = document.getElementById("ToForward").value;
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = ForwardSignature.Data

    const IsEmailValid = ValidateEmail(ToEmail)

    if (Body == "") {
      toast.error("Please Enter Body");
    } else if (ToEmail == "") {
      toast.error("Please Enter Email")
    }

    else {
      if (IsEmailValid) {
        LoaderShow()
        var Data = {
          ToEmail: ToEmail,
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
      } else {
        toast.error("Please Enter Valid Email");
      }
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
    toolbarButtons: [['ForwardReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['DeleteForward']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
    fileUploadURL: CommonConstants.MOL_APIURL + "/client/upload_file",
    imageUploadRemoteUrls: false,
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

    if (props !== undefined) {
      const ID = props.location.state;
      if (ID != "" && ID != null && ID != "undefined") {
        GetSpamList(ClientID, UserID, pn, ID);
      } else {
        GetSpamList(ClientID, UserID, pn, 0)
      }
    }
  };
  // Ends Pagination

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
            <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { UpdateStarMessage(OpenMessage._id); }}>
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
              Ok
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
              Are you sure ?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure  for move this E-mail into Other Inbox ?
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
        <Navigation />
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
          <SplitPane
            split="horizontal "
            minSize={150}
            maxSize={-200}
            defaultSize={"40%"}
          >
            <>
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
              <div className="simulationDiv" >
                <Table className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
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
                    {SpamPage.map((item, index) => (
                      <TableRow className="SelectionSubject"
                        key={item.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        onClick={() => OpenMessageDetails(item._id, index)}
                      >
                        <TableCell width={'35px'}>
                          <ToggleButton title="Starred" className='startselct' value="check" selected={item.IsStarred} onClick={() => UpdateStarMessage(item._id)} >
                            <StarBorderIcon className='starone' />
                            <StarIcon className='selectedstart startwo' />
                          </ToggleButton>
                        </TableCell>
                        {/* <TableCell width={'35px'}></TableCell> */}
                        <TableCell scope="row"> {item.Subject} </TableCell>
                        <TableCell>{item.FromEmail}</TableCell>
                        <TableCell>{Moment(item.MessageDatetime).format("DD/MM/YYYY")}</TableCell>
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
                      <lable>{OpenMessage == 0 ? '' : Moment(OpenMessage.MessageDatetime).format("LLL")}</lable>
                    </div>
                    {
                      OpenMessage == 0 ? '' :
                        <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                          <Button>
                            <label>{MailNumber} / {SpamPage.length}</label>
                          </Button>
                          <Button>
                            <ToggleButton className='startselct' value="check" title={"Starred"} selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Button>
                          <Button onClick={OpenFollowupPopModel} title={"Follow Up Later"}>
                            <img src={icontimer} />
                          </Button>
                          <Button onClick={OpenOtherInboxPopModel}>
                            <img src={inbox} title={"Other Inbox"} />
                          </Button>
                          <Button>
                            <a><img src={iconsarrow2} title={"Reply"} onClick={OpenComposeReply} /></a>
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

              <div className='emailbodybox'>
                {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
              </div>
            </div>
          </SplitPane>
        </div>
      </div>
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
                <Input className='input-clend' id='To' name='To' value={OpenMessage?.FromEmail} disabled />
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
                <Input className='input-clend' id='ToForward' name='ToForward' />
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
      <SpamComposePage GetSpamList={GetSpamList} />
    </>
  );
}













