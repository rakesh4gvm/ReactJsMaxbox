import React, { useRef, useEffect } from 'react'; 
import { ButtonGroup, Col, Row } from 'react-bootstrap';
 
import Button from '@mui/material/Button';

import Close from '../../images/icons/w-close.svg';
import Maximize from '../../images/icons/w-maximize.svg';
import Minimize from '../../images/icons/w-minimize.svg';
import { Input, TextareaAutosize } from '@mui/material';

import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';

import icondelete from '../../images/icons/icon_delete.svg';
import iconmenu from '../../images/icons/icon_menu.svg'; 


import attachment from '../../images/icons/attachment.svg'; 
import text_font from '../../images/icons/text_font.svg'; 
import image_light from '../../images/icons/image_light.svg'; 
import smiley_icons from '../../images/icons/smiley_icons.svg'; 
import signature from '../../images/icons/signature.svg'; 
import link_line from '../../images/icons/link_line.svg'; 
import template from '../../images/icons/template.svg'; 

function useOutsideAlerter(ref) {
  useEffect(() => { 
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        const element = document.getElementById("UserCompose") 
          element.classList.remove("show"); 
      }
    } 
    document.addEventListener("mousedown", handleClickOutside);
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}


export default function HomePage() {
    const [selected, setSelected] = React.useState(false);
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef); 

    const addShowCompose = () => {
      const element = document.getElementById("UserCompose")
      if(element.classList.contains("show")){
        element.classList.remove("show");
      }
      else{
        element.classList.add("show");
      } 
    };
   
return (
    <>
     
         
      <div className='composebody'> 
        <Button variant="contained btn btn-primary largbtn" onClick={addShowCompose}> + Compose</Button>

        <div className="usercompose" id="UserCompose" ref={wrapperRef}>
            <div className='hcompose px-3'>
              <Row>
                <Col><h4>New Message</h4></Col>
                <Col className='col text-right'>
                  <ButtonGroup variant="text" aria-label="text button group"> 
                    <Button>
                      <img src={Minimize} />
                    </Button>
                    <Button>
                      <img src={Maximize} />
                    </Button>
                    <Button onClick={addShowCompose}>
                      <img src={Close} />
                    </Button>
                  </ButtonGroup> 
                </Col>
              </Row> 
            </div>
            <div className='subcompose px-3 py-2'>
              <Row className='px-3'>
                  <Col xs={1} className="px-0">
                    <h6>To :</h6>
                  </Col>
                  <Col xs={9} className="px-0">
                    <Input className='input-clend' />
                  </Col>
                  <Col xs={2} className='col text-right d-flex'>
                    <Button className='lable-btn'>Cc</Button>
                    <Button className='lable-btn'>Bcc</Button>
                  </Col>
              </Row>
            </div>
            <div className='subcompose px-3 py-2'>
              <Row className='px-3'>
                  <Col xs={1} className="px-0">
                    <h6>Subject :</h6>
                  </Col>
                  <Col xs={11} className="px-0">
                    <Input className='input-clend' />
                  </Col> 
              </Row>
            </div>

            <div className='bodycompose'>
            <Row className='px-3 py-2'>
                <Col>
                  <TextareaAutosize className='w-100'
                    aria-label="minimum height"
                    minRows={3}
                    placeholder="" 
                  />
                </Col> 
              </Row>
            </div>

            <div className='ftcompose px-3'>
              <Row className='px-3'>
                  <Col xs={10} className='px-0'>
                    <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                      <Button variant="contained btn btn-primary smallbtn" onClick={addShowCompose}> Send</Button>
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
                        <img src={signature} />
                      </Button> 
                      <Button>
                        <img src={link_line} />
                      </Button> 
                      <Button>
                        <img src={template} />
                      </Button>  
                    </ButtonGroup>
                  </Col> 

                  <Col xs={2} className='px-0 text-right'>
                    <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group"> 
                      <Button>
                        <img src={icondelete} />
                      </Button> 
                      <Button>
                        <img src={iconmenu} />
                      </Button>  
                    </ButtonGroup>
                  </Col> 
              </Row>
            </div>
             

        </div>
      </div>
 
    </>
    );
}