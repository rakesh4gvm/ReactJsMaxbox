import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import parse from "html-react-parser";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames, ValidateEmail, decrypt, Plain2HTML } from "../../_helpers/Utility";
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
import { useParams } from 'react-router-dom';

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

export default function AllSentEmailByID(props) {

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
    const [ValueMail, SetValueMail] = useState()
    const [ForwardToEmailValue, SetForwardToEmailValue] = useState([])
    const [ForwardCCEmailValue, SetForwardCCEmailValue] = useState([])
    const [ForwardBCCEmailValue, SetForwardBCCEmailValue] = useState([])
    const [TemplateID, SetTemplateID] = React.useState("");
    const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
    const [subject, setSubject] = useState()
    const [GetReplyMessageDetails, SetGetReplyMessageDetails] = useState()
    const [ChatGPTMOdel, SetChatGPTModel] = useState(false)
    const [NewObjectionID, SetNewObjectionID] = useState([])
    const [AllSentTotalRecords, SetAllSentTotalRecords] = useState()
    const [SentEmailTotalRecords, SetSentEmailTotalRecords] = useState()
    const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
    const OpenChatGPTModel = () => SetChatGPTModel(true)

    const HanleChatGPTClose = () => SetChatGPTModel(false);

    const { id } = useParams();

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
    }, [SearchInbox, id])

    const ContainerRef = useRef(null)

    // Starts Get Client ID
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

        if (ID != "" && ID != null && ID != "undefined") {
            SetMenuID(ID)
            GetAllSent(UserDetails.ClientID, UserDetails.UserID, Page, id, "showloader");
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

    // Get All Sent Emails Total Count
    const GetAllSentEmailsTotalCount = (CID, UID) => {
        LoaderShow()
        const Data = {
            ClientID: CID,
            UserID: UID,
        }
        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/sent_email_history/AllTotalRecords",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {

                var total = Result.data?.AllSentEmailsCount != undefined ? Result.data?.AllSentEmailsCount : 0;
                SetTotalRecord(total)
                console.log(Result.data)
            } else {
                SetTotalRecord(0)
                toast.error(Result?.data?.Message);
            }
        });
        LoaderHide()
    }

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
        FromEmailList(CID, UID, id);

        let AccountIDs = [id]
        // if (ID.length > 0) {

        //     AccountIDs.push(ID)
        // } else {
        //     AccountIDs = [-1]
        // }
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
                if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                    if (Result.data.Data.length > 0) {
                        SetOpenMessageDetails(Result.data.Data[0]);
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

        const elementforward = document.getElementById("UserComposeForward")
        elementforward.classList.remove("show");

        // SetToEmailValue([])
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

        var GetReplyMessageDetailsData = GetReplyMessageDetails + ' ' + VoiceOfTone + ' ' + EmailSummary;
        if (VoiceOfTone.length > 0) {
            LoaderShow()
            var GetReplyMessageDetailsData = GetReplyMessageDetails + " make reply happy and respectfull tone";
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
        placeholderText: 'Edit Your Content Here!',
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
        ContainerRef.current.scrollTop = 0;
        LoaderShow()
        var ID = decrypt(props.location.search.replace('?', ''))

        if (ID != "" && ID != null && ID != "undefined") {
            GetAllSent(ClientID, UserID, 1, ID, "");
        }
        else {
            GetAllSent(ClientID, UserID, 1, 0, "")
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
                            Chat GPT
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
                                <Table id="pokemons-list" className='tablelister' sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th" width={'30px'} align="center"></TableCell>
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
                                                    <TableCell width={'35px'} align="center">
                                                        <ToggleButton title="Starred" className="startselct" value="check" selected={item.IsStarred} onClick={() => UpdateStarMessage(item._id, "")} >
                                                            <StarBorderIcon className='starone' />
                                                            <StarIcon className='selectedstart startwo' />
                                                        </ToggleButton>
                                                    </TableCell>
                                                    {/* <TableCell width={'35px'}></TableCell> */}
                                                    <TableCell scope="row" onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')}> {item.Subject} </TableCell>
                                                    <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} >{item.FromEmail}</TableCell>
                                                    <TableCell onClick={() => OpenMessageDetails(item._id, index, '', 'updatelist')} >{Moment(item.MailSentDatetime).format("MM/DD/YYYY")}</TableCell>
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
                                            <label>{OpenMessage == 0 ? '' : Moment(OpenMessage.MailSentDatetime).format("MM/DD/YYYY hh:mm A")}</label>
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
                            <Col xs={1} className="px-0">
                                <h6>Cc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
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
                            <Col xs={1} className="px-0">
                                <h6>Bcc :</h6>
                            </Col>
                            <Col xs={11} className="px-0">
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

        </>
    );
}