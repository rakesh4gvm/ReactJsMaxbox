import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";

import { Select } from '@material-ui/core';
import { Alert, Stack } from '@mui/material';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Mlogo from "../../images/Logo.png";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuItem from '@material-ui/core/MenuItem';

import allusers from '../../images/all_users.svg';
import defaultimage from '../../images/default.png';
import iconlogout from '../../images/icon_logout.svg';
import inbox from '../../images/icons/inbox.svg';
import menustart from '../../images/icons/menustart.svg';
import drafts from '../../images/icons/drafts.svg';
import chatquestion from '../../images/icons/chatquestion.svg';
import spam from '../../images/icons/spam.svg';
import timermenu from '../../images/icons/timermenu.svg';
import Chatmail from '../../images/icons/chat-mail.svg';
import Sent from '../../images/icons/sent.svg';
import Objectroup from '../../images/icons/object-group.svg';
import Carbontem from '../../images/icons/carbontem.svg';
import { Nav } from 'react-bootstrap';
import { history } from "../../_helpers";
import { CommonConstants } from "../../_constants/common.constants"
import { ResponseMessage } from "../../_constants/response.message";
import { UpdateUserDetails, GetUserDetails, Logout } from '../../_helpers/Utility'
import EditIcon from '@material-ui/icons/Edit';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();


function UseOutsideAlerter(ref) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                const element = document.getElementById("id_userbox")
                element.classList.remove("show");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default function Header() {
    const [ClientDropdown, SetClientDropdown] = useState([])
    const [SelectedClient, SetSelectedClient] = useState([]);
    const [UserImage, SetUserImage] = useState()
    const [UserDetails, SetUserDetails] = useState();
    const [Show, SetShow] = useState(true)
    const [ClientID, SetClientID] = React.useState(0);
    const [UserID, SetUserID] = React.useState(0);
    const [AllTotalRecords, SetAllTotalRecords] = useState()

    useEffect(() => {
        GetClientID()
        const TimeID = setTimeout(() => {
            SetShow(false)
        }, 3000)
        return () => {
            clearTimeout(TimeID)
        }
    }, []);

    // Get ClientID
    const GetClientID = () => {
        var UserDetails = GetUserDetails();
        if (UserDetails != null) {
            SetClientID(UserDetails.ClientID);
            SetUserID(UserDetails.UserID);
        }
        GetAllTotalCount(UserDetails.ClientID, UserDetails.UserID)
    }

    const GetAllTotalCount = (CID, UID) => {
        const Data = {
            ClientID: CID,
            UserID: UID,
        }
        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/receive_email_history/AllTotalRecords",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                SetAllTotalRecords(Result.data)
            } else {
                toast.error(Result?.data?.Message);
            }
        });
    }

    useEffect(() => {
        GetClientDropdown()
    }, [SetSelectedClient])

    // Select Client
    const SelectClient = (e) => {
        SetSelectedClient(e.target.value)
        UpdateUserDetails(e.target.value)
        window.location.reload(false);
    }

    // Get Client Dropdown
    const GetClientDropdown = () => {
        var UserID
        var Details = GetUserDetails();
        if (Details != null) {
            UserID = Details.UserID
            SetUserImage(Details.UserImage)
        }
        var Data = {
            UserID: UserID,
        }
        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/client/GetClientListForTopDropDown",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (Result.data.Data.length > 0) {
                    SetClientDropdown(Result.data.Data);
                    if (Details.ClientID == null) {
                        UpdateUserDetails((Result.data.Data[0].ClientID))
                        SetSelectedClient(Result.data.Data[0]._id)
                    }
                    else {
                        SetSelectedClient(Details.ClientID)
                    }
                }
            } else {
                toast.error(Result?.data?.Message);
            }
        });
    }

    // Open Pop User Details
    const OpenPopupUserDetails = () => {
        var UserID
        var ClientID
        var Details = GetUserDetails();
        if (Details != null) {
            UserID = Details.UserID
            ClientID = Details.ClientID
        }
        var Data = {
            ClientID: ClientID,
            UserID: UserID
        }

        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/user/AccountUserDetailsGetByID",
            method: "POST",
            data: Data,
        });
        ResponseApi.then((Result) => {
            if (Result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (Result.data.Data.length > 0) {
                    SetUserDetails(Result.data.Data[0])
                    const Element = document.getElementById("id_userbox")
                    if (Element.classList.contains("show")) {
                        Element.classList.remove("show");
                    }
                    else {
                        Element.classList.add("show");
                    }
                }
                else {
                    const Element = document.getElementById("id_userbox")
                    if (Element.classList.contains("show")) {
                        Element.classList.remove("show");
                    }
                    else {
                        Element.classList.add("show");
                    }
                }
            } else {
                toast.error(Result?.data?.Message);
            }
        });
    }

    // SignOut
    const SignOut = () => {
        Logout();
    }

    // OPen Pge
    const OpenPage = (PageName) => {
        history.push(PageName);
    }

    const WrapperRef = useRef(null);
    UseOutsideAlerter(WrapperRef);

    return (
        <>
            <header className='header-main'>
                <Navbar expand="lg">
                    <div className='left'>
                        <Navbar.Brand href="#home">
                            <img src={Mlogo} />
                        </Navbar.Brand>
                    </div>
                    <div className='menulist right'>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className='mobile-nav'>
                            <Nav className="me-auto dropdec">
                                <NavDropdown title="Inbox" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => OpenPage("/UnansweredResponses")}>
                                        <img src={chatquestion} />Unanswered Responses
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllUnansweredResponsesCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/Starred")}><img src={menustart} />Starred
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllStarredCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/FollowUpLater")}><img src={timermenu} />Follow Up Later
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllFollowUpLaterCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/Drafts")}><img src={drafts} />Drafts
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllDraftCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/OtherInboxPage")}><img src={inbox} />Other Inbox
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllOtherInboxCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/Spam")} ><img src={spam} />Spam
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllSpamCount}
                                        </div>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Sent" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/UnansweredReplies">
                                        <img src={Chatmail} />Unanswered Replies
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllSentEmailsCount}
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/AllSentEmails")}><img src={Sent} />All Sent Emails
                                        <div className="notifimen">
                                            <NotificationsIcon /> {AllTotalRecords?.AllSentEmailsCount}
                                        </div>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Templates" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => OpenPage("/ObjectionTemplate")}>
                                        <img src={Objectroup} />Objections
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/Templates")}>
                                        <img src={Carbontem} />Templates
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Settings" id="basic-nav-dropdown">
                                    <NavDropdown.Item onClick={() => OpenPage("/EmailConfiguration")} >
                                        <img src={Objectroup} />Email Configuration
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/ClientList")}>
                                        <img src={Carbontem} />Client
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <div class="selecter-m mx-4">
                                    {ClientDropdown &&
                                        ClientDropdown.length > 0 ?
                                        <>
                                            <Select labelId="demo-simple-select-label" id="clientid" value={SelectedClient} onChange={SelectClient} >
                                                {ClientDropdown?.map((row) => (
                                                    <MenuItem value={row?.ClientID}>{row?.Name}</MenuItem>
                                                ))}
                                            </Select>
                                        </>
                                        :
                                        <>
                                            <Select labelId="demo-simple-select-label" id="clientid" value={SelectedClient} onChange={SelectClient} disabled >
                                                {ClientDropdown?.map((row) => (
                                                    <MenuItem value={row?.ClientID}>{row?.Name}</MenuItem>
                                                ))}
                                            </Select>
                                            <div className='erorr-msg'>
                                                {
                                                    Show && <Stack sx={{ width: '100%' }} spacing={2}>
                                                        <Alert severity="error">   <strong> Sorry!</strong> No Client To Display</Alert>
                                                    </Stack>
                                                }
                                            </div>
                                        </>
                                    }
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                        <div className="dropboxcard ml-3">

                            <a href="#" className="" onClick={OpenPopupUserDetails}>
                                <span className="userpic">
                                    {UserImage !== undefined ? <img src={UserImage} width="50px" alt="" /> : <img src={defaultimage} width="50px" alt="" />}
                                </span>
                            </a>

                            <div className="userdropdown" id="id_userbox" ref={WrapperRef}>
                                <div className="bg-themehead">
                                    <a href="/ProfileSetting" className='editprofile'><EditIcon /></a>
                                    <span className="userpic us-max-110">
                                        {UserImage !== undefined ? <img src={UserImage} width="110px" alt="" /> : <img src={defaultimage} width="110px" alt="" />}
                                    </span>
                                    <div className="carduser_details">
                                        <h4>{UserDetails != undefined ? UserDetails.FirstName + " " + UserDetails.LastName : ""}</h4>
                                        <a href="/ProfileSetting">{UserDetails != undefined ? UserDetails.Email : ""}</a>
                                    </div>
                                </div>
                                <div className="bodyuserdop textdeclist">
                                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={allusers} />
                                            </ListItemAvatar>
                                            <div className='pt-3'>
                                                <h5>All User</h5>
                                            </div>
                                        </ListItem>

                                        <Divider variant="inset" component="li" />
                                        {UserDetails == undefined ? "" : UserDetails.EmailAccount.map((row) => (

                                            <ListItem alignItems="flex-start">
                                                <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={row.FirstName + " " + row.LastName}
                                                    secondary={
                                                        <React.Fragment>
                                                            {row.Email}
                                                        </React.Fragment>
                                                    }
                                                />
                                                <ul className='d-flex flexlist'>
                                                    <li><a href=''><img src={Chatmail} /><span className='orange'>10</span></a></li>
                                                    <li><a href=''><img src={Chatmail} /><span className='blue'>10</span></a></li>
                                                </ul>
                                            </ListItem>
                                        ))}

                                        <ListItem alignItems="flex-start" >
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" src={iconlogout} className='max-40' />
                                            </ListItemAvatar>
                                            <div className='pt-3 pb-2' onClick={SignOut}>
                                                <h5>Logout</h5>
                                            </div>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>
                        </div>
                    </div>
                </Navbar>
            </header>
        </>
    );
}
