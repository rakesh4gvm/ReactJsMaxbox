import React, { useRef, useEffect } from 'react';  

import { Nav } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'; 
import Mlogo from "../../images/Logo-w.png";

import { history } from '../../_helpers/history';




export default function Header() { 

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef); 

    const Register=()=>{
        history.push('/Register');
      }
    
 const Login=()=>{
        history.push('/Login');
      }
    
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

	
  return (
      <>
        <header className='header-white'>
            <div className='sm-container'>
                <Navbar expand="lg">
                        <div className='left'>
                            <Navbar.Brand href="#home">
                                <img className='imglogos' src={Mlogo} />
                            </Navbar.Brand>
                        </div>

                        <div className='menulist right'> 
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className='mobile-nav'>
                        <Nav className="me-auto dropdec">  
                            <NavDropdown.Item href="#">
                                Home
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="#">
                                About
                            </NavDropdown.Item> 
                            <NavDropdown.Item href="#">
                                Contact
                            </NavDropdown.Item> 
                            {window.location.pathname.toString() != "/"?
                            <NavDropdown.Item onClick={Login}>
                                Login
                            </NavDropdown.Item>:'' }
                            <NavDropdown.Item onClick={Register}>
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
