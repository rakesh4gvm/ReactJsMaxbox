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
import OtherInboxComposePage from '../OtherInboxComposePage/OtherInboxComposePage';

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
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Box } from '@material-ui/core';
import ToggleButton from '@mui/material/ToggleButton';
import StarIcon from '@material-ui/icons/Star';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
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
import Emailcall from '../../images/email_call_img.png';
import Emailinbox from '../../images/email_inbox_img.png';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icons_replyall from '../../images/icons_replyall.svg';
import icondelete from '../../images/icon_delete.svg';
import Chatgpt from '../../images/icons/chatgpt-icon.svg';

import "react-toastify/dist/ReactToastify.css";
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
import { useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import { ArrowDropDown } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';

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
}

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

export default function OtherInboxByID(props) {

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
    const [StarPopModel, SetStarPopModel] = React.useState(false);
    const [FollowupPopModel, SetFollowupPopModel] = React.useState(false);
    const [FollowupDate, SetFollowupDate] = React.useState(new Date().toLocaleString());
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
    const [state, setState] = useState(true)
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
    const [bccanchorEl, setBCCAnchorEl] = React.useState(null)

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

    const { id } = useParams();

    useEffect(() => {
        document.title = 'Other Inbox | MAXBOX';
        GetClientID();
    }, [SearchInbox, state, id])

    const ContainerRef = useRef(null)

    // Get Client ID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
        GetClientList(UserDetails.ClientID)
        // if (props !== undefined) {
        //   const ID = props.location.state;
        var ID = id

        if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                GetOtherInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "showloader", "SeenEmails");
            } else {
                GetOtherInboxList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "SeenEmails")
            }
        } else {
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                GetOtherInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "showloader", "");
            } else {
                GetOtherInboxList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "showloader", "")
            }
        }

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
                        var total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].OtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].OtherInboxCount : 0
                        // if (ShowEmails == "SeenEmails" ) {
                        //   total = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenOtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenOtherInboxCount : 0
                        // }
                        // else 
                        if (ShowEmails == "") {
                            var OtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].OtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].OtherInboxCount : 0
                            var SeenOtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenOtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == ID)[0].SeenOtherInboxCount : 0
                            total = OtherInboxCount - SeenOtherInboxCount;
                        }

                        SetTotalRecord(total);
                    } else {
                        var total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.OtherInboxCount)?.reduce((a, b) => a + b, 0) : 0
                        // if (ShowEmails == "SeenEmails") {
                        //   total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenOtherInboxCount)?.reduce((a, b) => a + b, 0) : 0

                        // }
                        // else 
                        if (ShowEmails == "") {
                            var OtherInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.OtherInboxCount)?.reduce((a, b) => a + b, 0) : 0
                            var SeenOtherInboxCount = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.SeenOtherInboxCount)?.reduce((a, b) => a + b, 0) : 0
                            total = OtherInboxCount - SeenOtherInboxCount
                        }
                        // else if (ShowEmails == "" && IsStarred == "IsStarredEmails") {
                        //   total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0

                        // }
                        // else if (ShowEmails == "SeenEmails" && IsStarred == "IsStarredEmails") {
                        //   total = Result.data.PageData != undefined ? Result.data.PageData?.map((e) => e?.StarredFocusedCount)?.reduce((a, b) => a + b, 0) : 0
                        // }
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
    const GetOtherInboxList = (CID, UID, PN, ID, str, ShowEmails, RefreshString) => {
        FromEmailList(CID, UID, id, ShowEmails);
        let AccountIDs = [id]
        // if (ID.length > 0) {
        //     AccountIDs.push(ID)
        // } else {
        //     AccountIDs = [-1]
        // }
        if (str == "showloader") {
            LoaderShow()
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
            IsStarred: false,
            IsFollowUp: false,
            IsSpam: false,
            IsOtherInbox: true,
            AccountIDs: AccountIDs,
            UnseenEmails: UnseenEmails,
            IsStarredEmails: false
        };
        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGet",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (Result.data.PageData.length > 0) {
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
                    SetFollowUpList([])
                    SetOpenMessageDetails([]);
                    SetPageValue(0)
                    LoaderHide()
                    SetTotalRecord(0);
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

            if (str == "showloader") {
                LoaderShow()
            }
            var Data = {
                _id: ID,
            };
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
                        SetOpenMessageDetails(Result.data.Data[0]);
                        SetCCMessages(Result.data.Data[0]?.CcNameEmail);
                        SetBCCMessages(Result.data.Data[0]?.BccNameEmail);
                        localStorage.setItem("CCMessage", JSON.stringify(Result.data.Data[0]?.CcNameEmail))
                        localStorage.setItem("BCCMessage", JSON.stringify(Result.data.Data[0]?.BccNameEmail))
                        SetActive(ID);
                        SetToEmailValue(Result.data.Data)
                        SetValueMail(Result.data.Data[0]?.FromEmail)
                        // let UpdatedList = FollowUpList.map(item => {
                        //     if (item._id == ID) {
                        //         return { ...item, IsSeen: true };
                        //     }
                        //     return item;
                        // });
                        // if (updatestr == "updatelist") {
                        //     SetFollowUpList(UpdatedList)
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

            var element = document.getElementById("star_" + ID);
            var element2 = document.getElementById("starbelow_" + ID);
            var className = element.className;
            var isStar = className.includes("Mui-selected")
            if (isStar) {
                element.classList.remove("Mui-selected");
                if (element2) {
                    element2.classList.remove("Mui-selected");
                }
                // OpenMessageDetails(ID, index, "", "",)
            }
            else {
                element.classList.add("Mui-selected");
                if (element2) {
                    element2.classList.add("Mui-selected");
                }
                // OpenMessageDetails(ID, index, "", "",)
            }

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
            ResponseApi.then((Result) => {
                if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                    

                    // var element = document.getElementById("star_" + ID);
                    // var element2 = document.getElementById("starbelow_" + ID);
                    // var className = element.className;
                    // var isStar = className.includes("Mui-selected")
                    // if (isStar) {
                    //     element.classList.remove("Mui-selected");
                    //     element2.classList.remove("Mui-selected");
                    //     OpenMessageDetails(ID, index, "", "",)
                    // }
                    // else {
                    //     element.classList.add("Mui-selected");
                    //     element2.classList.add("Mui-selected");
                    //     OpenMessageDetails(ID, index, "", "",)
                    // }

                    // var ID = decrypt(props.location.search.replace('?', ''))
                    // if (!state) {
                    //     if (ID != "" && ID != null && ID != "undefined") {
                    //         GetOtherInboxList(ClientID, UserID, Page, ID, "hideloader", "SeenEmails");
                    //     } else {
                    //         GetOtherInboxList(ClientID, UserID, Page, 0, "hideloader", "SeenEmails")
                    //     }
                    // } else {
                    //     if (ID != "" && ID != null && ID != "undefined") {
                    //         GetOtherInboxList(ClientID, UserID, Page, ID, "hideloader", "");
                    //     } else {
                    //         GetOtherInboxList(ClientID, UserID, Page, 0, "hideloader", "")
                    //     }
                    // }

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
    // const UpdateFollowupMessage = (ID) => {
    //   const IsValidDate = Moment(FollowupDate).isValid()
    //   const IsGreater = IsGreaterDate(FollowupDate)
    //   if (ID != '') {
    //     if (FollowupDate != null) {
    //       if (IsValidDate && IsGreater) {
    //         var Data = {
    //           ID: ID,
    //           IsFollowUp: true,
    //           FollowupDate: FollowupDate,
    //           IsOtherInbox: false,
    //           LastUpdatedBy: -1
    //         };
    //         const ResponseApi = Axios({
    //           url: CommonConstants.MOL_APIURL + "/receive_email_history/FollowupUpdate",
    //           method: "POST",
    //           data: Data,
    //         });
    //         ResponseApi.then((Result) => {
    //           if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
    //             toast.success(<div>Other Inbox  <br />Follow up later updated successfully.</div>);
    //             CloseFollowupPopModel();
    //             OpenMessageDetails('')
    //             LoaderShow()
    //             // if (props !== undefined) {
    //             //   const ID = props.location.state;
    //             var ID = decrypt(props.location.search.replace('?', ''))
    //             // if (ID !== undefined && ID!="") {
    //             if (!state) {
    //               if (ID != "" && ID != null && ID != "undefined") {
    //                 GetOtherInboxList(ClientID, UserID, Page, ID, "", "SeenEmails");
    //               } else {
    //                 GetOtherInboxList(ClientID, UserID, Page, 0, "", "SeenEmails")
    //               }
    //             } else {
    //               if (ID != "" && ID != null && ID != "undefined") {
    //                 GetOtherInboxList(ClientID, UserID, Page, ID, "", "");
    //               } else {
    //                 GetOtherInboxList(ClientID, UserID, Page, 0, "", "")
    //               }
    //             }
    //             // }
    //           } else {
    //             toast.error(Result?.data?.Message);
    //           }
    //         });
    //       } else {
    //         toast.error(<div>Please enter valid date.</div>)
    //       }
    //     } else {
    //       toast.error(<div>Please enter date.</div>)
    //     }
    //   }
    // }
    // // End Followup Message

    // New Update Follow Up Message
    const UpdateFollowupMessage = (ID) => {
        const IsValidDate = Moment(FollowupDate).isValid()
        const IsGreater = IsGreaterDate(FollowupDate)
        var StarID = ID
        if (ID != '') {
            if (FollowupDate != null) {
                if (IsValidDate && IsGreater) {
                    var IsStarred
                    if (OpenMessage.IsStarred == true) {
                        IsStarred = true
                    } else {
                        IsStarred = false
                    }
                    var Data = {
                        ID: ID,
                        IsFollowUp: true,
                        FollowupDate: FollowupDate,
                        IsOtherInbox: false,
                        LastUpdatedBy: -1,
                        IsStarred: IsStarred,
                        IsOtherInboxPage: true
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
                            OpenMessageDetails('')
                            LoaderShow()
                            // if (props !== undefined) {
                            //   const ID = props.location.state;
                            var ID = decrypt(props.location.search.replace('?', ''))
                            // if (ID !== undefined && ID!="") {
                            var element = document.getElementById("star_" + StarID);

                            var className = element.className;
                            var isStar = className.includes("Mui-selected")

                            if (isStar) {
                                element.classList.remove("Mui-selected");
                            }

                            if (!state) {
                                if (ID != "" && ID != null && ID != "undefined") {
                                    GetOtherInboxList(ClientID, UserID, Page, ID, "", "SeenEmails");
                                } else {
                                    GetOtherInboxList(ClientID, UserID, Page, 0, "", "SeenEmails")
                                }
                            } else {
                                if (ID != "" && ID != null && ID != "undefined") {
                                    GetOtherInboxList(ClientID, UserID, Page, ID, "", "");
                                } else {
                                    GetOtherInboxList(ClientID, UserID, Page, 0, "", "")
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
    // End Followup Message New Api


    // start PopModel Open and Close and Delete Message
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
                    toast.success(<div>Delete mail successfully.</div>)
                    CloseDeletePopModel();
                    OpenMessageDetails('', '', 'showloader', '')
                    LoaderShow()
                    // if (props !== undefined) {
                    //   const ID = props.location.state;
                    var ID = decrypt(props.location.search.replace('?', ''))
                    // if (ID !== undefined && ID!="") {
                    // if (ID != "" && ID != null && ID != "undefined") {
                    //     if (FollowUpList.length - 1 == 0) {
                    //         GetOtherInboxList(ClientID, UserID, 1, ID, "", "");
                    //     } else {
                    //         GetOtherInboxList(ClientID, UserID, Page, ID, "", "");
                    //     }
                    // } else {
                    //     if (FollowUpList.length - 1 == 0) {
                    //         GetOtherInboxList(ClientID, UserID, 1, 0, "", "")
                    //     } else {
                    //         GetOtherInboxList(ClientID, UserID, Page, 0, "", "SeenEmails")
                    //     }
                    // }
                    if (!state) {
                        if (ID != "" && ID != null && ID != "undefined") {
                            GetOtherInboxList(ClientID, UserID, 1, ID, "", "SeenEmails");
                        } else {
                            GetOtherInboxList(ClientID, UserID, Page, ID, "", "SeenEmails");
                        }
                    } else {
                        if (ID != "" && ID != null && ID != "undefined") {
                            GetOtherInboxList(ClientID, UserID, 1, 0, "", "")
                        } else {
                            GetOtherInboxList(ClientID, UserID, Page, 0, "", "")
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

    const HandleChange = (panel) => (event, isExpanded) => {
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


    // start replay code
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
    // end replay code

    const OpenReplyAll = () => {
        RemoveForwardPop()

        SetSignature({ Data: "" })
        const element = document.getElementById("UserComposeReply")

        var CC = localStorage.getItem("CCMessage")
        var BCC = localStorage.getItem("BCCMessage")

        const NewCCEmail = RemoveCurrentEmailFromCC(OpenMessage, FromEmailDropdownList)
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
        var EmailResponse = Response.filter(e => e && e.toLowerCase().match(EmailRegex));
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

                    if (!state) {
                        GetOtherInboxList(ClientID, UserID, Page, 0, "", "SeenEmails");
                    } else {
                        GetOtherInboxList(ClientID, UserID, Page, 0, "", "")
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
        var GetReplyMessageDetailsData = plaiTextBody + ' \n\n' + VoiceOfTone + '  \n\n' + EmailSummary;

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
        // if (CcReplyflag == false) {
        //     document.getElementById("CcReply").style.display = 'block'
        //     SetCcReplyflag(true);
        // }
        // else {
        //     document.getElementById("CcReply").style.display = 'none'
        //     SetCcReplyflag(false);
        // }
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

    // Starts Pagination
    const HandleChangePage = (
        event,
        newPage,
    ) => {

        setSelectAllChecked(false)

        ContainerRef.current.scrollTop = 0;
        SetPage(newPage + 1);

        var pn = newPage + 1;

        // if (props !== undefined) {
        //   const ID = props.location.state;
        var ID = decrypt(props.location.search.replace('?', ''))
        // if (ID !== undefined && ID!="") {
        if (!state) {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                GetOtherInboxList(ClientID, UserID, pn, ID, "", "SeenEmails");
            } else {
                GetOtherInboxList(ClientID, UserID, pn, 0, "", "SeenEmails")
            }
        } else {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                GetOtherInboxList(ClientID, UserID, pn, ID, "", "");
            } else {
                GetOtherInboxList(ClientID, UserID, pn, 0, "", "")
            }
        }
        // }
    };
    // Ends Pagination 

    const RefreshTable = () => {
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
                GetOtherInboxList(ClientID, UserID, 1, ID, "", "SeenEmails", "Refresh");
            } else {
                GetOtherInboxList(ClientID, UserID, 1, 0, "", "SeenEmails", "Refresh")
            }
        } else {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                GetOtherInboxList(ClientID, UserID, 1, ID, "", "", "Refresh");
            } else {
                GetOtherInboxList(ClientID, UserID, 1, 0, "", "", "Refresh")
            }
        }
    }


    const handleChange = (event) => {
        SetPage(1);
        setState(event.target.checked);
        if (selectAllChecked) {
            setSelectAllChecked(!selectAllChecked)
            SetCheckedID([])
        } else {
            SetCheckedID([])
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
                    setIsChecked(false);
                    SetCheckedID([])
                    // LoaderHide()
                    // toast.success("Mails are unread successfully.")
                    // var ID = decrypt(props.location.search.replace('?', ''))
                    // if (ID != "" && ID != null && ID != "undefined") {
                    //     GetOtherInboxList(ClientID, UserID, Page, ID, "", "SeenEmails")
                    // } else {
                    //     GetOtherInboxList(ClientID, UserID, Page, 0, "", "SeenEmails")
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
                {/* <Navigation menupage="/OtherInboxPage" MenuID={MenuID} /> */}
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
                                    <FormControlLabel className='check-unseen' control={<Checkbox defaultChecked onChange={handleChange} />} label="Unread" />
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
                            <div className="simulationDiv" ref={ContainerRef}>
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
                                        {FollowUpList.map((item, index) => (
                                            <TableRow
                                                // className={`${Active === item._id ? "selected-row" : ""}`}
                                                className={`${Active === item._id ? "selected-row" : ""} ${item.IsSeen ? "useen-email" : "seen-email"}`}
                                                key={item.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                                                <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {item.FromName + " " + "(" + item.FromEmail + ")"}</TableCell>
                                                <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} scope="row"> {item?.Subject ? (
                                                    <>
                                                        {item.Subject.split(' ').slice(0, 8).join(' ')}
                                                        {item.Subject.split(' ').length > 8 ? '...' : ''}
                                                    </>
                                                ) : null}</TableCell>
                                                <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')}>{Moment(item.MessageDatetime).format("MM/DD/YYYY hh:mm a")}</TableCell>
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
                                                            // <label>
                                                            //     <b>Cc : </b>{OpenMessage?.CcNameEmail?.map((e) => e?.Email)?.join(", ")}
                                                            // </label> : "" 
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
                                                            // <label><b>Bcc : </b>{OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")}</label> : ""
                                                            <label>
                                                                <b>BCC : </b>
                                                                {OpenMessage?.BccNameEmail?.map((e) => e?.Name ? e.Name.split(' ')[0] : e.Email.split('@')[0])?.join(', ')}
                                                                {/* {OpenMessage?.BccNameEmail?.map((e) => e?.Email)?.join(", ")} */}

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
                                                        <ToggleButton className={"startselct temp-class" + " " + MUIClass} title={"Starred"} value="check" id={"starbelow_" + OpenMessage._id} selected={OpenMessage.IsStarred} onClick={() => OpenStarPopModel()}>
                                                            <StarBorderIcon className='starone' />
                                                            <StarIcon className='selectedstart startwo' />
                                                        </ToggleButton>
                                                    </Button>
                                                    <Button onClick={OpenFollowupPopModel} title={"Follow Up Later"}>
                                                        <img src={icontimer} />
                                                    </Button>
                                                    <Button>
                                                        <a><img src={iconsarrow2} title={"Reply"} onClick={OpenComposeReply} /></a>
                                                    </Button>
                                                    <Button>
                                                        <a><img src={icons_replyall} onClick={OpenReplyAll} title={"Reply all"} /></a>
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
            <OtherInboxComposePage GetOtherInboxList={GetOtherInboxList} />
        </>
    );
}













