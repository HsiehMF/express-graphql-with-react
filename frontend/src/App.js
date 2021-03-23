import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import loginPage from './pages/login'
import eventPage from './pages/event'
import Header from './component/Header/index'
import Footer from './component/Footer/index'
import AuthContext from './context/auth-context'

class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (userId, token, tokenExpiration) => {
    this.setState({ token: token, userId: userId })
  }

  logout = () => {
    this.setState({ token: null, userId: null })
  }

  render() {
    return (
      <Router>
        {/* Provider value in context will share to all child */}
          <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
            <Header />
            <Switch>
              {!this.state.token && <Redirect from="/" to="/login" exact />}
              {!this.state.token && <Redirect from="/event" to="/login" exact />}
              {this.state.token && <Redirect from="/login" to="/event" exact />}
              {this.state.token && <Redirect from="/" to="/event" exact />}
              {this.state.token && <Route path="/event" component={eventPage} />}
              <Route path="/login" component={loginPage} />
            </Switch>
          </AuthContext.Provider>
          <Footer />
      </Router>
    );
  }
}

export default App;
