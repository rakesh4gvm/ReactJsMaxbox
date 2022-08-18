import React, { useRef, useState, useEffect } from 'react';
import Axios from "axios";

import { Select } from '@material-ui/core';
import { Col, Container, Form, Nav } from 'react-bootstrap';
import Button from '@mui/material/Button';
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
import inboxuser1 from '../../images/avatar/1.jpg';
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

import { history } from "../../_helpers";
import { CommonConstants } from "../../_constants/common.constants"
import { ResponseMessage } from "../../_constants/response.message";
import { UpdateUserDetails, GetUserDetails, Logout } from '../../_helpers/Utility'


function useOutsideAlerter(ref) {
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
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    const [ClientDropdown, SetClientDropdown] = useState([])
    const [SelectedClient, SetSelectedClient] = useState([]);
    const [UserImage, SetUserImage] = useState()
    const [UserDetails, SetUserDetails] = useState();

    useEffect(() => {
        GetClientDropdown()
    }, [SetSelectedClient])

    const SelectClient = (e) => {
        SetSelectedClient(e.target.value)
        UpdateUserDetails(e.target.value)
        window.location.reload(false);
    }

    const GetClientDropdown = () => {
        var UserID
        var Details = GetUserDetails();
        if (Details != null) {
            UserID = Details.UserID
            SetUserImage(Details.UserImage)
        }
        var data = {
            UserID: UserID,
        }
        const responseapi = Axios({
            url: CommonConstants.MOL_APIURL + "/client/GetClientListForTopDropDown",
            method: "POST",
            data: data,
        });
        responseapi.then((result) => {
            if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (result.data.Data.length > 0) {
                    SetClientDropdown(result.data.Data);
                    if (Details.ClientID == null) {
                        UpdateUserDetails((result.data.Data[0].ClientID))

                        SetSelectedClient(result.data.Data[0]._id)
                    }
                    else {
                        SetSelectedClient(Details.ClientID)
                    }
                }
            }
        });
    }

    const OpenPopupUserDetails = () => {
        debugger;
        var UserID
        var Details = GetUserDetails();
        if (Details != null) {
            UserID = Details.UserID
        }
        var data = {
            UserID: UserID,
        }

        const ResponseApi = Axios({
            url: CommonConstants.MOL_APIURL + "/user/AccountUserDetailsGetByID",
            method: "POST",
            data: data,
        });
        ResponseApi.then((result) => {
            debugger;
            if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
                if (result.data.Data.length >0) {
                    SetUserDetails(result.data.Data[0])
                    const element = document.getElementById("id_userbox")
                    if (element.classList.contains("show")) {
                        element.classList.remove("show");
                    }
                    else {
                        element.classList.add("show");
                    }

                }
            }
        });
    }
    const SignOut = () => {
        Logout();
    }
    const OpenPage = (PageName) => {
        history.push(PageName);
    }

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
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/Starred")}><img src={menustart} />Starred
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/FollowUpLater")}><img src={timermenu} />Follow Up Later
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/Drafts"><img src={drafts} />Drafts
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => OpenPage("/OtherInboxPage")}><img src={inbox} />Other Inbox
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/Spam"><img src={spam} />Spam
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                </NavDropdown>

                                <NavDropdown title="Sent" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/4.1">
                                        <img src={Chatmail} />Unanswered Replies
                                        <div className="notifimen">
                                            <NotificationsIcon /> 43
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/4.2"><img src={Sent} />All Sent Emails
                                        <div className="notifimen">
                                            <NotificationsIcon /> 245
                                        </div>
                                    </NavDropdown.Item>
                                </NavDropdown>


                                <NavDropdown title="Templates" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="#action/5.1">
                                        <img src={Objectroup} />Objections

                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/Templates">
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
                                    <Select labelId="demo-simple-select-label" id="clientid" value={SelectedClient} onChange={SelectClient} >
                                        {ClientDropdown?.map((row) => (
                                            <MenuItem value={row?.ClientID}>{row?.Name}</MenuItem>
                                        ))}
                                    </Select>
                                </div>


                            </Nav>

                        </Navbar.Collapse>
                        <div className="dropboxcard ml-3">
                            <a href="#" className="" onClick={OpenPopupUserDetails}>
                                <span className="userpic">
                                    {UserImage !== undefined ? <img src={UserImage} width="50px" alt="" /> : <img src={defaultimage} width="50px" alt="" />}
                                </span>
                            </a>

                            <div className="userdropdown" id="id_userbox" ref={wrapperRef}>
                                <div className="bg-themehead">
                                    <span className="userpic us-max-110">
                                        {UserImage !== undefined ? <img src={UserImage} width="110px" alt="" /> : <img src={defaultimage} width="110px" alt="" />}
                                    </span>
                                    <div className="carduser_details">
                                        <h4>{UserDetails!= undefined ? UserDetails.FirstName + " " + UserDetails.LastName : ""}</h4>
                                        <a href="">{UserDetails != undefined ? UserDetails.Email : ""}</a>
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
                                        {UserDetails == undefined?"": UserDetails.EmailAccount.map((row) => (

                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Remy Sharp" />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={row.FirstName +" "+ row.LastName}
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
                                        {/* <Divider variant="inset" component="li" />
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Travis Howard" src={inboxuser2} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Summer BBQ"
                                                secondary={
                                                    <React.Fragment>
                                                        bryanEdwalds@gmail.com
                                                    </React.Fragment>
                                                }
                                            />
                                            <ul className='d-flex flexlist'>
                                                <li><a href=''><img src={Chatmail} /><span className='orange'>10</span></a></li>
                                                <li><a href=''><img src={Chatmail} /><span className='blue'>10</span></a></li>
                                            </ul>
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                        <ListItem alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt="Cindy Baker" src={inboxuser3} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary="Oui Oui"
                                                secondary={
                                                    <React.Fragment>
                                                        sallyrobbins@gmail.com
                                                    </React.Fragment>
                                                }
                                            />
                                            <ul className='d-flex flexlist'>
                                                <li><a href=''><img src={Chatmail} /><span className='orange'>10</span></a></li>
                                                <li><a href=''><img src={Chatmail} /><span className='blue'>10</span></a></li>
                                            </ul>
                                        </ListItem>
                                        <Divider variant="inset" component="li" /> */}
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
