import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Auth from './utils/auth'
import Header from './components/Header';
import Footer from './components/Footer';
import pages from './pages';
const { Login, NoMatch, SingleThought, Profile, Signup, Home} = pages


const client = new ApolloClient({
  request: operation => {
    const token = Auth.getToken()
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ''
      }
    }) 
  },
  uri: '/graphql'
})
const loggedIn = Auth.loggedIn()
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='flex-column justify-flex-start min-100-vh'>
          <Header loggedIn={loggedIn} logout={Auth.logout}/>
          <div className='container'>
            <Switch>
              <Route exact path="/" render={props => <Home {...props} loggedIn={loggedIn}/>}/>
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />

              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
