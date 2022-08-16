import './App.css';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom'; 
import { history } from '../src/_helpers/history'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import OtherInboxPage from './_components/OtherInboxPage/OtherInboxPage';
import ProfileSettingPage from '../src/_components/ProfileSettingPage/ProfileSettingPage';
import EmailConfigurationPage from '../src/_components/EmailConfigurationPage/EmailConfigurationPage';
import UnansweredResponsesPage from './_components/UnansweredResponsesPage/UnansweredResponsesPage';
import StarredPage from '../src/_components/StarredPage/StarredPage';
import FollowUpLaterPage from '../src/_components/FollowUpLaterPage/FollowUpLaterPage';
import DraftsPage from '../src/_components/DraftsPage/DraftsPage';
import SpamPage from '../src/_components/SpamPage/SpamPage';
import TemplatesPage from '../src/_components/TemplatesPage/TemplatesPage';
import SelectTemplatesPage from '../src/_components/SelectTemplatesPage/SelectTemplatesPage';
import CreateTemplatesPage from './_components/CreateTemplatesPage/CreateTemplatesPage';
import CreateObjectionPage from '../src/_components/CreateObjectionPage/CreateObjectionPage';
import RegisterPage from './_components/RegisterPage/RegisterPage';
import LoginPage from './_components/LoginPage/LoginPage';
import EditEmailPage from './_components/EditEmailPage/EditEmailPage';
import ClientListPage from './_components/ClientListPage/ClientListPage';
import AddClientPage from './_components/AddClientPage/AddClientPage';


function App() {
  return (
    <div className="App">
       <Router history={history}>
            <Switch>
                <Route exact path="/OtherInboxPage" component={OtherInboxPage} /> 
                <Route exact path="/UnansweredResponses" component={UnansweredResponsesPage} /> 
                <Route exact path="/Starred" component={StarredPage} /> 
                <Route exact path="/FollowUpLater" component={FollowUpLaterPage} /> 
                <Route exact path="/Drafts" component={DraftsPage} /> 
                <Route exact path="/Spam" component={SpamPage} />  
                <Route exact path="/ProfileSetting" component={ProfileSettingPage} /> 
                <Route exact path="/EmailConfiguration" component={EmailConfigurationPage} /> 
                <Route exact path="/Templates" component={TemplatesPage} /> 
                <Route exact path="/SelectTemplates" component={SelectTemplatesPage} />
                <Route exact path="/CreateTemplates" component={CreateTemplatesPage} /> 
                <Route exact path="/CreateObjection" component={CreateObjectionPage} /> 
                <Route exact path="/Register" component={RegisterPage} /> 
                <Route exact path="/EditEmail" component={EditEmailPage} /> 
                <Route exact path="/ClientList" component={ClientListPage} /> 
                <Route exact path="/AddClient" component={AddClientPage} /> 
                <Route exact path="/" component={LoginPage} /> 

                
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
