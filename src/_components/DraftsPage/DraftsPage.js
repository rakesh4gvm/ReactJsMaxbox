import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";
import Moment from "moment";

import { styled, alpha } from '@mui/material/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import DraftComposePage from "../DraftComposePage/DraftComposePage"
import AddDraftPage from "../AddDraftPage/AddDraftPage"

import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import Iconsedit from '../../images/icons/icons-edit.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import { Col, Row } from 'react-bootstrap';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import parse from "html-react-parser";
import { GetUserDetails, LoaderShow, ValidateEmail, LoaderHide } from "../../_helpers/Utility";
import defaultimage from '../../images/default.png';
import InfiniteScroll from "react-infinite-scroll-component";
import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Tooltip from "@material-ui/core/Tooltip";
import timermenu from '../../images/icons/timermenu.svg';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { EditorVariableNames } from "../../_helpers/Utility";
import { Input, MenuItem, Select } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MaxboxLoading from '../../images/Maxbox-Loading.gif';

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

function UseOutSideAlerter(Ref) {
  useEffect(() => {
    function HandleClickOutside(Event) {
      if (Ref.current && !Ref.current.contains(Event.target)) {
        const Element = document.getElementById("Userdropshow")
        Element.classList.remove("show");
      }
    }
    document.addEventListener("mousedown", HandleClickOutside);
    return () => {
      document.removeEventListener("mousedown", HandleClickOutside);
    };
  }, [Ref]);
}

export default function DraftsPage() {
  const [DraftList, SetDraftList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MailTo");
  const [SortedBy, SetSortedBy] = React.useState(1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [InboxChecked, SetInboxChecked] = React.useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [ResponseData, SetResponseData] = useState([])
  const [TotalCount, SetTotalCount] = React.useState(0);
  const [HasMore, SetHasMore] = useState(true)
  const [expanded, setExpanded] = React.useState(false);
  const [ObjectData, SetAllObjectData] = useState([])
  const [TemplateData, SetAllTemplateData] = useState([])
  const [open, setOpen] = React.useState(false);
  const [temopen, setTemOpen] = React.useState(false);
  const [SelectedEmailAccountUser, SetSelectedEmailAccountUser] = useState([])
  const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
  const [Ccflag, SetCcflag] = useState(false);
  const [Bccflag, SetBccflag] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTemOpen = () => setTemOpen(true);
  const handleTemClose = () => setTemOpen(false);
  const [Signature, SetSignature] = useState({
    Data: "",
  })
  const [MailChange, SetMailChange] = useState({
    To: "",
    Subject: ""
  })

  const HandleMailChange = (e) => {
    SetMailChange({ [e.target.name]: e.target.value })
  }

  const handleChange = (panel) => (event, isExpanded) => {
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
      // var NewData = BodyData + '</br>' + DivData.BodyText;
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

  // Open CC
  const OpenCc = () => {
    if (Ccflag == false) {
      document.getElementById("Cc").style.display = 'block'
      SetCcflag(true);
    }
    else {
      document.getElementById("Cc").style.display = 'none'
      SetCcflag(false);
    }
  };

  // Open BCC
  const OpenBcc = () => {
    if (Bccflag == false) {
      document.getElementById("Bcc").style.display = 'block'
      SetBccflag(true);
    }
    else {
      document.getElementById("Bcc").style.display = 'none'
      SetBccflag(false);
    }
  };

  const SelectEmailAccountUser = (e) => {
    SetSelectedEmailAccountUser(e.target.value)
  }

  useEffect(() => {
    document.title = 'Draft | MAXBOX';
    GetClientID();
  }, [SearchInbox]);

  // Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetDraftList(UserDetails.ClientID, UserDetails.UserID, Page, "");
    GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
    // if (ResponseData.length <= 10) {
    //   SetHasMore(false)
    // }
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

  const SelectedUser = EmailAccountUsers.find(o => o.AccountID === SelectedEmailAccountUser)

  const SetHasMoreData = (arr) => {
    if (arr.length === 0) {
      SetHasMore(false)
    } else if (arr.length <= 9) {
      SetHasMore(false)
    } else if (arr.length === 10) {
      SetHasMore(true)
    }
  }

  // Start Get Draft List
  const GetDraftList = (CID, UID, PN, Str) => {

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
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetResponseData(Result.data.PageData)
          SetHasMoreData(Result.data.PageData)
          // SetDraftList([...DraftList, ...Result.data.PageData]);
          if (Str === "scroll") {
            SetDraftList([...DraftList, ...Result.data.PageData]);
          } else {
            SetDraftList(Result.data.PageData);
          }
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        }
        else {
          SetResponseData([])
          SetHasMoreData(Result.data.PageData)
          if (DraftList && DraftList?.length > 1) {
            SetDraftList([...DraftList]);
            let LastElement = DraftList?.slice(-1)
            OpenMessageDetails(LastElement[0]?._id, 0);
          } else {
            OpenMessageDetails('');
            SetDraftList([]);
          }
          LoaderHide()
          if (OpenMessage == "") {
            toast.error(<div>Drafts <br />No Data.</div>)
          }
        }
        GetTotalRecordCount(CID, UID);
      }
      else {
        SetDraftList([]);
        OpenMessageDetails('');
        toast.error(Result?.data?.Message);
      }
    });
  };
  // End Get Draft List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {

    // if (ID != '') {
    //   SetMailNumber(index + 1)
    // }

    if (ID != "") {

      SetMailNumber(index + 1)

      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data != "" && Result.data.Data != null && Result.data.Data != undefined) {
            SetOpenMessageDetails(Result.data.Data);
            SetSignature({ Data: Result.data.Data.Body })
            SetMailChange({ To: Result.data.Data.MailTo, Subject: Result.data.Data.Subject })
          } else {
            SetDraftList([])
            SetOpenMessageDetails([]);
          }
        }
        else {
          SetOpenMessageDetails('');
          toast.error(Result?.data?.Message);
        }
      });
    }

  }
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
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Draft <br />Draft template deleted successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetDraftList(ClientID, UserID, Page, "");
          SetMailChange({ To: "", Subject: "" })
          SetSignature({ Data: "" })
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Start Delete All Message 
  const OpenAllDeletePopModel = () => {
    if (InboxChecked.length > 0) {
      SetAllDeletePopModel(true);
    } else {
      toast.error("Please select atleast one email.")
    }
  }

  const CloseAllDeletePopModel = () => {
    SetAllDeletePopModel(false);
  }
  const DeleteAllMessage = () => {
    if (InboxChecked.length > 0) {
      var Data = {
        IDs: InboxChecked,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/draft_template/DraftTemplateDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Draft <br />Draft template deleted successfully.</div>);
          CloseAllDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetDraftList(ClientID, UserID, Page, "");
          SetMailChange({ To: "", Subject: "" })
          SetSelectAllCheckbox(false);
          SetInboxChecked([]);
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Delete All Message 

  // Start CheckBox Code
  const InBoxCheckBox = (e) => {
    var UpdatedList = [...InboxChecked];
    if (e.target.checked) {
      UpdatedList = [...InboxChecked, e.target.value];
    } else {
      UpdatedList.splice(InboxChecked.indexOf(e.target.value), 1);
    }
    SetInboxChecked(UpdatedList);
  }
  const SeleactAllInBoxCheckBox = (e) => {
    if (e.target.checked) {
      SetSelectAllCheckbox(true);
      SetInboxChecked(DraftList.map(item => item._id));
    } else {
      SetSelectAllCheckbox(false);
      SetInboxChecked([]);
    }
  }
  // End CheckBox Code

  // Start Search
  const SearchBox = (e) => {
    if (e.keyCode == 13) {
      SetPage(1);
      SetRowsPerPage(10);
      SetDraftList([])
      SetSearchInbox(e.target.value)
    }
  }
  // End Search

  // Refresh Page
  const RefreshPage = () => {
    LoaderShow()
    SetPage(1);
    SetRowsPerPage(10);
    // SetDraftList([])
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    SetInboxChecked([]);
    GetDraftList(ClientID, UserID, Page, "");
  }

  // Get Total Total Record Count
  const GetTotalRecordCount = (CID, UID) => {

    const Data = {
      ClientID: CID,
      UserID: UID
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/draft_template/TotalRecordCount",
      method: "POST",
      data: Data,
    }).then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

        if (Result.data.TotalCount >= 0) {
          SetTotalCount(Result.data.TotalCount);
        } else {
          SetTotalCount(0);
          toast.error(Result?.data?.Message);
        }

      }
    })
  }

  /* start navcode */
  const NavBarClick = () => {
    const element = document.getElementById("navclose")
    if (element.classList.contains("opennav")) {
      element.classList.remove("opennav");
    }
    else {
      element.classList.add("opennav");
    }
  }
  /* end code*/

  /* start navcode */

  const Userdropdown = () => {
    const element = document.getElementById("Userdropshow")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  }
  function UseOutsideAlerter(Ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (Ref.current && !Ref.current.contains(event.target)) {
          const element = document.getElementById("Userdropshow")
          element.classList.remove("show");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [Ref]);
  }
  /* end code*/

  // Fetch More Data
  const FetchMoreData = async () => {
    SetPage(Page + 1);
    await GetDraftList(ClientID, UserID, Page + 1, "scroll")

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
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

  const Item = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  }));

  // Open Compose
  const OpenCompose = (e) => {

    const el = document.getElementById("DraftCompose")
    el.classList.remove("show");

    SetSelectedEmailAccountUser(0);
    SetSignature({ Data: "" });
    document.getElementById("To").value = ""
    document.getElementById("Subject").value = ""
    document.getElementById("CC").value = ""
    document.getElementById("BCC").value = ""


    const element = document.getElementById("UserCompose")

    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    else {
      element.classList.add("show");
    }
  };

  // Close Compose
  const CloseCompose = () => {
    const element = document.getElementById("UserCompose")
    element.classList.remove("show");
  }

  // Sent Mail Starts
  const SentMail = async () => {

    var ToEmail = document.getElementById("To").value;
    var Subject = document.getElementById("Subject").value;
    var CC = document.getElementById("CC").value;
    var BCC = document.getElementById("BCC").value;


    const ValidToEmail = ValidateEmail(ToEmail)

    var CCEmail = true
    var BCCEmail = true

    if (CC != "") {
      CCEmail = ValidateEmail(CC)
    }
    if (BCC != "") {
      BCCEmail = ValidateEmail(BCC)
    }

    if (ToEmail == "" || Subject == "" || Signature.Data == "" || SelectedUser == undefined) {
      toast.error("All Fields are Mandatory!");
    } else if (!ValidToEmail) {
      toast.error("Please enter valid email");
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
        ToEmail: ToEmail,
        Subject: Subject,
        SignatureText: Signature.Data,
        CC: CC,
        BCC: BCC,
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
        IsUansweredReplies: false,
        CreatedBy: 1
      }
      Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/SentMail",
        method: "POST",
        data: Data,
      }).then((Result) => {
        if (Result.data.StatusMessage === ResponseMessage.SUCCESS) {
          toast.success(<div>Draft<br />Mail send successfully.</div>)
          OpenCompose();
          CloseCompose()
          LoaderHide()
          GetDraftList(ClientID, UserID, Page, "");
          // document.getElementById("To").value = ""
          // document.getElementById("Subject").value = ""
          // document.getElementById("CC").value = ""
          // document.getElementById("BCC").value = ""
        } else {
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      })
    }
  }
  // Sent Mail Ends

  // Frola Editor Starts
  Froalaeditor.RegisterCommand('SendDraft', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: SentMail
  });
  Froalaeditor.RegisterCommand('Delete', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
    callback: function (cmd, val) {
      CloseCompose();
      const element = document.getElementById("DraftCompose")
      element.classList.remove("show");
    }
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
  Froalaeditor.RegisterCommand('Deletes', {
    callback: function () {
      if (TotalCount >= 1) {
        SetDeletePopModel(true)
      } else {
        toast.error("No data to delete.")
      }
    }
  });
  const config = {
    quickInsertEnabled: false,
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [['SendDraft', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions'], ['Deletes', 'moreMisc']],
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

  const WrapperRef = useRef(null);
  UseOutSideAlerter(WrapperRef);

  return (
    <>
      <div>


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

        <Modal className="modal-pre"
          open={AllDeletePopModel}
          onClose={CloseAllDeletePopModel}
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
                you want to delete selected email ?
              </Typography>
            </div>
            <div className='d-flex btn-50'>
              <Button className='btn btn-pre' variant="contained" size="medium" onClick={() => { DeleteAllMessage(); }}>
                Yes
              </Button>
              <Button className='btn btn-darkpre' variant="contained" size="medium" onClick={() => { CloseAllDeletePopModel(); }}>
                No
              </Button>
            </div>
          </Box>
        </Modal>


      </div>

      <div className='bodymain'>
        <Row className='mb-columfull'>
          <Col className='maxcontainerix' id="navclose">
            <div className='closeopennav'>
              <a className='navicons m-4' onClick={(NavBarClick)}><ArrowRight /></a>
              <Tooltip title="Follow Up Later"><a className='m-4'><img src={timermenu} /></a></Tooltip>
            </div>
            <div className='navsmaller px-0 leftinbox'>
              <div className='px-3 bgfilter'>
                <Row>
                  {/* <Col sm={9}> <h3 className='title-h3'>Draft</h3> </Col> */}
                  <Col sm={9}><a className='navicons mr-2' onClick={(NavBarClick)}><ArrowLeft /></a> <h3 className='title-h3'>Draft</h3> </Col>
                  <Col sm={3}>
                    <div className="inboxnoti">
                      <NotificationsIcon />
                      {TotalCount}
                    </div>
                  </Col>
                </Row>
                <Row className='my-3'>
                  <Col>
                    <div className='textbox-dek serchdek'>
                      <Search onKeyUp={(e) => SearchBox(e, this)}>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          defaultValue={SearchInbox}
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                        />
                      </Search>
                    </div>
                  </Col>
                </Row>
                <Row>
                  {/* <Col xs={8}>
                    <div class="selecter-m inboxtype">
                      <a href="#" className="selectorall" onClick={FromEmailList}>
                        All <img src={downarrow} />
                      </a>
                      <div className="userdropall" id="id_userboxlist" ref={WrapperRef}>
                        <div className="bodyuserdop textdeclist">

                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {FromEmailDropdownList?.map((item, index) => {
                              const labelId = `checkbox-list-secondary-label-${index}`;
                              return (
                                <ListItem className='droplistchec'
                                  key={index}
                                  secondaryAction={
                                    <Checkbox onChange={FromEmailDropdownListCheckbox}
                                      value={item._id}
                                      checked={FromEmailDropdownListChecked?.find(x => x === item?._id)}
                                      inputProps={{ 'aria-labelledby': labelId }} />
                                  }
                                  disablePadding
                                >
                                  <ListItemButton>
                                    <ListItemAvatar>
                                      <ListItemAvatar className="scvar">
                                        <Avatar alt="Remy Sharp" src={inboxuser1} />
                                      </ListItemAvatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={item.FirstName} secondary={<React.Fragment>{item.Email}</React.Fragment>}
                                    />
                                  </ListItemButton>
                                </ListItem>
                              );
                            })}
                          </List>
                        </div>
                      </div>
                    </div>
                  </Col> */}
                  <Col xs={4} align='right'>
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button className='iconbtn' variant="contained" size="large" onClick={RefreshPage} title="Refresh" >
                        <RefreshIcon />
                      </Button>
                      <Button className='iconbtn' variant="contained" size="large" onClick={OpenAllDeletePopModel} title="All Delete">
                        <DeleteIcon />
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="mt-3">
                    <FormGroup>
                      <FormControlLabel control={<Checkbox checked={SelectAllCheckbox} onChange={SeleactAllInBoxCheckBox} />} label="Select All" />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              {
                DraftList?.length === 0 ?
                  <div id="scrollableDiv" class="listinbox">
                    <InfiniteScroll
                      dataLength={DraftList?.length}
                      next={FetchMoreData}
                      hasMore={false}
                      loader={<h4></h4>}
                      scrollableTarget="scrollableDiv"
                    >
                    </InfiniteScroll>
                  </div>
                  :
                  DraftList?.length <= 9
                    ?
                    <div id="scrollableDiv" class="listinbox">
                      <InfiniteScroll
                        dataLength={DraftList?.length}
                        next={FetchMoreData}
                        hasMore={false}
                        loader={<h4></h4>}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                          </p>
                        }
                      >
                        <Stack spacing={1} align="left">
                          {DraftList?.length >= 1 && DraftList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={InboxChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>

                                <Col xs={11}>
                                  <Row>
                                    <Col xs={2}>
                                      <span className="inboxuserpic">
                                        <img src={defaultimage} width="55px" alt="" />
                                      </span>
                                    </Col>
                                    <Col xs={8}>
                                      <h4>{row.Subject}</h4>
                                      <div className='small'> <p className='mb-0'><strong className='bold400'>To</strong>: {row.MailTo}</p></div>
                                    </Col>
                                    <Col xs={2} className="pl-0">
                                      <h6>
                                        {
                                          Moment(row.CreatedDate).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                            ? Moment(row.CreatedDate).format("LT")
                                            : Moment(row.CreatedDate).format("DD/MM/YYYY")
                                        }
                                      </h6>
                                      <h5 className='draftext'>Draft</h5>
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col xs={2} className='ja-center'>
                                      <div className='attachfile'>
                                        <input type="file" />
                                        <AttachFileIcon />
                                      </div>
                                    </Col> */}
                                    <Col xs={10}>
                                      <p>{parse(row.Body)}</p>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
                    :
                    <div id="scrollableDiv" class="listinbox mt-3">
                      <InfiniteScroll
                        dataLength={DraftList?.length}
                        next={FetchMoreData}
                        hasMore={HasMore}
                        loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>Yay! You have seen it all</b>
                          </p>
                        }
                      >
                        <Stack spacing={1} align="left">
                          {DraftList?.length > 1 && DraftList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={InboxChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>
                                <Col xs={11}>
                                  <Row>
                                    <Col xs={2}>
                                      <span className="inboxuserpic">
                                        <img src={defaultimage} width="55px" alt="" />
                                      </span>
                                    </Col>
                                    <Col xs={8}>
                                      <h4>{row.Subject}</h4>
                                      <div className='small'> <p className='mb-0'><strong className='bold400'>To</strong>: bhumit@gmail.com</p></div>
                                    </Col>
                                    <Col xs={2} className="pl-0">
                                      <h6>
                                        {
                                          Moment(row.CreatedDate).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                            ? Moment(row.CreatedDate).format("LT")
                                            : Moment(row.CreatedDate).format("DD/MM/YYYY")
                                        }
                                      </h6>
                                      <h5 className='draftext'>Draft</h5>
                                    </Col>
                                  </Row>
                                  <Row>
                                    {/* <Col xs={2} className='ja-center'>
                                      <div className='attachfile'>
                                        <input type="file" />
                                        <AttachFileIcon />
                                      </div>
                                    </Col> */}
                                    <Col xs={10}>
                                      <p>{parse(row.Body)}</p>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
              }

            </div>
          </Col>
          <Col className='rightinbox'>
            <div className='inxtexteditor px-0'>



              <div className="draftboxinset">
                <div className='hcompose px-3'>
                  <Row>
                    <Col><h4>New Message</h4></Col>
                    <Col className='col text-right'>
                      {/* <ButtonGroup className='composeion' variant="text" aria-label="text button group">
                                    <Button className="minicon">
                                        <img src={Minimize} />
                                    </Button>
                                    <Button className="maxicon">
                                        <img src={Maximize} />
                                    </Button>
                                    <Button onClick={OpenCompose}>
                                        <img src={Close} />
                                    </Button>
                                </ButtonGroup> */}
                    </Col>
                  </Row>
                </div>
                {/* <div className='subcompose px-3 py-2'>
                        <Row className='px-3'>
                            <Col xs={2} className="px-0 pt-1">
                                <h6>Email Account :</h6>
                            </Col>
                            <Col xs={10} className="px-1">
                                <div className='comse-select'>
                                     
                                </div>
                            </Col>
                        </Row>
                    </div> */}
                <div className='subcompose px-3 py-2'>
                  <Row className='px-3'>
                    <Col xs={2} className="px-0 pt-1">
                      <h6>Email Account :</h6>
                    </Col>
                    <Col xs={10} className="px-1">
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
                <div className='subcompose px-3 py-2'>
                  <Row className='px-3'>
                    <Col xs={1} className="px-0">
                      <h6>To :</h6>
                    </Col>
                    <Col xs={9} className="px-0">
                      <Input className='input-clend' id='To' name='To' value={MailChange.To} onChange={HandleMailChange} />
                    </Col>
                    <Col xs={2} className='col text-right d-flex'>
                      <Button className='lable-btn' onClick={OpenCc}>Cc</Button>
                      <Button className='lable-btn' onClick={OpenBcc}>Bcc</Button>
                    </Col>
                  </Row>
                </div>
                <div className='subcompose cc px-3 py-2' id='Cc'>
                  <Row className='px-3'>
                    <Col xs={1} className="px-0">
                      <h6>Cc :</h6>
                    </Col>
                    <Col xs={11} className="px-0">
                      <Input className='input-clend' id='CC' name='Cc' />
                    </Col>
                  </Row>
                </div>
                <div className='subcompose bcc px-3 py-2' id='Bcc'>
                  <Row className='px-3'>
                    <Col xs={1} className="px-0">
                      <h6>Bcc :</h6>
                    </Col>
                    <Col xs={11} className="px-0">
                      <Input className='input-clend' id='BCC' name='Bcc' />
                    </Col>
                  </Row>
                </div>
                <div className='subcompose px-3 py-2'>
                  <Row className='px-3'>
                    <Col xs={1} className="px-0">
                      <h6>Subject :</h6>
                    </Col>
                    <Col xs={11} className="px-0">
                      <Input className='input-clend' id='Subject' name='Subject' value={MailChange.Subject} onChange={HandleMailChange} />
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


              {/*               
              <Row className='bt-border pb-4 mb-4 colsm12'>
                <Col lg={6}>
                  <Row className='userlist'>
                    <Col xs={2}>
                      {
                        OpenMessage == 0 ? ''
                          :
                          <span className="inboxuserpic">
                            <img src={defaultimage} width="63px" alt="" />
                          </span>
                      }
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} Align="right">
                  {
                    OpenMessage == 0 ? ''
                      :
                      <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                        {/* <Button onClick={HandleOpen}>
                      <img src={iconleftright} />
                    </Button>  
                        <Button>
                          <label>{MailNumber} / {DraftList.length}</label>
                        </Button>
                        {<Button onClick={OpenDeletePopModel}>
                          <img src={icondelete} title={"Delete"} />
                        </Button>}
                        {/* <Button>
                          <img src={iconmenu} />
                        </Button>  
                      </ButtonGroup>
                  }
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <h2>{OpenMessage == 0 ? '' : OpenMessage.Subject} </h2>
                </Col>
                <Col>
                  <h6>{OpenMessage == 0 ? '' : Moment(OpenMessage.CreatedDate).format("LLL")}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  {OpenMessage == 0 ? '' : parse(OpenMessage.Body)}
                </Col>
              </Row>
               */}
            </div>
          </Col>
        </Row>
      </div>

      <DraftComposePage GetDraftList={GetDraftList} />
      <AddDraftPage GetDraftList={GetDraftList} />

    </>
  );


}