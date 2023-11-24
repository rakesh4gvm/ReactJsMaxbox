import React, { useState, useEffect, useRef } from 'react';
import Moment from "moment";
import Axios from "axios";
import SplitPane from "react-split-pane";
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";
import { GetUserDetails, LoaderHide, LoaderShow, EditorVariableNames, ValidateEmail, decrypt, Plain2HTML, RemoveForwardPop, RemoveCurrentEmailFromCC, RemoveCurrentEmailFromBCC } from "../../_helpers/Utility";
import TablePagination from '@mui/material/TablePagination';

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
import RefreshIcon from '@material-ui/icons/Refresh';
import Chatgpt from '../../images/icons/chatgpt-icon.svg';

import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import 'froala-editor/js/froala_editor.pkgd.min.js';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import Froalaeditor from 'froala-editor';
import FroalaEditor from 'react-froala-wysiwyg';
import { toast } from "react-toastify";

import { useParams } from 'react-router-dom';
import Popover from '@mui/material/Popover';
import { ArrowDropDown, InsertDriveFileOutlined } from '@material-ui/icons';
import Frame from 'react-frame-component';
import { useDispatch, useSelector } from 'react-redux';

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

export default function LabelByID(props) {

    const [AllInboxList, SetAllInboxList] = useState([])
    const [OpenMessage, SetOpenMessageDetails] = React.useState([]);
    const [MailNumber, SetMailNumber] = React.useState(1);
    const [Page, SetPage] = React.useState(1);
    const [RowsPerPage, SetRowsPerPage] = React.useState(50);
    const [SortField, SetsortField] = React.useState("MessageDatetime");
    const [SortedBy, SetSortedBy] = React.useState(-1);
    const [SearchInbox, SetSearchInbox] = React.useState("");
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [IDs, SetIDs] = useState(null)
    const [expanded, setExpanded] = React.useState(false);
    const [ObjectData, SetAllObjectData] = useState([])
    const [TemplateData, SetAllTemplateData] = useState([])
    const [temopen, setTemOpen] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [DeletePopModel, SetDeletePopModel] = React.useState(false);
    const [TotalRecord, SetTotalRecord] = React.useState(0);
    const [MenuID, SetMenuID] = React.useState("");
    const [isstarActive, setstarActive] = React.useState(false);
    const [Signature, SetSignature] = useState({
        Data: ""
    })
    const [ForwardSignature, SetForwardSignature] = useState({
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
    // const [state, setState] = useState(true)
    const [state, setState] = useState(false)
    const [ValueMail, SetValueMail] = useState()
    const [ForwardToEmailValue, SetForwardToEmailValue] = useState([])
    const [ForwardCCEmailValue, SetForwardCCEmailValue] = useState([])
    const [ForwardBCCEmailValue, SetForwardBCCEmailValue] = useState([])
    const [TemplateID, SetTemplateID] = React.useState("");
    const [ClientData, SetClientData] = useState()
    const [ObjectIDTemplateID, SetObjectIDTemplateID] = React.useState("");
    const [subject, setSubject] = useState()
    const [GetReplyMessageDetails, SetGetReplyMessageDetails] = useState()
    const [GetReplyMessageDetailsTextBody, SetGetReplyMessageDetailsTextBody] = useState()
    const [NewTemplateID, SetNewTemplateID] = useState([])
    const [NewObjectionID, SetNewObjectionID] = useState([])
    const [ChatGPTMOdel, SetChatGPTModel] = useState(false)
    const [CheckedID, SetCheckedID] = useState([])
    const [isChecked, setIsChecked] = useState(false);
    const [ShowCheckBox, SetShowCheckBox] = useState("")
    const [FromEmailDropdownList, SetFromEmailDropdownList] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [ReplyText, SetReplyText] = useState("Reply")

    const OpenChatGPTModel = () => SetChatGPTModel(true)

    const HanleChatGPTClose = () => SetChatGPTModel(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleTemOpen = () => setTemOpen(true);
    const handleTemClose = () => setTemOpen(false);
    const [showNotification, setShowNotification] = useState(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [ccanchorEl, setCCAnchorEl] = React.useState(null);
    const [bccanchorEl, setBCCAnchorEl] = React.useState(null);
    const [MUIClass, SetMUIClass] = useState("Mui-selected")
    const [StarPopModel, SetStarPopModel] = React.useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState(0);
    const [SenderDetails, SetSenderDetails] = React.useState(null);
    const tableRef = useRef(null);
    const { id } = useParams();
    const dispatch = useDispatch();
    const emailAccounts = useSelector(state => state.emailAccounts);

    const [boxVisible, setBoxVisible] = useState(false);
    const boxRef = useRef(null);
    const [labelsData, setLabelsData] = useState([])
    const [LabelboxVisible, setLabelBoxVisible] = useState(false);
    const [SelectedLabelValue, SetSelectedLabelValue] = useState(null);
    const [SelectedMultipleLabelValue, SetSelectedMultipleLabelValue] = useState(null);
    const editorRef = useRef(null);
    const [contextMenu, setContextMenu] = React.useState(null);
    const [isSubMenuOpen, setSubMenuOpen] = React.useState(false);
    const [EmailAccountUsers, SetEmailAccountUsers] = useState([])
    const [MessageId, SetMessageId] = useState("");
    const [MessageIsSeen, SetMessageIsSeen] = useState();
    const [MessageIsStarred, SetMessageIsStarred] = useState();
    const [AccountId, SetAccountId] = useState();


    const handleContextMenu = (event) => {
        event.preventDefault();
        SetAccountId("");
        var msgId = event.currentTarget.getAttribute('messageid');
        var isSeen = event.currentTarget.getAttribute('isseen') == "true" ? true : false;
        var isStarred = event.currentTarget.getAttribute('isstarred') == "true" ? true : false;
        var accountId = event.currentTarget.getAttribute('accountid');
        SetAccountId(accountId);
        // SetCheckedID([...CheckedID, msgId]);
        setSelectAllChecked(false);
        SetCheckedID([msgId]);
        SetMessageId(msgId);
        SetMessageIsSeen(isSeen);
        SetMessageIsStarred(isStarred);
        setContextMenu((prevContextMenu) => (prevContextMenu ? null : {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
        }));
    };

    const texthandleClose = (event) => {
        event.preventDefault();
        SetCheckedID([]);
        SetMessageId("");
        SetMessageIsSeen("");
        SetMessageIsStarred("");
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

    useEffect(() => {
        // Function to close box when clicking outside
        const handleOutsideClick = (event) => {
            if (boxRef.current && !boxRef.current.contains(event.target)) {
                setBoxVisible(false);
                setLabelBoxVisible(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        document.title = 'Label | MAXBOX';
        GetClientID();
        SetCheckedID([]);
        setSelectAllChecked(false);
    }, [SearchInbox, state, id])

    const HandleLabelID = (event, newValue) => {
        SetSelectedLabelValue(newValue);

        if (CheckedID.length > 0) {
            var Data = {
                RecieverEmailLableID: newValue?.RecieverEmailLableID,
                MessageIDs: CheckedID
            };
            LoaderShow();
            const ResponseApi = Axios({
                url: CommonConstants.MOL_APIURL + "/receive_email_history/MoveMailsToLabel",
                method: "POST",
                data: Data,
            });
            ResponseApi.then((Result) => {
                if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                    setSelectedRowIndex(0)
                    setBoxVisible(false);
                    toast.success(Result?.data?.Message);
                    GetClientID(id);
                    LoaderHide();
                    SetCheckedID([]);
                    setSelectAllChecked(false)
                    dispatch({ type: "refreshClientDetails", payload: true });
                }
            })
        } else {
            setBoxVisible(false);
            LoaderHide();
            toast.error("Please select email");
        }
    }

    const HandleMultipleLabelID = (event, newValue) => {
        SetSelectedMultipleLabelValue(newValue)
    }

    const Apply = () => {
        SetCheckedID([]);
        SetMessageId("");
        SetMessageIsSeen("");
        SetMessageIsStarred("");
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
                    setSelectedRowIndex(0)
                    setLabelBoxVisible(false)
                    toast.success(Result?.data?.Message);
                    GetClientID();
                    LoaderHide();
                    SetCheckedID([]);
                    dispatch({ type: "refreshClientDetails", payload: true });
                }
                else {
                    setLabelBoxVisible(false);
                    LoaderHide();
                    toast.error(Result?.data?.Message);
                }
            })
        }
        else {
            setBoxVisible(false);
            LoaderHide();
            toast.error("Please select email");
        }
    }

    const MarkAsSpam = (MessageId, AccountId) => {
        SetCheckedID([]);
        SetMessageId("");
        SetMessageIsSeen("");
        SetMessageIsStarred("");
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

    const ContainerRef = useRef(null);

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

    // Get Client ID
    const GetClientID = (ID) => {
        SetCheckedID([])
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
        GetClientList(UserDetails.ClientID)
        GetEmailAccountUsers(UserDetails.ClientID, UserDetails.UserID)
        var ID = id
        // if (ID !== undefined && ID!="") {
        // const ID = props.location.state;
        if (!state) {
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                if (isstarActive) {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "SeenEmails", "IsStarredEmails");
                } else {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, 1, id, "SeenEmails", "", "Refresh");
                }
            } else {
                if (isstarActive) {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "SeenEmails", "IsStarredEmails");
                } else {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "SeenEmails", "");
                }
            }
        } else {
            if (ID != "" && ID != null && ID != "undefined") {
                SetMenuID(ID);
                if (isstarActive) {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "", "IsStarredEmails")
                } else {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, id, "", "", "Refresh")
                }
            } else {
                if (isstarActive) {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "", "IsStarredEmails")
                } else {
                    GetAllInboxList(UserDetails.ClientID, UserDetails.UserID, Page, 0, "", "")
                }
            }
        }
        // }
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
                        var total = 0;
                        // var obj = Result.data.PageData[0].LabelField;
                        var obj;
                        const foundPageData = Result.data.PageData.find(e =>
                            e.LabelField.some(item =>
                                item.RecieverEmailLableID === ID
                            )
                        );

                        if (foundPageData) {
                            obj = foundPageData.LabelField;
                        }

                        if (obj.length > 0) {
                            var lbl = obj.filter(c => c.RecieverEmailLableID == ID)
                            if (lbl.length > 0) {
                                total = lbl[0].TotalLableMailCount - lbl[0].TotalSeenLableMailCount;

                                const AccountID = Result.data.PageData[0].AccountID;

                                const IdToFind = ID
                                const FoundData = Result.data.PageData.find(item => item.LabelField.some(label => label.RecieverEmailLableID === IdToFind));

                                setLabelsData(FoundData.LabelField);
                                var emailAcocuntsArray = emailAccounts || [];
                                var emailDataArray = emailAcocuntsArray.filter((e) => e.AccountID == AccountID) || [];
                                var LabelCounts = [];

                                var StarredCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].StarredCount : 0
                                var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenStarredCount : 0
                                var UnSeenStarredCount = StarredCount - SeenStarredCount;

                                var InboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].InboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].InboxCount : 0
                                var SeenInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenInboxCount : 0
                                var UnSeenInboxCount = InboxCount - SeenInboxCount;

                                var FocusedCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FocusedCount : 0
                                var SeenFocusedCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFocusedCount : 0
                                var UnSeenFocusedCount = FocusedCount - SeenFocusedCount;

                                var SpamCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SpamCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SpamCount : 0
                                var SeenSpamCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenSpamCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenSpamCount : 0
                                var UnSeenSpamCount = SpamCount - SeenSpamCount;

                                var OtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].OtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].OtherInboxCount : 0
                                var SeenOtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenOtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenOtherInboxCount : 0
                                var UnSeenOtherInboxCount = OtherInboxCount - SeenOtherInboxCount;

                                var FollowUpLaterCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FollowUpLaterCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FollowUpLaterCount : 0
                                var SeenFollowUpLaterCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFollowUpLaterCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFollowUpLaterCount : 0
                                var UnSeenFollowUpLaterCount = FollowUpLaterCount - SeenFollowUpLaterCount;

                                if (emailDataArray.length > 0) {
                                    var IsExistAccountId = false;
                                    const updatedAccounts = emailAcocuntsArray.map(obj => {
                                        if (obj.AccountID === AccountID) {
                                            IsExistAccountId = true;
                                            // Check if LabelsCounts exists and has items
                                            if (obj.LabelsCounts && obj.LabelsCounts.length > 0) {
                                                // Find if label with given ID exists
                                                const labelIndex = obj.LabelsCounts.findIndex(lblobj => lblobj.LabelID === ID);

                                                if (labelIndex !== -1) {
                                                    // Update the existing label count
                                                    obj.UnSeenStarredCount = UnSeenStarredCount;
                                                    obj.UnSeenInboxCount = UnSeenInboxCount;
                                                    obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                                    obj.UnSeenSpamCount = UnSeenSpamCount;
                                                    obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                                    obj.UnSeenFollowUpLaterCount = UnSeenFollowUpLaterCount;
                                                    obj.LabelsCounts[labelIndex].UnSeenLabelCounts = total;
                                                } else {
                                                    // Add a new label count if label with given ID doesn't exist
                                                    obj.UnSeenStarredCount = UnSeenStarredCount;
                                                    obj.UnSeenInboxCount = UnSeenInboxCount;
                                                    obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                                    obj.UnSeenSpamCount = UnSeenSpamCount;
                                                    obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                                    obj.UnSeenFollowUpLaterCount = UnSeenFollowUpLaterCount;
                                                    obj.LabelsCounts.push({
                                                        LabelID: ID,
                                                        UnSeenLabelCounts: total
                                                    });
                                                }
                                            } else {
                                                // Initialize LabelsCounts array and add the new label count
                                                obj.UnSeenStarredCount = UnSeenStarredCount;
                                                obj.UnSeenInboxCount = UnSeenInboxCount;
                                                obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                                obj.UnSeenSpamCount = UnSeenSpamCount;
                                                obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                                obj.UnSeenFollowUpLaterCount = UnSeenFollowUpLaterCount;
                                                obj.LabelsCounts = [{
                                                    LabelID: ID,
                                                    UnSeenLabelCounts: total
                                                }];
                                            }
                                        }
                                        return obj;
                                    });
                                    // Dispatch the updated emailAccounts array
                                    dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                    if (!IsExistAccountId) {
                                        var newVal = {
                                            AccountID: AccountID,
                                            UnSeenStarredCount: UnSeenStarredCount,
                                            UnSeenInboxCount: UnSeenInboxCount,
                                            UnSeenFocusedCount: UnSeenFocusedCount,
                                            UnSeenSpamCount: UnSeenSpamCount,
                                            UnSeenOtherInboxCount: UnSeenOtherInboxCount,
                                            UnSeenFollowUpLaterCount: UnSeenFollowUpLaterCount,
                                            LabelsCounts: [{
                                                LabelID: ID,
                                                UnSeenLabelCounts: total
                                            }]
                                        };
                                        const updatedAccounts = [...emailAcocuntsArray, newVal];
                                        dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                    }
                                } else {
                                    const newEmailDataObj = {
                                        LabelID: ID,
                                        UnSeenLabelCounts: total
                                    };
                                    LabelCounts.push(newEmailDataObj);
                                    const newEmailData = {
                                        AccountID: AccountID,
                                        UnSeenStarredCount: UnSeenStarredCount,
                                        UnSeenInboxCount: UnSeenInboxCount,
                                        UnSeenFocusedCount: UnSeenFocusedCount,
                                        UnSeenSpamCount: UnSeenSpamCount,
                                        UnSeenOtherInboxCount: UnSeenOtherInboxCount,
                                        UnSeenFollowUpLaterCount: UnSeenFollowUpLaterCount,
                                        LabelsCounts: LabelCounts
                                    };

                                    const updatedAccounts = [...emailAcocuntsArray, newEmailData];
                                    dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                }
                            }
                        }
                        if (ShowEmails == "SeenEmails") {
                            var total = 0;
                            if (obj.length > 0) {
                                var lbl = obj.filter(c => c.RecieverEmailLableID == ID)
                                if (lbl.length > 0) {
                                    total = lbl[0].TotalLableMailCount
                                }
                            }
                            SetTotalRecord(total);
                        }
                        else if (ShowEmails == "") {
                            // var total = 0;
                            var obj = Result.data.PageData[0].LabelField;
                            if (obj.length > 0) {
                                var lbl = obj.filter(c => c.RecieverEmailLableID == ID)
                                if (lbl.length > 0) {
                                    total = lbl[0].TotalLableMailCount - lbl[0].TotalSeenLableMailCount;

                                    // const AccountID = Result.data.PageData[0].AccountID;
                                    // var emailAcocuntsArray = emailAccounts || [];
                                    // var emailDataArray = emailAcocuntsArray.filter((e) => e.AccountID == AccountID) || [];
                                    // var LabelCounts = [];

                                    // var StarredCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].StarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].StarredCount : 0
                                    // var SeenStarredCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenStarredCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenStarredCount : 0
                                    // var UnSeenStarredCount = StarredCount - SeenStarredCount;

                                    // var InboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].InboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].InboxCount : 0
                                    // var SeenInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenInboxCount : 0
                                    // var UnSeenInboxCount = InboxCount - SeenInboxCount;

                                    // var FocusedCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].FocusedCount : 0
                                    // var SeenFocusedCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFocusedCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenFocusedCount : 0
                                    // var UnSeenFocusedCount = FocusedCount - SeenFocusedCount;

                                    // var SpamCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SpamCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SpamCount : 0
                                    // var SeenSpamCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenSpamCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenSpamCount : 0
                                    // var UnSeenSpamCount = SpamCount - SeenSpamCount;

                                    // var OtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].OtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].OtherInboxCount : 0
                                    // var SeenOtherInboxCount = Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenOtherInboxCount != undefined ? Result.data.PageData.filter((e) => e.AccountID == AccountID)[0].SeenOtherInboxCount : 0
                                    // var UnSeenOtherInboxCount = OtherInboxCount - SeenOtherInboxCount;

                                    // if (emailDataArray.length > 0) {
                                    //     var IsExistAccountId = false;
                                    //     const updatedAccounts = emailAcocuntsArray.map(obj => {
                                    //         if (obj.AccountID === AccountID) {
                                    //             IsExistAccountId = true;
                                    //             // Check if LabelsCounts exists and has items
                                    //             if (obj.LabelsCounts && obj.LabelsCounts.length > 0) {
                                    //                 // Find if label with given ID exists
                                    //                 const labelIndex = obj.LabelsCounts.findIndex(lblobj => lblobj.LabelID === ID);

                                    //                 if (labelIndex !== -1) {
                                    //                     // Update the existing label count
                                    //                     obj.UnSeenStarredCount = UnSeenStarredCount;
                                    //                     obj.UnSeenInboxCount = UnSeenInboxCount;
                                    //                     obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                    //                     obj.UnSeenSpamCount = UnSeenSpamCount;
                                    //                     obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                    //                     obj.LabelsCounts[labelIndex].UnSeenLabelCounts = total;
                                    //                 } else {
                                    //                     // Add a new label count if label with given ID doesn't exist
                                    //                     obj.UnSeenStarredCount = UnSeenStarredCount;
                                    //                     obj.UnSeenInboxCount = UnSeenInboxCount;
                                    //                     obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                    //                     obj.UnSeenSpamCount = UnSeenSpamCount;
                                    //                     obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                    //                     obj.LabelsCounts.push({
                                    //                         LabelID: ID,
                                    //                         UnSeenLabelCounts: total
                                    //                     });
                                    //                 }
                                    //             } else {
                                    //                 // Initialize LabelsCounts array and add the new label count
                                    //                 obj.UnSeenStarredCount = UnSeenStarredCount;
                                    //                 obj.UnSeenInboxCount = UnSeenInboxCount;
                                    //                 obj.UnSeenFocusedCount = UnSeenFocusedCount;
                                    //                 obj.UnSeenSpamCount = UnSeenSpamCount;
                                    //                 obj.UnSeenOtherInboxCount = UnSeenOtherInboxCount;
                                    //                 obj.LabelsCounts = [{
                                    //                     LabelID: ID,
                                    //                     UnSeenLabelCounts: total
                                    //                 }];
                                    //             }
                                    //         }
                                    //         return obj;
                                    //     });
                                    //     // Dispatch the updated emailAccounts array
                                    //     dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                    //     if (!IsExistAccountId) {
                                    //         var newVal = {
                                    //             AccountID: AccountID,
                                    //             UnSeenStarredCount: UnSeenStarredCount,
                                    //             UnSeenInboxCount: UnSeenInboxCount,
                                    //             UnSeenFocusedCount: UnSeenFocusedCount,
                                    //             UnSeenSpamCount: UnSeenSpamCount,
                                    //             UnSeenOtherInboxCount: UnSeenOtherInboxCount,
                                    //             LabelsCounts: [{
                                    //                 LabelID: ID,
                                    //                 UnSeenLabelCounts: total
                                    //             }]
                                    //         };
                                    //         const updatedAccounts = [...emailAcocuntsArray, newVal];
                                    //         dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                    //     }
                                    // } else {
                                    //     const newEmailDataObj = {
                                    //         LabelID: ID,
                                    //         UnSeenLabelCounts: total
                                    //     };
                                    //     LabelCounts.push(newEmailDataObj);
                                    //     const newEmailData = {
                                    //         AccountID: AccountID,
                                    //         UnSeenStarredCount: UnSeenStarredCount,
                                    //         UnSeenInboxCount: UnSeenInboxCount,
                                    //         UnSeenFocusedCount: UnSeenFocusedCount,
                                    //         UnSeenSpamCount: UnSeenSpamCount,
                                    //         UnSeenOtherInboxCount: UnSeenOtherInboxCount,
                                    //         LabelsCounts: LabelCounts
                                    //     };

                                    //     const updatedAccounts = [...emailAcocuntsArray, newEmailData];
                                    //     dispatch({ type: "emailAccounts", payload: updatedAccounts });
                                    // }
                                }
                            }
                            SetTotalRecord(total);
                        }
                    } else {

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
    const GetAllInboxList = (CID, UID, PN, ID, ShowEmails, IsStarred, RefreshString) => {
        FromEmailList(CID, UID, id, ShowEmails, IsStarred);

        let LabelID = id

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
            IsInbox: true,
            IsFollowUp: false,
            IsSpam: false,
            IsOtherInbox: false,
            RecieverEmailLableID: LabelID,
            UnseenEmails: UnseenEmails,
        };

        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryLabelGet",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (Result.data.PageData.length > 0) {
                    SetAllInboxList(Result.data.PageData)
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
                        SetAllInboxList(updatedArr)
                    }
                    SetTotalCount(Result.data.TotalCount)
                    OpenMessageDetails(Result.data.PageData[0]._id);
                    // SetTotalRecord(Result.data.TotalCount);
                    SetMailNumber(1)
                    SetPageValue(PN)
                    LoaderHide()
                } else {
                    SetAllInboxList([])
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

            let UpdatedList = AllInboxList.map(item => {
                if (item._id == ID) {
                    return { ...item, IsSeen: true };
                }
                return item;
            });
            if (str == "updatelist") {
                SetAllInboxList(UpdatedList)
            }

            var Data = {
                _id: ID,
                IsAllInboxPage: true
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
                        SetToEmailValue(Result.data.Data)
                        SetValueMail(Result.data.Data[0]?.FromEmail)
                        SetOpenMessageDetails(Result.data.Data[0]);
                        SetCCMessages(Result.data.Data[0]?.CcNameEmail);
                        SetBCCMessages(Result.data.Data[0]?.BccNameEmail);
                        localStorage.setItem("CCMessage", JSON.stringify(Result.data.Data[0]?.CcNameEmail))
                        localStorage.setItem("BCCMessage", JSON.stringify(Result.data.Data[0]?.BccNameEmail))
                        SetActive(ID);
                        // let UpdatedList = AllInboxList.map(item => {
                        //     if (item._id == ID) {
                        //         return { ...item, IsSeen: true };
                        //     }
                        //     return item;
                        // });
                        // if (str == "updatelist") {
                        //     SetAllInboxList(UpdatedList)
                        // }
                        dispatch({ type: "refreshClientDetails", payload: true });
                        LoaderHide()
                    } else {
                        SetAllInboxList([])
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
                    let UpdatedList = AllInboxList.map(item => {
                        if (item._id == ID) {
                            return { ...item, IsSeen: false };
                        }
                        return item;
                    });
                    if (str == "updatelist") {
                        SetAllInboxList(UpdatedList)
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
            SetAllInboxList([])
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
        SetMessageIsStarred("");
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
                url: CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryDelete",
                method: "POST",
                data: Data,
            });
            ResponseApi.then((Result) => {
                if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                    toast.success(<div>Delete mail successfully.</div>);
                    CloseDeletePopModel();
                    OpenMessageDetails('')
                    LoaderShow()
                    dispatch({ type: "refreshClientDetails", payload: true });
                    // var ID = decrypt(props.location.search.replace('?', ''))
                    // if (ID != "" && ID != null && ID != "undefined") {
                    //   if (AllInboxList.length - 1 == 0) {
                    //     GetAllInboxList(ClientID, UserID, 1, ID, "", "");
                    //   } else {
                    //     GetAllInboxList(ClientID, UserID, Page, ID, "", "");
                    //   }
                    // } else {
                    //   if (AllInboxList.length - 1 == 0) {
                    //     GetAllInboxList(ClientID, UserID, 1, 0, "", "")
                    //   } else {
                    //     GetAllInboxList(ClientID, UserID, Page, 0, "", "")
                    //   }
                    // }
                    var ID = decrypt(props.location.search.replace('?', ''))
                    // if (ID !== undefined && ID!="") {
                    // const ID = props.location.state;
                    if (!state) {
                        if (ID != "" && ID != null && ID != "undefined") {
                            if (isstarActive) {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                            } else {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "");
                            }
                        } else {
                            if (isstarActive) {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                            } else {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "");
                            }
                        }
                    } else {
                        if (ID != "" && ID != null && ID != "undefined") {
                            GetAllInboxList(ClientID, UserID, Page, ID, "", "");
                        } else {
                            GetAllInboxList(ClientID, UserID, Page, 0, "", "")
                        }
                    }
                } else {
                    toast.error(Result?.data?.Message);
                }
            });
        }
    }
    // End PopModel Open and Close and Delete Message

    const HandleChange = (panel) => (event, isExpanded) => {
        // console.log(panel);
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
        SetMessageIsStarred("");
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
        setShowNotification(true);
        setTimeout(() => {
            // setShowNotification(false);
        }, 5000);
    };
    // end replay code

    const OpenReplyAll = () => {
        SetReplyText("Reply All")
        RemoveForwardPop()

        SetCheckedID([]);
        SetMessageIsSeen("");
        SetMessageIsStarred("");
        setContextMenu(null);
        setSubMenuOpen(false);

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
                    toast.success(<div>Reply mail sent successfully.</div>);
                    var ID = decrypt(props.location.search.replace('?', ''))
                    if (!state) {
                        if (ID != "" && ID != null && ID != "undefined") {
                            if (isstarActive) {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                            } else {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "");
                            }
                        } else {
                            if (isstarActive) {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                            } else {
                                GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "");
                            }
                        }
                    } else {
                        if (ID != "" && ID != null && ID != "undefined") {
                            GetAllInboxList(ClientID, UserID, Page, ID, "", "");
                        } else {
                            if (isstarActive) {
                                GetAllInboxList(ClientID, UserID, Page, 0, "", "IsStarredEmails")
                            } else {
                                GetAllInboxList(ClientID, UserID, Page, 0, "", "")
                            }
                        }
                    }
                    OpenComposeReply();
                    CloseComposeReply()
                    LoaderHide()
                    SetToEmailValue([ValueMail])
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
        SetForwardSignature({ Data: "" })

        SetForwardToEmailValue([])
        SetForwardCCEmailValue([])
        SetForwardBCCEmailValue([])

        SetCheckedID([]);
        SetMessageIsSeen("");
        SetMessageIsStarred("");
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
        SetMessageId("");

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
                GetAllInboxList(ClientID, UserID, pn, ID, "SeenEmails", "");
            } else {
                GetAllInboxList(ClientID, UserID, pn, 0, "SeenEmails", "")
            }
        } else {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {

                GetAllInboxList(ClientID, UserID, pn, ID, "", "");
            } else {
                GetAllInboxList(ClientID, UserID, pn, 0, "", "")
            }
        }
        // }
    };


    const handleChange = (event) => {
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
                GetAllInboxList(ClientID, UserID, 1, ID, "SeenEmails", "", "Refresh");
            } else {
                if (isstarActive) {
                    setstarActive(false)
                }
                GetAllInboxList(ClientID, UserID, 1, 0, "SeenEmails", "", "Refresh")
            }
        } else {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {
                GetAllInboxList(ClientID, UserID, 1, ID, "", "", "Refresh");
            } else {
                if (isstarActive) {
                    setstarActive(false)
                }
                GetAllInboxList(ClientID, UserID, 1, 0, "", "", "Refresh")
            }
        }
        dispatch({ type: "refreshClientDetails", payload: true });
        if (tableRef.current) {
            tableRef.current.focus();
        }
    }

    const ToggleStartClass = () => {
        setstarActive(!isstarActive);
    };

    const HandleStarredChange = () => {
        if (selectAllChecked) {
            setSelectAllChecked(!selectAllChecked)
            SetCheckedID([])
        } else {
            SetCheckedID([])
        }
        SetPage(1)
        var ID = decrypt(props.location.search.replace('?', ''))

        if (!isstarActive) {
            LoaderShow()
            if (ID != "" && ID != null && ID != "undefined") {
                // GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                if (!state) {
                    GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                } else {
                    GetAllInboxList(ClientID, UserID, Page, ID, "", "IsStarredEmails");
                }
            } else {
                // GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "IsStarredEmails")
                if (!state) {
                    GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "IsStarredEmails");
                } else {
                    GetAllInboxList(ClientID, UserID, Page, ID, "", "IsStarredEmails");
                }
            }
        } else {
            if (ID != "" && ID != null && ID != "undefined") {
                if (!state) {
                    GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "")
                } else {
                    GetAllInboxList(ClientID, UserID, Page, ID, "", "")
                }
            } else {
                // GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "")
                if (!state) {
                    GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "")
                } else {
                    GetAllInboxList(ClientID, UserID, Page, 0, "", "")
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
            const allIds = AllInboxList.map(item => item._id);
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

            const idsWithIsSeenTrue = AllInboxList.filter(item => item.IsSeen).map(item => item._id);

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

            AllInboxList.forEach(item => {
                if (CheckedID.includes(item._id)) {
                    item.IsSeen = false;
                }
            });

            LoaderShow()
            toast.success("Mails are unread successfully.")
            setSelectAllChecked(false)
            LoaderHide()
            SetAllInboxList(AllInboxList)
            // SetCheckedID([])

            SetMessageId("");
            SetMessageIsSeen("");
            SetMessageIsStarred("");
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
                    //     GetAllInboxList(ClientID, UserID, Page, ID, "SeenEmails", "");
                    // } else {
                    //     if (isstarActive) {
                    //         GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "IsStarredEmails");
                    //     } else {
                    //         GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "");
                    //     }
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

            const idsWithIsSeenTrue = AllInboxList.filter(item => item.IsSeen == false).map(item => item._id);

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

            AllInboxList.forEach(item => {
                if (CheckedID.includes(item._id)) {
                    item.IsSeen = true;
                }
            });

            LoaderShow()
            toast.success("Mails are read successfully.")
            setSelectAllChecked(false)
            LoaderHide()
            SetAllInboxList(AllInboxList)
            // SetCheckedID([])

            SetMessageId("");
            SetMessageIsSeen("");
            SetMessageIsStarred("");
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

    const OpenStarPopModel = () => {
        SetStarPopModel(true);
    }
    const CloseStarPopModel = () => {
        SetStarPopModel(false);
    }
    const UpdateStarMessage = (ID, str, index) => {
        SetCheckedID([]);
        SetMessageId("");
        SetMessageIsSeen("");
        SetMessageIsStarred("");
        setContextMenu(null);
        setSubMenuOpen(false);
        if (str === "opnemodel") {
            CloseStarPopModel();
        }
        if (ID != '') {

            let UpdatedList = AllInboxList.map(item => {
                if (item._id == ID) {
                    if (item.IsStarred) {
                        return { ...item, IsStarred: false };
                    } else {
                        return { ...item, IsStarred: true };
                    }
                }
                return item;
            });

            SetAllInboxList(UpdatedList)

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
            }

            var Data = {
                _id: ID,
                IsStarred: true,
                // IsFocusedPage: true,
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
                    if (isstarActive == true) {
                        GetAllInboxList(ClientID, UserID, Page, 0, "SeenEmails", "IsStarredEmails")
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
                        })

                    }

                }
            });
        }
    }

    const handleKeyDown = (e, index) => {
        // console.log("e", e.key)
        // console.log("index", index)
        if (e.key === 'ArrowUp') {
            index--;
            scrollToSelectedRow(index, 1)

            setSelectedRowIndex((prevIndex) => Math.max(prevIndex - 1, 0));

        } else if (e.key === 'ArrowDown') {
            index++;
            scrollToSelectedRow(index, 1);
            setSelectedRowIndex((prevIndex) =>
                Math.min(prevIndex + 1, AllInboxList.length - 1)
            );
        }
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (index >= 0 && index < AllInboxList.length) {
                const selectedMessage = AllInboxList[index];
                // console.log("Selected message _id:", selectedMessage._id);
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
            <div className='lefter'>
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
                                                <TableCell component="th">Subject</TableCell>
                                                <TableCell component="th">From Email</TableCell>
                                                <TableCell component="th">Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {AllInboxList?.map((item, index) => {
                                                var fullName = item.FromName;
                                                var cleanedName = fullName.replace(/<[^>]+>/, "");
                                                cleanedName.trim();
                                                var labelColor = "";
                                                return (
                                                    <TableRow accountid={item.AccountID} messageid={item._id} isseen={item?.IsSeen.toString()} isstarred={item?.IsStarred.toString()} onContextMenu={OpenMessage?.length == 0 ? "" : OpenMessage?.IsTrash ? "" : handleContextMenu}
                                                        style={{ cursor: 'context-menu' }}
                                                        key={item.name}
                                                        className={`${selectedRowIndex === index ? 'selected-row' : ''} ${item?.IsSeen ? "useen-email" : "seen-email"}`}
                                                        onClick={() => setSelectedRowIndex(index)}
                                                        id={"row-" + index}

                                                    >
                                                        <TableCell style={{ color: labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : "" }} onClick={() => OpenMessageDetails(item._id, index, "updatelist")} scope="row"> {item?.Subject ? (
                                                            <>
                                                                {item.Subject.split(' ').slice(0, 8).join(' ')}
                                                                {item.Subject.split(' ').length > 8 ? '...' : ''}
                                                            </>
                                                        ) : null}</TableCell>
                                                        <TableCell style={{ color: labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : "" }} onClick={() => OpenMessageDetails(item._id, index, 'updatelist')} scope="row"> {cleanedName + " " + "(" + item.FromEmail + ")"}</TableCell>
                                                        <TableCell style={{ color: labelColor != CommonConstants.DEFAULTLABELCOLOR ? labelColor : "" }} onClick={() => OpenMessageDetails(item._id, index, "updatelist")}>{Moment(item.MessageDatetime).format("MM/DD/YYYY hh:mm a")}</TableCell>
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
                                                    <label><b>To : </b>
                                                        {OpenMessage?.ToNameEmail?.length > 1 ?
                                                            OpenMessage?.ToNameEmail?.map((e, index) => e.Email)?.join(', ').split(', ')[0]
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
                                                    </label>

                                                    {
                                                        OpenMessage?.CcNameEmail?.length > 0 ?
                                                            <label>
                                                                <b>CC : </b>
                                                                {OpenMessage?.CcNameEmail?.length > 1 ?
                                                                    OpenMessage?.CcNameEmail?.map((e, index) => e.Email)?.join(', ').split(', ')[0]
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
                                                                {OpenMessage?.BccNameEmail?.length > 1 ?
                                                                    OpenMessage?.BccNameEmail?.map((e, index) => e.Email)?.join(', ').split(', ')[0]
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
                                            <label>{Moment(OpenMessage.MessageDatetime).format("MM/DD/YYYY hh:mm A")}</label>
                                        </div>
                                        {
                                            <ButtonGroup className='iconsboxcd' variant="text" aria-label="text button group">
                                                <Button>
                                                    <label>{MailNumber} / {AllInboxList.length}</label>
                                                </Button>
                                            </ButtonGroup>
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <Frame className='emailbodybox' width="100%" ><div dangerouslySetInnerHTML={{ __html: OpenMessage.HtmlBody }}></div></Frame>
                        </div>
                    </SplitPane>
                </div>
            </div>
        </>
    );
}