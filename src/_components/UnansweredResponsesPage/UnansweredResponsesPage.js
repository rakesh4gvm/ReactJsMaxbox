import * as React from 'react'; 
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';

import InboxList from '../InboxListPage/InboxListPage'
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TextareaAutosize } from '@mui/material'; 
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser2 from '../../images/avatar/2.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import inboxuser4 from '../../images/avatar/4.jpg';
import inboximg1 from '../../images/inboximg1.jpg';
import inboximg2 from '../../images/inboximg2.jpg';

import iconleftright from '../../images/icon_left_right.svg';
import iconstar from '../../images/icon_star.svg';
import icontimer from '../../images/icon_timer.svg';
import iconsarrow1 from '../../images/icons_arrow_1.svg';
import iconsarrow2 from '../../images/icons_arrow_2.svg';
import icondelete from '../../images/icon_delete.svg';
import iconmenu from '../../images/icon_menu.svg'; 
import replyall from '../../images/icons/reply_all.svg';
import attachment from '../../images/icons/attachment.svg'; 
import text_font from '../../images/icons/text_font.svg'; 
import image_light from '../../images/icons/image_light.svg'; 
import smiley_icons from '../../images/icons/smiley_icons.svg'; 
import signature from '../../images/icons/signature.svg'; 
import link_line from '../../images/icons/link_line.svg'; 
import google_drive from '../../images/icons/google_drive.svg'; 
import Emailinbox from '../../images/email_inbox_img.png'; 
import Emailcall from '../../images/email_call_img.png'; 

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


export default function UnansweredResponsesPage({ children }) {
    const [selected, setSelected] = React.useState(false);

    const addShowCompose = () => {
      const element = document.getElementById("UserCompose")
      if(element.classList.contains("show")){
        element.classList.remove("show");
      }
      else{
        element.classList.add("show");
      }
    };
    const [open, setOpen] = React.useState(false);
    const [openone, setOpenone] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenOne = () => setOpenone(true);
    const handleCloseOne = () => setOpenone(false);

    const [value, setValue] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleChange = (newValue) => {
      setValue(newValue);
    };

return (
    <>
    <HeaderTop />  
  
    <div className='bodymain'>
        <Row className='mb-columfull'>
        <Col className='maxcontainerix'>
            <InboxList />  
        </Col>


        <Col className='rightinbox'>
          <div className='inxtexteditor'>
            <Row className='bt-border pb-4 mb-4 colsm12'>
              <Col lg={6}>  
                <Row className='userlist'>
                    <Col xs={2}> 
                      <span className="inboxuserpic">
                          <img src={inboxuser3} width="63px" alt="" />
                      </span>
                    </Col>
                    <Col xs={10} className='p-0'> 
                      <h5>Chelsia Donald</h5>
                      <h6>to me <KeyboardArrowDownIcon /></h6> 
                    </Col> 
                </Row>
              </Col>
              <Col lg={6} Align="right"> 
                <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                  <Button onClick={handleOpen}>
                    <img src={iconleftright} />
                  </Button>
                  <Button onClick={handleOpenOne}>
                    <label>56 / 100</label>
                  </Button>
                  <Button>
                    <img src={iconstar} />
                  </Button>
                  <Button>
                    <img src={icontimer} />
                  </Button> 
                  <Button>
                    <img src={iconsarrow2} />
                  </Button>
                  <Button>
                    <img src={iconsarrow1} />
                  </Button>
                  <Button>
                    <img src={icondelete} />
                  </Button>
                  <Button>
                    <img src={iconmenu} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>


            <Row className='mb-3'>
              <Col> 
                  <h2>Reiciendis voluptatibus maiores </h2> 
              </Col>
              <Col> 
                  <h6>20 Jun 2022, 09:44 (2 days ago)</h6> 
              </Col>
            </Row>

            <Row>
              <Col> 
                <p>
                  Hi Yash, <br/>
                  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse sit amet faucibus odio. Duis id venenatis dui. Donec hendrerit imperdiet euismod. Praesent ullamcorper mollis massa, a dapibus eros mattis eget. Sed ornare vestibulum libero, vitae hendrerit tellus condimentum sollicitudin. Donec molestie eros ut sagittis porta.
                  </p>
                  <p>Proin mi mauris, ultrices sed pellentesque ut, suscipit sit amet neque. Vivamus porta leo sed urna feugiat, sed gravida dui luctus. Nam sit amet ligula quis lectus condimentum malesuada. Nunc posuere molestie urna ac semper. </p>
                  <p>Ut elementum sapien et porttitor porta. Nunc at mollis est, finibus luctus sem. Curabitur semper molestie tortor quis condimentum. </p>
                  <p>Curabitur ac feugiat libero. Fusce ut lectus quis mi rutrum blandit sit amet sit amet elit. </p>
                  <p>Thank You.</p>
                  </Col>
            </Row>

            <Row>
              <Col className='py-2'> 
                 <img src={inboximg1} />
              </Col>

              <Col className='py-2'> 
                <img src={inboximg2} />
              </Col>
              <Col>  
              </Col>
            </Row>

            <div className='d-flex mt-5 ml-2'>
              <Row>
                <Col sm={6} className='p-0'>
                  <a href='#' className='p-2'><img src={iconsarrow1} /></a>
                </Col>
                <Col sm={6} className='p-0'>
                <a href='#' className='p-2'><img src={iconsarrow2} /></a>
                </Col>
              </Row>
            </div>

          </div>


          <div className='replaybox'>
            
            <Row className='pb-4 mb-2 colsm12'>
              <Col lg={6}> 
                <Row className='userlist'>
                    <Col xs={2}>
                      <span className="inboxuserpic">
                          <img src={inboxuser1} width="63px" alt="" />
                      </span>
                    </Col>
                    <Col xs={10} className='p-0'> 
                      <h5>Fanny Champair</h5>
                      <h6>to me <KeyboardArrowDownIcon /></h6> 
                    </Col> 
                </Row>
              </Col>
              <Col lg={6} Align="right">  
                <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group"> 
                  <Button>
                    <label>21 Jun 2022, 13:15 (1 days ago)</label>
                  </Button>
                  <Button>
                    <img src={iconstar} />
                  </Button>
                  <Button>
                    <img src={iconsarrow2} />
                  </Button>
                  <Button>
                    <img src={iconmenu} />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row> 
            
            <Row> 
              <Col> 
                <p>
                  Hi Yash, <br/>
                  Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse sit amet faucibus odio. Duis id venenatis dui. Donec hendrerit imperdiet euismod. Praesent ullamcorper mollis massa, a dapibus eros mattis eget. Sed ornare vestibulum libero, vitae hendrerit tellus condimentum sollicitudin. Donec molestie eros ut sagittis porta.
                  </p>
                  <p>Proin mi mauris, ultrices sed pellentesque ut, suscipit sit amet neque. Vivamus porta leo sed urna feugiat, sed gravida dui luctus. Nam sit amet ligula quis lectus condimentum malesuada. Nunc posuere molestie urna ac semper. </p>
                  <p>Ut elementum sapien et porttitor porta. Nunc at mollis est, finibus luctus sem. Curabitur semper molestie tortor quis condimentum. </p>
                  <p>Curabitur ac feugiat libero. Fusce ut lectus quis mi rutrum blandit sit amet sit amet elit. </p>
                  <p>Thank You.</p>
              </Col>
            </Row>


            <div className='replaybox'> 
              <Row className='pb-4 mb-2 colsm12'>
                <Col lg={6}> 
                  <Row className='userlist'>
                      <Col xs={2}>
                        <span className="inboxuserpic">
                            <img src={inboxuser4} width="63px" alt="" />
                        </span>
                      </Col>
                      <Col xs={10} className='p-0'> 
                        <h5>Fanny Champair</h5>
                        <h6>to me <KeyboardArrowDownIcon /></h6> 
                      </Col> 
                  </Row>
                </Col>
                <Col lg={6} Align="right">  
                  <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group"> 
                    <Button>
                      <label>21 Jun 2022, 13:15 (1 days ago)</label>
                    </Button>
                    <Button>
                      <img src={iconstar} />
                    </Button>
                    <Button>
                      <img src={iconsarrow2} />
                    </Button>
                    <Button>
                      <img src={iconmenu} />
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row> 
              
              <Row> 
                <Col> 
                  <p>
                    Hi Yash, <br/>
                    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse sit amet faucibus odio. Duis id venenatis dui. Donec hendrerit imperdiet euismod. Praesent ullamcorper mollis massa, a dapibus eros mattis eget. Sed ornare vestibulum libero, vitae hendrerit tellus condimentum sollicitudin. Donec molestie eros ut sagittis porta.
                    </p>
                    <p>Proin mi mauris, ultrices sed pellentesque ut, suscipit sit amet neque. Vivamus porta leo sed urna feugiat, sed gravida dui luctus. Nam sit amet ligula quis lectus condimentum malesuada. Nunc posuere molestie urna ac semper. </p>
                    <p>Ut elementum sapien et porttitor porta. Nunc at mollis est, finibus luctus sem. Curabitur semper molestie tortor quis condimentum. </p>
                    <p>Curabitur ac feugiat libero. Fusce ut lectus quis mi rutrum blandit sit amet sit amet elit. </p>
                    <p>Thank You.</p>
                </Col>
              </Row> 

              <div className='d-flex mt-5 ml-2 replayallbox'>
                <Row>
                  <Col xs={4} className='p-0'>
                    <a href='#' className='p-2'><img src={iconsarrow1} /></a>
                  </Col>
                  <Col xs={4} className='p-0'>
                    <a href='#' className='p-2'><img src={replyall} /></a>
                  </Col>
                  <Col xs={4} className='p-0'>
                  <a href='#' className='p-2'><img src={iconsarrow2} /></a>
                  </Col>
                </Row>
              </div>
            

              <div className='user_editor mt-5'>
                <Row className='userlist'>
                    <Col className='fixwidleft'>
                      <span className="inboxuserpic">
                          <img src={inboxuser1} width="63px" alt="" />
                      </span>
                    </Col>
                    <Col className='fixwidright p-0'> 
                      <div className='editorboxcard'>
                        <Row className='edittoprow p-2'>
                            <Col className='d-flex hedtopedit'>
                              <a href='#' className='p-1'><img src={iconsarrow2} /></a> 
                              <h6><KeyboardArrowDownIcon /></h6> 
                              <label>Barbara Buchhainan (barbarabuchhainan@gmail.com)</label>
                            </Col> 
                        </Row>
                        <Row className='px-2'>
                            <Col className='bodyeditor'>
                              <TextareaAutosize className='w-100'
                                aria-label="minimum height"
                                minRows={3}
                                placeholder="" 
                              />
                            </Col> 
                        </Row>

                        <div className='ftcompose px-3'>
                          <Row className='px-3'>
                              <Col xs={10} className='px-0'>
                                <ButtonGroup className='ftcompose-btn' variant="text" aria-label="text button group">
                                  <Button variant="contained btn btn-primary smallbtn"> Send</Button>
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
                                    <img src={google_drive} />
                                  </Button>  
                                  <Button>
                                    <img src={link_line} />
                                  </Button>    
                                  <Button>
                                    <img src={signature} />
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
                    </Col> 
                </Row>
              </div>
          
            </div>

          </div>
        
        </Col> 
      </Row> 
    </div>
    <Compose />
    </>
    );
}