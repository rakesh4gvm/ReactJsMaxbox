import './App.css';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom'; 
import { history } from '../src/_helpers/history'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import OtherInboxPage from './_components/OtherInboxPage/OtherInboxPage';
import ProfileSettingPage from '../src/_components/ProfileSettingPage/ProfileSettingPage';
import EmailConfigurationPage from '../src/_components/EmailConfigurationPage/EmailConfigurationPage';
import UnansweredResponsesPage from '../src/_components/UnansweredResponsesPage/UnansweredResponsesPage';
import StarredPage from '../src/_components/StarredPage/StarredPage';
import FollowUpLaterPage from '../src/_components/FollowUpLaterPage/FollowUpLaterPage';
import DraftsPage from '../src/_components/DraftsPage/DraftsPage';
import SpamPage from '../src/_components/SpamPage/SpamPage';
import TemplatesPage from '../src/_components/TemplatesPage/TemplatesPage';
import SelectTemplatesPage from '../src/_components/SelectTemplatesPage/SelectTemplatesPage';

function App() {
  return (
    <div className="App">
       <Router history={history}>
            <Switch>
                <Route exact path="/" component={OtherInboxPage} /> 
                <Route exact path="/UnansweredResponses" component={UnansweredResponsesPage} /> 
                <Route exact path="/Starred" component={StarredPage} /> 
                <Route exact path="/FollowUpLater" component={FollowUpLaterPage} /> 
                <Route exact path="/Drafts" component={DraftsPage} /> 
                <Route exact path="/Spam" component={SpamPage} />  
                <Route exact path="/ProfileSetting" component={ProfileSettingPage} /> 
                <Route exact path="/EmailConfiguration" component={EmailConfigurationPage} /> 
                <Route exact path="/Templates" component={TemplatesPage} /> 
                <Route exact path="/SelectTemplates" component={SelectTemplatesPage} /> 
                <Redirect from="*" to="/" />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
