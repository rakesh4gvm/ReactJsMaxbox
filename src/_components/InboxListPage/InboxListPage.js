import React, { useRef, useEffect } from 'react'; 
import { Col, Row } from 'react-bootstrap';
 
import Select from 'react-select'
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import NotificationsIcon from '@material-ui/icons/Notifications';  
import inboxuser1 from '../../images/avatar/1.jpg';
import inboxuser2 from '../../images/avatar/2.jpg';
import inboxuser3 from '../../images/avatar/3.jpg';
import inboxuser4 from '../../images/avatar/4.jpg'; 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton'; 
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import allusers from '../../images/all_users.svg';
import iconlogout from '../../images/icon_logout.svg';
import defaultuser from '../../images/avatar/defaultuser.jpg';
import downarrow from '../../images/icon_downarrow.svg';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel'; 


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

export default function HomePage() {
    const [selected, setSelected] = React.useState(false);

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
      <div className='px-0 py-4 leftinbox'>
          <div className='px-3'>
          <Row>
              <Col sm={9}> <h3 className='title-h3'>Other Inbox</h3> </Col>
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

                      <div className="userdropall" id="id_userboxlist" ref={wrapperRef}> 
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
    </>
    );
}