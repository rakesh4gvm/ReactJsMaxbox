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
        <header className='header-white'>
            <div className='sm-container'>
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
                            <NavDropdown.Item href="/">
                                Home
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="/">
                                About
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="/">
                                Contact
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="/">
                                Login
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="/">
                                Register
                            </NavDropdown.Item>  
                        </Nav> 
                        </Navbar.Collapse> 
                    </div>
                </Navbar>
            </div>
        </header>
     </>
  );
}
