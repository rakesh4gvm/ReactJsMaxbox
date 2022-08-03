import React, { useRef, useEffect } from 'react'; 
import { ButtonGroup, Col, Row } from 'react-bootstrap'; 
import HeaderTop from '../Header/header';
import Compose from '../ComposePage/ComposePage';
import Axios from "axios";

import Button from '@mui/material/Button';
import { TextareaAutosize } from '@mui/material';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'; 

import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@material-ui/icons/Search'; 
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import Stack from '@mui/material/Stack'; 
import ToggleButton from '@mui/material/ToggleButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';  
import inboxuser1 from '../../images/avatar/1.jpg';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton'; 
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import downarrow from '../../images/icon_downarrow.svg';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel'; 

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
 
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

import { CommonConstants } from "../../_constants/common.constants";
import { ResponseMessage } from "../../_constants/response.message";

function useOutsideAlerter(ref) {
  useEffect(() => { 
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        const element = document.getElementById("id_userboxlist") 
          element.classList.remove("show"); 
      }
    } 
    document.addEventListener("mousedown", handleClickOutside);
    return () => { 
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
const addInboxClass = () => {
  const element = document.getElementById("id_userboxlist")
  if(element.classList.contains("show")){
    element.classList.remove("show");
  }
  else{
    element.classList.add("show");
  }
};

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


export default function SpamPage({ OpenMessageDetails }) {
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


    const [InBoxList, SetInBoxList] = React.useState([]);

  
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [sortField, setsortField] = React.useState("FromName");
  const [sortedBy, setsortedBy] = React.useState(1);
  const [ClientID, setClientID] = React.useState(0);
  const [UserID, setUserID] = React.useState(0);
 

  useEffect(() => {


    GetInBoxList ();
  }, []);

// Start Get InBoxList
     const GetInBoxList = () => {
      debugger;
      var data = {
        Page: page,
        RowsPerPage: rowsPerPage,
        sort: true,
        Field: sortField,
        Sortby: sortedBy,
        Search: search,
        ClientID: ClientID,
        UserID: UserID,
        
      };
      const responseapi = Axios({
        url:CommonConstants.MOL_APIURL + "/receive_email_history/ReceiveEmailHistoryGet",
        method: "POST",
        data: data,
      });
      responseapi.then((result) => {
      
        if(result.data.StatusMessage==ResponseMessage.SUCCESS)
        {
          SetInBoxList(result.data.PageData);
        }
        
       
      });
    };
// End Get InBoxList 

    const [checked, setChecked] = React.useState([1]);

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
          paddingLeft: `calc(1em + ${theme.spacing(4)})`,
          transition: theme.transitions.create('width'),
          width: '100%',
          [theme.breakpoints.up('md')]: {
            width: '20ch',
          },
        },
      }));

      const options = [
        { value: 'Primary', label: 'Primary' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
      ]
      const Item = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
      }));  

      const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
          newChecked.push(value);
        } else {
          newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
      };
      const wrapperRef = useRef(null);
      useOutsideAlerter(wrapperRef); 

return (
    <>
    <HeaderTop />  
  
    <div className='bodymain'>
        <Row className='mb-columfull'>
        <Col className='maxcontainerix'>
        <div className='px-0 py-4 leftinbox'>
          <div className='px-3'>
          <Row>
              <Col sm={9}> <h3 className='title-h3'>Spam</h3> </Col>
              <Col sm={3}>
                <div className="inboxnoti">
                  <NotificationsIcon />
                  235
                </div>
              </Col>
          </Row>
          <Row className='my-3'>
              <Col>
                  <div className='textbox-dek serchdek'> 
                      <Search>
                          <SearchIconWrapper>
                          <SearchIcon />
                          </SearchIconWrapper>
                          <StyledInputBase
                          placeholder="Search…"
                          inputProps={{ 'aria-label': 'search' }}
                          />
                      </Search>
                  </div>
              </Col>
          </Row>
          <Row>
              <Col xs={8}>
                  <div class="selecter-m inboxtype"> 
                      <a href="#" className="selectorall" onClick={addInboxClass}>
                        All <img src={downarrow} />
                      </a>

                      <div className="userdropall" id="id_userboxlist"> 
                          <div className="bodyuserdop textdeclist">
                          <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                              {[0, 1, 2, 3, 4].map((value) => {
                                const labelId = `checkbox-list-secondary-label-${value}`;
                                return (
                                  <ListItem className='droplistchec'
                                    key={value}
                                    secondaryAction={
                                      <Checkbox
                                        edge="end"
                                        onChange={handleToggle(value)}
                                        checked={checked.indexOf(value) !== -1}
                                        inputProps={{ 'aria-labelledby': labelId }}
                                      />
                                    }
                                    disablePadding
                                  >
                                    <ListItemButton>
                                      <ListItemAvatar>
                                        {/* <Avatar
                                          alt={`Avatar n°${value + 1}`}
                                          src={`../../images/avatar/${value + 1}.jpg`}
                                        /> */}
                                          <ListItemAvatar className="scvar">
                                          <Avatar alt="Remy Sharp" src={inboxuser1} />
                                        </ListItemAvatar>
                                      </ListItemAvatar>
                                      <ListItemText
                                      primary="Brunch this weekend?"
                                      secondary={
                                          <React.Fragment>
                                            jennyoswald1998@gmail.com
                                          </React.Fragment>
                                      }
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                            </List>

                          </div>
                      </div>  
                  </div>
              </Col>
              <Col xs={2}>
                <Button className='iconbtn' variant="contained" size="large">
                  <RefreshIcon />
                </Button>
                </Col>
              <Col xs={2}>
                <Button className='iconbtn' variant="contained" size="large">
                  <DeleteIcon />
                </Button>
              </Col>
          </Row>
          <Row>
              <Col xs={12} className="mt-3">
                <FormGroup>
                  <FormControlLabel control={<Checkbox defaultChecked />} label="Select All" /> 
                </FormGroup>           
              </Col> 
          </Row>
          </div>

          <div className='listinbox mt-3'>
          <scrollbars>
            <Stack spacing={1} align="left">
            
                <Item className='cardinboxlist px-0'>
                  <Row>
                    <Col xs={1} className="pr-0">
                        <FormControlLabel control={<Checkbox />} label="" /> 
                    </Col>
                    <Col xs={11} className="pr-0">   
                      <Row> 
                          <Col xs={2}>
                            <span className="inboxuserpic">
                                <img src={inboxuser1} width="55px" alt="" />
                            </span>
                          </Col>
                          <Col xs={8}> 
                            <h4>Chelsia Donald</h4>
                            <h3>Lenovo has a new policy</h3> 
                          </Col>
                          <Col xs={2} className="pl-0"> 
                            <h6>8:56 PM</h6> 
                            <ToggleButton className='startselct'
                              value="check"
                              selected={selected}
                              onChange={() => {
                                setSelected(!selected);
                              }}
                            >
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Col>
                      </Row>
                      <Row>
                        <Col xs={2} className='ja-center'>
                            <div className='attachfile'>
                              <input type="file" />
                              <AttachFileIcon />
                            </div>
                        </Col>
                        <Col xs={10}>
                          <p>It is a long established facts that a reader will be distracted by is the readable content of a page when looking at its layout.</p>
                        </Col>
                    </Row>
                    </Col>
                  </Row> 
                </Item> 
                
                <Item className='cardinboxlist px-0'>
                  <Row>
                    <Col xs={1} className="pr-0">
                        <FormControlLabel control={<Checkbox />} label="" /> 
                    </Col>
                    <Col xs={11} className="pr-0">   
                      <Row> 
                          <Col xs={2}>
                            <span className="inboxuserpic">
                                <img src={inboxuser2} width="55px" alt="" />
                            </span>
                          </Col>
                          <Col xs={8}> 
                            <h4>Chelsia Donald</h4>
                            <h3>Lenovo has a new policy</h3> 
                          </Col>
                          <Col xs={2} className="pl-0"> 
                            <h6>8:56 PM</h6> 
                            <ToggleButton className='startselct'
                              value="check"
                              selected={selected}
                              onChange={() => {
                                setSelected(!selected);
                              }}
                            >
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Col>
                      </Row>
                      <Row>
                        <Col xs={2} className='ja-center'>
                            <div className='attachfile'>
                              <input type="file" />
                              <AttachFileIcon />
                            </div>
                        </Col>
                        <Col xs={10}>
                          <p>It is a long established facts that a reader will be distracted by is the readable content of a page when looking at its layout.</p>
                        </Col>
                    </Row>
                    </Col>
                  </Row> 
                </Item> 

                <Item className='cardinboxlist px-0'>
                  <Row>
                    <Col xs={1} className="pr-0">
                        <FormControlLabel control={<Checkbox />} label="" /> 
                    </Col>
                    <Col xs={11} className="pr-0">   
                      <Row> 
                          <Col xs={2}>
                            <span className="inboxuserpic">
                                <img src={inboxuser3} width="55px" alt="" />
                            </span>
                          </Col>
                          <Col xs={8}> 
                            <h4>Chelsia Donald</h4>
                            <h3>Lenovo has a new policy</h3> 
                          </Col>
                          <Col xs={2} className="pl-0"> 
                            <h6>8:56 PM</h6> 
                            <ToggleButton className='startselct'
                              value="check"
                              selected={selected}
                              onChange={() => {
                                setSelected(!selected);
                              }}
                            >
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Col>
                      </Row>
                      <Row>
                        <Col xs={2} className='ja-center'>
                            <div className='attachfile'>
                              <input type="file" />
                              <AttachFileIcon />
                            </div>
                        </Col>
                        <Col xs={10}>
                          <p>It is a long established facts that a reader will be distracted by is the readable content of a page when looking at its layout.</p>
                        </Col>
                    </Row>
                    </Col>
                  </Row> 
                </Item> 
 
                <Item className='cardinboxlist px-0'>
                  <Row>
                    <Col xs={1} className="pr-0">
                        <FormControlLabel control={<Checkbox />} label="" /> 
                    </Col>
                    <Col xs={11} className="pr-0">   
                      <Row> 
                          <Col xs={2}>
                            <span className="inboxuserpic">
                                <img src={inboxuser4} width="55px" alt="" />
                            </span>
                          </Col>
                          <Col xs={8}> 
                            <h4>Chelsia Donald</h4>
                            <h3>Lenovo has a new policy</h3> 
                          </Col>
                          <Col xs={2} className="pl-0"> 
                            <h6>8:56 PM</h6> 
                            <ToggleButton className='startselct'
                              value="check"
                              selected={selected}
                              onChange={() => {
                                setSelected(!selected);
                              }}
                            >
                              <StarBorderIcon className='starone' />
                              <StarIcon className='selectedstart startwo' />
                            </ToggleButton>
                          </Col>
                      </Row>
                      <Row>
                        <Col xs={2} className='ja-center'>
                            <div className='attachfile'>
                              <input type="file" />
                              <AttachFileIcon />
                            </div>
                        </Col>
                        <Col xs={10}>
                          <p>It is a long established facts that a reader will be distracted by is the readable content of a page when looking at its layout.</p>
                        </Col>
                    </Row>
                    </Col>
                  </Row> 
                </Item> 
                
            </Stack> 
            </scrollbars>
          </div>


      </div> 
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