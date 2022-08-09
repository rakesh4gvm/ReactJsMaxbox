import React, { useRef,useState, useEffect } from 'react';  
import Axios from "axios";
// import Select from 'react-select'
import { Select } from '@material-ui/core';
import { Col, Container, Form, Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'; 
import Mlogo from "../../images/Logo.png";
import defaultuser from '../../images/avatar/defaultuser.jpg';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';  
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import allusers from '../../images/all_users.svg';
import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser2 from '../../images/avatar/2.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import inboxuser4 from '../../images/avatar/4.jpg';
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

import { CommonConstants } from "../../_constants/common.constants"
import { ResponseMessage } from "../../_constants/response.message";
import { SaveClientDetails, UpdateUserDetails, GetUserDetails } from '../../_helpers/Utility'


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

const addShowClass = () => {
    const element = document.getElementById("id_userbox")
    if(element.classList.contains("show")){
      element.classList.remove("show");
    }
    else{
      element.classList.add("show");
    }
  };

export default function Header() { 
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef); 

    const [ClientDropdown, SetClientDropdown] = useState([])
    const [SelectedClient, SetSelectedClient] = useState([]);

   
    const SelectClient = (e) => {
        SetSelectedClient(e.target.value)
        SaveClientDetails(e.target.value)
    }
 
    

    useEffect(() => {
        getClientListForDropdown()
    }, [SetSelectedClient])

    const getClientListForDropdown = () => {
        var data = {
            UserID: "62da32ea6874d926c02a8472",
        }
        const responseapi = Axios({
            url: CommonConstants.MOL_APIURL + "/client/GetClientListForTopDropDown",
            method: "POST",
            data: data,
        });
        responseapi.then((result) => {
            
            if (result.data.StatusMessage == ResponseMessage.SUCCESS) {
              
                SetClientDropdown(result.data.Data);
                SetSelectedClient(result.data.Data[0]._id)
            }
        });
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
                                    <NavDropdown.Item href="/UnansweredResponses">
                                        <img src={chatquestion} />Unanswered Responses
                                        <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/Starred"><img src={menustart} />Starred
                                    <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="/FollowUpLater"><img src={timermenu} />Follow Up Later
                                    <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item> 
                                    <NavDropdown.Item href="/Drafts"><img src={drafts} />Drafts
                                    <div className="notifimen">
                                            <NotificationsIcon /> 235
                                        </div>
                                    </NavDropdown.Item> 
                                    <NavDropdown.Item href="/OtherInbox"><img src={inbox} />Other Inbox
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
                                    <NavDropdown.Item href="#action/6.1">
                                        <img src={Objectroup} />Objections
                                    </NavDropdown.Item>
                                    <NavDropdown.Item href="#action/6.2">
                                        <img src={Carbontem} />Templates
                                    </NavDropdown.Item> 
                                </NavDropdown>

                                <div class="selecter-m mt-2 mx-4">
                                    {/* <Select  value={options.value}  options={options}   defaultValue={options[1]} /> */}

              
            
            
             <Select labelId="demo-simple-select-label" id="clientid"     value={SelectedClient} onChange={SelectClient} >
                                        {ClientDropdown?.map((row) => (
                                            <MenuItem value={row?.ClientID}>{row?.Name}</MenuItem>
                                        ))}
                                    </Select>
                                  
          {/* </FormControl> */}
                                </div>

 
                        </Nav>
                        
                        </Navbar.Collapse>
                        <div className="dropboxcard ml-3">
                                    <a href="#" className="" onClick={addShowClass}>
                                        <span className="userpic">
                                            <img src={defaultuser} width="53px" alt="" />
                                        </span>
                                    </a>

                                    <div className="userdropdown" id="id_userbox" ref={wrapperRef}>
                                        <div className="bg-themehead">
                                        <span className="userpic us-max-110">
                                            <img src={defaultuser} width="110px" alt="" />
                                        </span>
                                            <div className="carduser_details">
                                                <h4>Yash Donald</h4>
                                                <a href="">yashdonald@gmail.com</a>
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
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src={inboxuser1} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                    primary="Brunch this weekend?"
                                                    secondary={
                                                        <React.Fragment>
                                                         jennyoswald1998@gmail.com
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
                                                <Divider variant="inset" component="li" /> 
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                    <Avatar alt="Remy Sharp" src={iconlogout} className='max-40' />
                                                    </ListItemAvatar> 
                                                    <div className='pt-3 pb-2'>
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
