import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";
import Moment from "moment";
import parse from "html-react-parser";

import { Alert, Stack2 } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Box from '@mui/material/Box';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import downarrow from '../../images/icon_downarrow.svg';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SpamComposePage from "../SpamComposePage/SpamComposePage"
import inboxuser1 from '../../images/avatar/1.jpg';
import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg';
import inbox from '../../images/inbox.svg';
import Emailinbox from '../../images/email_inbox_img.png';
import Emailcall from '../../images/email_call_img.png';
import { Col, Row } from 'react-bootstrap';
import defaultimage from '../../images/default.png';
import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderShow, LoaderHide, IsGreaterDate } from "../../_helpers/Utility";
import InfiniteScroll from "react-infinite-scroll-component";

import ArrowRight from '@material-ui/icons/ArrowRight';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import Tooltip from "@material-ui/core/Tooltip";
import timermenu from '../../images/icons/timermenu.svg';
import spam from '../../images/icons/spam.svg';

import { EditorVariableNames } from "../../_helpers/Utility";

import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

localStorage.setItem("DropdownCheckData", 'Refresh');

export default function SpamPage() {
  const [SpamList, SetSpamList] = React.useState([]);
  const [Page, SetPage] = React.useState(1);
  const [RowsPerPage, SetRowsPerPage] = React.useState(10);
  const [SearchInbox, SetSearchInbox] = React.useState("");
  const [SortField, SetSortField] = React.useState("MessageDatetime");
  const [SortedBy, SetSortedBy] = React.useState(-1);
  const [ClientID, SetClientID] = React.useState(0);
  const [UserID, SetUserID] = React.useState(0);
  const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
  const [DeletePopModel, SetDeletePopModel] = React.useState(false);
  const [AllDeletePopModel, SetAllDeletePopModel] = React.useState(false);
  const [StarPopModel, SetStarPopModel] = React.useState(false);
  const [StarSelected, SetStarSelected] = React.useState(false);
  const [SpamChecked, SetSpamChecked] = React.useState([]);
  const [SelectAllCheckbox, SetSelectAllCheckbox] = React.useState(false);
  const [Open, SetOpen] = React.useState(false);
  const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
  const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
  const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
  const [FromEmailDropdownListChecked, SetFromEmailDropdownListChecked] = React.useState([-1]);
  const [MailNumber, SetMailNumber] = React.useState(1);
  const [OtherInboxPopModel, SetOtherInboxPopModel] = React.useState(false);
  const [TotalCount, SetTotalCount] = React.useState(0);
  const [ResponseData, SetResponseData] = useState([])
  const [HasMore, SetHasMore] = useState(true)
  const [Signature, SetSignature] = useState({
    Data: ""
  })
  const [ForwardSignature, SetForwardSignature] = useState({
    Data: ""
  })

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
    document.title = 'Spam | MAXBOX';
    GetClientID();
  }, [SearchInbox]);


  const HandleOpen = () => SetOpen(true);
  const HandleClose = () => SetOpen(false);



  // Get ClientID
  const GetClientID = () => {
    var UserDetails = GetUserDetails();
    if (UserDetails != null) {
      SetClientID(UserDetails.ClientID);
      SetUserID(UserDetails.UserID);
    }
    GetSpamList(UserDetails.ClientID, UserDetails.UserID, Page, "", FromEmailDropdownListChecked);
   
  }

  const SetHasMoreData = (arr) => {
    if (arr.length === 0) {
      SetHasMore(false)
    } else if (arr.length <= 9) {
      SetHasMore(false)
    } else if (arr.length === 10) {
      SetHasMore(true)
    }
  }

  // Start Get Spam List
  const GetSpamList = (CID, UID, PN, Str, IDs) => {
    var Data = {
      Page: PN,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      AccountIDs: IDs
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        if (Result.data.PageData.length > 0) {
          SetResponseData(Result.data.PageData)
          SetHasMoreData(Result.data.PageData)
          // SetSpamList([...SpamList, ...Result.data.PageData]);
          if (Str == "checkbox") {
            SetSpamList(Result.data.PageData);
          } else if (Str == "scroll") {
            SetSpamList([...SpamList, ...Result.data.PageData]);
          } else {
            SetSpamList(Result.data.PageData);
          }
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        }
        else if (Result.data.PageData?.length === 0 && Str == "checkbox") {
          SetSpamList([])
          OpenMessageDetails('')
          LoaderHide()
        }
        else {
          SetResponseData([])
          SetHasMoreData(Result.data.PageData)
          if (SpamList && SpamList?.length > 1) {
            SetSpamList([...SpamList]);
            let LastElement = SpamList?.slice(-1)
            OpenMessageDetails(LastElement[0]?._id, 0);
          } else {
            OpenMessageDetails('');
            SetSpamList([]);
          }
          LoaderHide()
          if (OpenMessage == "") {
            toast.error(<div>Spam <br />No Data.</div>)
          }
        }
        GetTotalRecordCount(CID, UID);
      }
      else {
        SetSpamList([]);
        OpenMessageDetails('');
        toast.error(Result?.data?.Message);
      }
    });
  };

  const GetUpdatedSpamList = (CID, UID) => {
    var Data = {
      Page: Page,
      RowsPerPage: RowsPerPage,
      sort: true,
      Field: SortField,
      Sortby: SortedBy,
      Search: SearchInbox,
      ClientID: CID,
      UserID: UID,
      IsInbox: false,
      IsStarred: false,
      IsFollowUp: false,
      IsSpam: true,
      IsOtherInbox: false,
      AccountIDs: FromEmailDropdownListChecked
    };
    const ResponseApi = Axios({
      url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryGet",
      method: "POST",
      data: Data,
    });
    ResponseApi.then((Result) => {
      if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
        SetResponseData(Result.data.PageData)
        if (Result.data.PageData.length > 0) {
          SetSpamList(Result.data.PageData);
          OpenMessageDetails(Result.data.PageData[0]._id);
          SetMailNumber(1)
          LoaderHide()
        }
        else {
          SetSpamList([...SpamList]);
          OpenMessageDetails('');
        }
        GetTotalRecordCount(CID, UID);
      }
      else {
        SetSpamList([]);
        OpenMessageDetails('');
      }
    });
  };
  // End Get Spam List

  //Start Open Message Details
  const OpenMessageDetails = (ID, index) => {

    if (ID != '') {
      SetMailNumber(index + 1)
      var Data = {
        _id: ID,
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryGetByID",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.Data.length > 0) {
            SetOpenMessageDetails(Result.data.Data[0]);
          } else {
            SetSpamList([])
            SetOpenMessageDetails([]);
          }
        }
        else {
          SetOpenMessageDetails([]);
          toast.error(Result?.data?.Message);
        }
      });
    }
    else {
      SetOpenMessageDetails([]);
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
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Spam <br />Spam mail deleted successfully.</div>);
          CloseDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetSpamList(ClientID, UserID, Page, "", FromEmailDropdownListChecked);
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End PopModel Open and Close And Delete Message

  // Start Delete All Message 
  const OpenAllDeletePopModel = () => {
    if (SpamChecked.length > 0) {
      SetAllDeletePopModel(true);
    } else {
      toast.error("Please select atleast one email.")
    }
  }
  const CloseAllDeletePopModel = () => {
    SetAllDeletePopModel(false);
  }
  const DeleteAllMessage = () => {
    if (SpamChecked.length > 0) {
      var Data = {
        IDs: SpamChecked,
        LastUpdatedBy: -1
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/SpamEmailHistoryDelete",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Spam <br />Mail deleted successfully.</div>);
          CloseAllDeletePopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetSpamList(ClientID, UserID, Page, "", FromEmailDropdownListChecked);
          SetSelectAllCheckbox(false);
          SetSpamChecked([]);
        } else {
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Delete All Message 

  // Start Update Star Message and model open and close
  const OpenStarPopModel = () => {
    SetStarPopModel(true);
  }
  const CloseStarPopModel = () => {
    SetStarPopModel(false);
  }
  const UpdateStarMessage = (ID) => {
    if (ID != '') {
      //setSelected(true);
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
          toast.success(<div>Spam  <br />Starred  updated successfully.</div>);
          CloseStarPopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetSpamList(ClientID, UserID, Page, "", FromEmailDropdownListChecked);
          // GetUpdatedSpamList(ClientID, UserID);
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
              toast.success(<div>Spam <br />Follow up later updated successfully.</div>);
              CloseFollowupPopModel();
              OpenMessageDetails('')
              LoaderShow()
              GetSpamList(ClientID, UserID, Page, "", FromEmailDropdownListChecked);
            } else {
              toast.error(Result?.data?.Message);
            }
          });
        } else {
          toast.error(<div>Spam <br />Please enter valid date.</div>)
        }
      } else {
        toast.error(<div>Spam <br />Please enter date.</div>)
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
          toast.success(<div>Spam  <br />Other inbox updated successfully.</div>);
          CloseOtherInboxPopModel();
          OpenMessageDetails('')
          LoaderShow()
          GetSpamList(ClientID, UserID, Page, "", FromEmailDropdownListChecked);
        }
        else {
          CloseOtherInboxPopModel();
          toast.error(Result?.data?.Message);
        }
      });
    }
  }
  // End Other inbox  Message and model open and close

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

  // Start CheckBox Code
  const InBoxCheckBox = (e) => {
    var UpdatedList = [...SpamChecked];
    if (e.target.checked) {
      UpdatedList = [...SpamChecked, e.target.value];
    } else {
      UpdatedList.splice(SpamChecked.indexOf(e.target.value), 1);
    }
    SetSpamChecked(UpdatedList);
  }
  const SeleactAllInBoxCheckBox = (e) => {
    if (e.target.checked) {
      SetSelectAllCheckbox(true);
      SetSpamChecked(SpamList.map(item => item._id));
    } else {
      SetSelectAllCheckbox(false);
      SetSpamChecked([]);
    }

  }
  // End CheckBox Code

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

  // From Email List
  const FromEmailList = () => {
    var ResultData = (localStorage.getItem('DropdownCheckData'));
    if (ResultData == "Refresh") {
      var Data = {
        ClientID: ClientID,
        UserID: UserID
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/spamemailhistory/EmailAccountGet",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          if (Result.data.PageData.length > 0) {
            SetFromEmailDropdownListChecked()
            SetFromEmailDropdownList(Result.data.PageData);
            SetFromEmailDropdownListChecked(Result.data.PageData.map(item => item._id));
            localStorage.setItem("DropdownCheckData", Result.data.PageData.map(item => item._id));
            const element = document.getElementById("id_userboxlist")
            if (element.classList.contains("show")) {
              element.classList.remove("show");
            }
            else {
              element.classList.add("show");
            }
          } else {
            toast.error(<div>Spam <br />Please add email configuration.</div>)
          }
        }
        else {
          SetFromEmailDropdownList([]);
          toast.error(Result?.data?.Message);
        }
      });
    }
    else {

      const element = document.getElementById("id_userboxlist")
      if (element.classList.contains("show")) {
        element.classList.remove("show");
      }
      else {
        element.classList.add("show");
      }
      SetFromEmailDropdownListChecked(ResultData.split(','));

    }
  }

  // Handle Change Dropdown List Manage by on React Js
  const FromEmailDropdownListCheckbox = (e) => {
    localStorage.removeItem("DropdownCheckData");

    var UpdatedList = [...FromEmailDropdownListChecked];
    if (e.target.checked) {
      UpdatedList = [...FromEmailDropdownListChecked, e.target.value];
      SetPage(1)
      LoaderShow()
      GetSpamList(ClientID, UserID, 1, "checkbox", UpdatedList)
    } else {
      UpdatedList.splice(FromEmailDropdownListChecked.indexOf(e.target.value), 1);
      SetPage(1)
      LoaderShow()
      GetSpamList(ClientID, UserID, 1, "checkbox", UpdatedList)
    }
    localStorage.setItem("DropdownCheckData", UpdatedList);
    SetFromEmailDropdownListChecked(UpdatedList);
  }


  // Refresh Page
  const RefreshPage = () => {
    LoaderShow()
    SetPage(1);
    SetRowsPerPage(10);
    SetSpamList([])
    SetSelectAllCheckbox(false);
    SetSearchInbox('');
    SetSpamChecked([])
    SetFromEmailDropdownListChecked([-1])
    GetSpamList(ClientID, UserID, Page, "", [-1])
    const element = document.getElementById("id_userboxlist")
    if (element.classList.contains("show")) {
      element.classList.remove("show");
    }
    // else {
    //   element.classList.add("show");
    // }
    localStorage.setItem("DropdownCheckData", 'Refresh');
  }

  // Fetch More Data
  const FetchMoreData = async () => {
    SetPage(Page + 1);
    await GetSpamList(ClientID, UserID, Page + 1, "scroll", FromEmailDropdownListChecked)

  }

  // Get Total Total Record Count
  const GetTotalRecordCount = (CID, UID) => {
    const Data = {
      ClientID: CID,
      UserID: UID,
    }
    Axios({
      url: CommonConstants.MOL_APIURL + "/spamemailhistory/TotalRecordCount",
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

  const ReplyPopModel = (ObjMailsData) => {

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

    const element = document.getElementsByClassName("user_editor")
    SetSignature({ Data: "" });

    const elementreply = document.getElementsByClassName("user_editor_frwd")
    elementreply[0].classList.add("d-none");

    if (element[0].classList.contains("d-none")) {
      element[0].classList.remove("d-none");
      if (ObjMailsData != '') {
        var ToEmail = ObjMailsData.FromName + " (" + ObjMailsData.FromEmail + ")";
        document.getElementById("lblreplytoemail").innerHTML = ToEmail
        document.getElementById("lblreplytoemail").value = ToEmail
      }
    }

  }

  const ReplyPopModelClose = () => {
    const element = document.getElementsByClassName("user_editor")
    element[0].classList.add("d-none");
  }

  // Reply Send Mail Starts
  const ReplySendMail = () => {
    var ToEmail = OpenMessage.FromEmail;
    var ToName = OpenMessage.FromName
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = Signature?.Data

    if (Body == "") {
      toast.error("Please Enter Body");
    } else {
      LoaderShow()
      var Data = {
        ToEmail: ToEmail,
        ToName: ToName,
        ID: ID,
        Subject: Subject,
        Body: Body
      };
      const ResponseApi = Axios({
        url: CommonConstants.MOL_APIURL + "/receive_email_history/SentReplyMessage",
        method: "POST",
        data: Data,
      });
      ResponseApi.then((Result) => {
        if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
          toast.success(<div>Spam  <br />Reply mail send successfully.</div>);
          SetSignature({ Data: "" })
          LoaderHide()
          ReplyPopModelClose();
        }
        else {
          ReplyPopModelClose();
          toast.error(Result?.data?.Message);
          LoaderHide()
        }
      });
    }
  }
  // Reply Send Mail Ends

  // Send Reply Frola Editor Starts
  Froalaeditor.RegisterCommand('SendReply', {
    colorsButtons: ["colorsBack", "|", "-"],
    callback: ReplySendMail
  });
  Froalaeditor.RegisterCommand('Delete', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
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
  /* template option */
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
  /* end template option */
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
  // Check Client Exists
  const config = {
    quickInsertEnabled: false,
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [['SendReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink', 'TemplatesOptions'], ['Delete', 'moreMisc']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
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
  // Send Reply Frola Editor Ends

  const ForwardPopModel = (ObjMailsData) => {
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
    const element = document.getElementsByClassName("user_editor_frwd")
    SetForwardSignature({ Data: "" });
    document.getElementById("to").value = "";
    const elementreply = document.getElementsByClassName("user_editor")
    elementreply[0].classList.add("d-none");

    if (element[0].classList.contains("d-none")) {
      element[0].classList.remove("d-none");
      if (ObjMailsData != '') {

        var ToEmail = ObjMailsData.FromName + " (" + ObjMailsData.FromEmail + ")";
        document.getElementById("lblreplytoemailfrwd").innerHTML = ToEmail
        document.getElementById("lblreplytoemailfrwd").value = ToEmail
      }
    }

  }

  const ForwardPopModelClose = () => {
    const element = document.getElementsByClassName("user_editor_frwd")
    element[0].classList.add("d-none");
  }

  // Validate Email
  const ValidateEmail = (Email) => {
    if (!/^[[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Email)) {
      return false;
    }
    else {
      return true;
    }
  };

  // Forward Send Mail Starts
  const ForwardSendMail = () => {

    var ToEmail = document.getElementById("to").value;
    var ID = OpenMessage._id
    var Subject = OpenMessage.Subject;
    var Body = ForwardSignature?.Data

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
          Body: Body
        };
        const ResponseApi = Axios({
          url: CommonConstants.MOL_APIURL + "/receive_email_history/SentForwardMessage",
          method: "POST",
          data: Data,
        });
        ResponseApi.then((Result) => {
          if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
            toast.success(<div>Spam  <br />Forward  mail send successfully.</div>);
            SetForwardSignature({ Data: "" })
            LoaderHide()
            ForwardPopModelClose();
          }
          else {
            ForwardPopModelClose();
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
  Froalaeditor.RegisterCommand('Delete', {
    colorsButtons: ["colorsBack", "|", "-"],
    align: 'right',
    buttonsVisible: 2,
    title: 'Delete',
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
  // Check Client Exists
  const forwardconfig = {
    quickInsertEnabled: false,
    placeholderText: 'Edit Your Content Here!',
    charCounterCount: false,
    toolbarButtons: [['ForwardReply', 'Sendoption', 'fontSize', 'insertFile', 'insertImage', 'insertLink'], ['Delete', 'moreMisc']],
    imageUploadURL: CommonConstants.MOL_APIURL + "/client/upload_image",
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

  const WrapperRef = useRef(null);
  UseOutsideAlerter(WrapperRef);

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
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                you want to Star a email ?
              </Typography>
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
      </div>

      <div className='bodymain'>
        <Row className='mb-columfull'>
          <Col className='maxcontainerix' id="navclose">
            <div className='closeopennav'>
              <a className='navicons m-4' onClick={(NavBarClick)}><ArrowRight /></a>
              <Tooltip title="Spam"><a className='m-4'><img src={spam} /></a></Tooltip>
            </div>
            <div className='navsmaller px-0 leftinbox'>
              <div className='px-3 bgfilter'>
                <Row>
                  <Col sm={9}><a className='navicons mr-2' onClick={(NavBarClick)}><ArrowLeft /></a> <h3 className='title-h3'>Spam</h3> </Col>
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
                  <Col xs={8}>
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
                  </Col>
                  <Col xs={4} align='right'>
                    <ButtonGroup variant="text" aria-label="text button group">
                      <Button className='iconbtn' variant="contained" size="large" onClick={RefreshPage} title="Refresh" >
                        <RefreshIcon />
                      </Button>
                      <Button className='iconbtn' variant="contained" size="large" onClick={OpenAllDeletePopModel} title="Delete">
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
                SpamList?.length === 0 ?
                  <div id="scrollableDiv" class="listinbox">
                    <InfiniteScroll
                      dataLength={SpamList.length}
                      next={FetchMoreData}
                      hasMore={false}
                      loader={<h4></h4>}
                      scrollableTarget="scrollableDiv"
                    >
                    </InfiniteScroll>
                  </div>
                  :
                  SpamList?.length <= 9
                    ?
                    <div id="scrollableDiv" class="listinbox">
                      <InfiniteScroll
                        dataLength={SpamList?.length}
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
                          {SpamList?.length >= 1 && SpamList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={SpamChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>
                              </Row>
                              <Col xs={11} className="pr-0">
                                <Row className='mx-0'>
                                  <Col className='px-2' xs={2}>
                                    <span className="inboxuserpic">
                                      <img src={defaultimage} width="55px" alt="" />
                                    </span>
                                  </Col>
                                  <Col className='px-2' xs={8}>
                                    <h4>{row.FromEmail}</h4>
                                    <h3>{row.Subject}</h3>
                                  </Col>
                                  <Col className='px-2' xs={2}>
                                    <h6>
                                      {
                                        Moment(row.MessageDatetime).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                          ? Moment(row.MessageDatetime).format("LT")
                                          : Moment(row.MessageDatetime).format("DD/MM/YYYY")
                                      }
                                    </h6>
                                    <ToggleButton className='startselct' value="check" selected={row.IsStarred} onClick={() => UpdateStarMessage(row._id)}>
                                      <StarBorderIcon className='starone' />
                                      <StarIcon className='selectedstart startwo' />
                                    </ToggleButton>
                                  </Col>
                                </Row>
                                <Row className='mx-0'>
                                  {/* <Col xs={2} className='ja-center'>
                                    <div className='attachfile'>
                                      <input type="file" />
                                      <AttachFileIcon />
                                    </div>
                                  </Col> */}
                                  <Col xs={10}>
                                    <p>{row.Snippet}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
                    :
                    <div id="scrollableDiv" class="listinbox">
                      <InfiniteScroll
                        dataLength={SpamList?.length}
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
                          {SpamList?.length > 1 && SpamList?.map((row, index) => (
                            <Item className='cardinboxlist px-0' onClick={() => OpenMessageDetails(row._id, index)}>
                              <Row>
                                <Col xs={1} className="pr-0">
                                  <FormControlLabel control={<Checkbox defaultChecked={SpamChecked.find(x => x == row._id) ? true : false} name={row._id} value={row._id} onChange={InBoxCheckBox} />} label="" />
                                </Col>
                              </Row>
                              <Col xs={11} className="pr-0">
                                <Row className='mx-0'>
                                  <Col className='px-2' xs={2}>
                                    <span className="inboxuserpic">
                                      <img src={defaultimage} width="55px" alt="" />
                                    </span>
                                  </Col>
                                  <Col className='px-2' xs={8}>
                                    <h4>{row.FromEmail}</h4>
                                    <h3>{row.Subject}</h3>
                                  </Col>
                                  <Col className='px-2' xs={2}>
                                    <h6>
                                      {
                                        Moment(row.MessageDatetime).format("DD/MM/YYYY") === Moment().format("DD/MM/YYYY")
                                          ? Moment(row.MessageDatetime).format("LT")
                                          : Moment(row.MessageDatetime).format("DD/MM/YYYY")
                                      }
                                    </h6>
                                    <ToggleButton className='startselct' value="check" selected={row.IsStarred} onClick={() => UpdateStarMessage(row._id)}>
                                      <StarBorderIcon className='starone' />
                                      <StarIcon className='selectedstart startwo' />
                                    </ToggleButton>
                                  </Col>
                                </Row>
                                <Row className='mx-0'>
                                  {/* <Col xs={2} className='ja-center'>
                                    <div className='attachfile'>
                                      <input type="file" />
                                      <AttachFileIcon />
                                    </div>
                                  </Col> */}
                                  <Col xs={10}>
                                    <p>{row.Snippet}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Item>
                          ))}
                        </Stack>
                      </InfiniteScroll>
                    </div>
              }
            </div>
          </Col>
          <Col className='rightinbox'>
            <div className='inxtexteditor'>
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
                    <Col xs={10} className='p-0'>
                      <h5>{OpenMessage == 0 ? '' : OpenMessage.FromName}</h5>
                      {/* <h6>{OpenMessage == 0 ? '' : OpenMessage.EmailAccount.FirstName} <KeyboardArrowDownIcon /></h6> */}
                      <h6>{OpenMessage == 0 ? '' : OpenMessage.EmailAccount.FirstName}
                        {
                          OpenMessage == 0 ? ''
                            :
                            <a onClick={Userdropdown}>
                              <KeyboardArrowDownIcon />
                            </a>
                        }
                      </h6>

                      <div class="userdropall maxuserdropall" id="Userdropshow" ref={WrapperRef}>
                        <div class="bodyuserdop textdeclist">
                          <div className='columlistdrop'>
                            <Row>
                              <Col className='pr-0' sm={3} align="right"><lable>from:</lable></Col>
                              <Col sm={9}><strong>{OpenMessage.FromName}</strong> {"<"}{OpenMessage.FromEmail}{">"}</Col>
                            </Row>
                            <Row>
                              <Col className='pr-0' sm={3} align="right"><lable>to:</lable></Col>
                              <Col sm={9}>
                                <p className='mb-0'>{OpenMessage.ToEmail}</p>
                              </Col>
                            </Row>
                            <Row>
                              <Col className='pr-0' sm={3} align="right"><lable>date:</lable></Col>
                              <Col sm={9}>{Moment(OpenMessage.MessageDatetime).format("LLL")}</Col>
                            </Row>
                            <Row>
                              <Col className='pr-0' sm={3} align="right"><lable>subject:</lable></Col>
                              <Col sm={9}>{OpenMessage.Subject}</Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={6} Align="right">
                  {
                    OpenMessage == 0 ? ''
                      :
                      <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                        <Button onClick={HandleOpen}>
                          <img src={iconleftright} />
                        </Button>
                        <Button>
                          <label>{MailNumber} / {SpamList.length}</label>
                        </Button>
                        <Button onClick={OpenStarPopModel}>
                          <img src={iconstar} title={"Starred"} />
                        </Button>
                        <Button onClick={OpenFollowupPopModel} title={"Follow Up Later"}>
                          <img src={icontimer} />
                        </Button>
                        <Button onClick={OpenOtherInboxPopModel}>
                          <img src={inbox} className="width36" title="Other Inbox" />
                        </Button>
                        <Button>
                          <a href="#replaybx" onClick={() => ReplyPopModel(OpenMessage)} className='p-1'><img src={iconsarrow2} className="arrowicon" title={"Reply"} /></a>
                        </Button>
                        <Button>
                          <a href="#replaybx" onClick={() => ForwardPopModel(OpenMessage)} className='p-1'><img src={iconsarrow1} className="arrowicon" title={"Forward"} /></a>
                        </Button>
                        {<Button onClick={OpenDeletePopModel}>
                          <img src={icondelete} title="Delete" />
                        </Button>}
                        {/* <Button>
                          <img src={iconmenu} />
                        </Button> */}
                      </ButtonGroup>
                  }
                </Col>
              </Row>
              <Row className='mb-3'>
                <Col>
                  <h2>{OpenMessage == 0 ? '' : OpenMessage.Subject} </h2>
                </Col>
                <Col>
                  <h6>{OpenMessage == 0 ? '' : Moment(OpenMessage.MessageDatetime).format("LLL")}</h6>
                </Col>
              </Row>
              <Row>
                <Col>
                  {OpenMessage == 0 ? '' : parse(OpenMessage.HtmlBody)}
                </Col>
              </Row>
              <div id="replaybx" className='d-flex mt-5 ml-2'>
                {
                  OpenMessage == 0 ? ''
                    :
                    <Row>
                      <Col sm={6} className='p-0'>
                        <a onClick={() => ReplyPopModel(OpenMessage)} className='p-2'><img src={iconsarrow2} title="Reply" /></a>
                      </Col>
                      <Col sm={6} className='p-0'>
                        <a onClick={() => ForwardPopModel(OpenMessage)} className='p-2'><img src={iconsarrow1} title="Forward" /></a>
                      </Col>
                    </Row>
                }
              </div>
              <div className='user_editor d-none mt-5'>
                <Row className='userlist'>
                  <Col className='fixwidleft'>
                    <span className="inboxuserpic">
                      <img src={inboxuser1} width="63px" alt="" />
                    </span>
                  </Col>
                  <Col className='fixwidright p-0'>
                    <div className='editorboxcard'>
                      <Row className='edittoprow p-2'>
                        <Col className='d-flex hedtopedit'>
                          <a href='#' className='p-1'><img src={iconsarrow2} /></a>
                          <h6><KeyboardArrowDownIcon /></h6>
                          <label id='lblreplytoemail'></label>
                        </Col>
                      </Row>

                      <div className='bodycompose'>
                        <Row className='pt-2'>
                          <Col>
                            <div id='replybody' className='FroalaEditor'>
                              <FroalaEditor tag='textarea' id="signature" config={config} onModelChange={HandleModelChange} model={Signature.Data} />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* <Row className='px-2'>
                        <Col className='bodyeditor'>
                          <TextareaAutosize className='w-100'
                            aria-label="minimum height"
                            minRows={3}
                            placeholder=""
                            id='replybody'
                          />
                        </Col>
                      </Row> */}

                      {/* <div className='ftcompose px-3'>
                        <Row className='px-3'>
                          <Col xs={10} className='px-0'>
                            <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                              <Button variant="contained btn btn-primary smallbtn" onClick={() => ReplySendMail(OpenMessage)}> Send</Button>
                              <Button>
                                <img src={text_font} />
                              </Button>
                              <Button>
                                <img src={attachment} />
                              </Button>
                              <Button>
                                <img src={image_light} />
                              </Button>
                              <Button>
                                <img src={smiley_icons} />
                              </Button>
                              <Button>
                                <img src={google_drive} />
                              </Button>
                              <Button>
                                <img src={link_line} />
                              </Button>
                              <Button>
                                <img src={signature} />
                              </Button>
                            </ButtonGroup>
                          </Col>

                          <Col xs={2} className='px-0 text-right'>
                            <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                              <Button onClick={() => ReplyPopModelClose()}>
                                <img src={icondelete} />
                              </Button>
                              <Button>
                                <img src={iconmenu} />
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </div> */}

                    </div>
                  </Col>
                </Row>
              </div>

              <div className='user_editor_frwd  d-none mt-5'>
                <Row className='userlist'>
                  <Col className='fixwidleft'>
                    <span className="inboxuserpic">
                      <img src={inboxuser1} width="63px" alt="" />
                    </span>
                  </Col>
                  <Col className='fixwidright p-0'>
                    <div className='editorboxcard'>
                      <Row className='edittoprow p-2'>
                        <Col className='d-flex hedtopedit'>
                          <a href='#' className='p-1'><img src={iconsarrow1} /></a>
                          <h6><KeyboardArrowDownIcon /></h6>
                          {/* <label id='lblreplytoemailfrwd'></label> */}
                          {/* <TextareaAutosize className='input-clend' id='To' name='To'  /> */}
                          <input className='border-none' type='text' name='to' id='to' />
                        </Col>
                      </Row>

                      <div className='bodycompose'>
                        <Row className='pt-2'>
                          <Col>
                            <div id='replybodyfrwd' className='FroalaEditor'>
                              <FroalaEditor tag='textarea' id="signature" config={forwardconfig} onModelChange={ForwardHandleModelChange} model={ForwardSignature.Data} />
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* <Row className='px-2'>
                        <Col className='bodyeditor'>
                          <TextareaAutosize className='w-100'
                            aria-label="minimum height"
                            minRows={3}
                            placeholder=""
                            id='replybodyfrwd'
                          />
                        </Col>
                      </Row> */}

                      {/* <div className='ftcompose px-3'>
                        <Row className='px-3'>
                          <Col xs={10} className='px-0'>
                            <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                              <Button variant="contained btn btn-primary smallbtn" onClick={() => ForwardSendMail(OpenMessage)}> Forward</Button>
                              <Button>
                                <img src={text_font} />
                              </Button>
                              <Button>
                                <img src={attachment} />
                              </Button>
                              <Button>
                                <img src={image_light} />
                              </Button>
                              <Button>
                                <img src={smiley_icons} />
                              </Button>
                              <Button>
                                <img src={google_drive} />
                              </Button>
                              <Button>
                                <img src={link_line} />
                              </Button>
                              <Button>
                                <img src={signature} />
                              </Button>
                            </ButtonGroup>
                          </Col>

                          <Col xs={2} className='px-0 text-right'>
                            <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                              <Button onClick={() => ForwardPopModelClose()}>
                                <img src={icondelete} />
                              </Button>
                              <Button>
                                <img src={iconmenu} />
                              </Button>
                            </ButtonGroup>
                          </Col>
                        </Row>
                      </div> */}

                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <SpamComposePage GetSpamList={GetSpamList} />

    </>
  );
}