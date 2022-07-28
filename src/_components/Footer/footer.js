import React, { useRef, useEffect } from 'react';  
import Select from 'react-select'
import { Col, Container, Form, Nav, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'; 
import Mlogo from "../../images/Logo.png";
import defaultuser from '../../images/avatar/defaultuser.jpg';
import { Link } from 'react-router-dom';
 
 
export default function Footer() { 
  
  return (
      <>
       <div className='footer-main'>
        <Row>
            <Col sm={6}>
                <p>©Maxbox 2022. All Rights Reserved. </p>
            </Col>
            <Col sm={6} align='right'>
                <Link>Term & Privacy Policy.</Link>
            </Col>
        </Row>
       </div>
     </>
  );
}
