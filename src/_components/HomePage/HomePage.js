import * as React from 'react'; 
import { Col, Row } from 'react-bootstrap';
import HeaderTop from '../Header/header';

import InboxList from '../InboxListPage/InboxListPage'
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import ButtonGroup from '@mui/material/ButtonGroup'; 
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

export default function HomePage() {
    const [selected, setSelected] = React.useState(false);
   
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
            <Row className='bt-border pb-4 mb-4'>
              <Col lg={6}> 
                <Row className='userlist'>
                    <Col xs={2}>
                      <span className="inboxuserpic">
                          <img src={inboxuser3} width="63px" alt="" />
                      </span>
                    </Col>
                    <Col xs={10} className='p-0'> 
                      <h5>Chelsia Donald</h5>
                      <h6>Lenovo has a new policy</h6> 
                    </Col> 
                </Row>
              </Col>
              <Col lg={6} Align="right"> 
                <ButtonGroup className='iconlistinbox' variant="text" aria-label="text button group">
                <Button>
                    <img src={iconleftright} />
                  </Button>
                  <Button>
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
              <Col> 
                 <img src={inboximg1} />
              </Col>

              <Col> 
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
        
        </Col>

      </Row> 
    </div>
    </>
    );
}