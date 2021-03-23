import React, { Component } from 'react'
import AuthContext from '../context/auth-context'

export default class loginPage extends Component {

    state = {
        isLogin: true
    }

    // get context data
    static contextType = AuthContext

   constructor(props) {
       super(props)
       this.emailField = React.createRef()
       this.passwordField = React.createRef()
   }

   switchModeHelper = () => {
       this.setState(prevState => {
           return { isLogin: !prevState.isLogin }
       })
   }

    submitHelper = event => {
        event.preventDefault()
        const email = this.emailField.current.value
        const password = this.passwordField.current.value

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        }
        console.log(email, password)

        // fetch and send data
        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        // 如果狀態沒有登入，即為註冊邏輯
        if (!this.state.isLogin) {
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: {
                            email: "${email}",
                            password: "${password}"
                        }) {
                            _id
                            email
                        }
                    }
                `
            }
        }

        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200) {
                throw new Error('Failed')
            }
            return res.json()
        })
        .then(resData => {
            // React Context 之設置
            if (resData.data.login.token) {
                this.context.login(
                    resData.data.login.userId, 
                    resData.data.login.token, 
                    resData.data.login.tokenExpiration
                )
            }
        })
        .catch(err => {
            throw err
        })
    }

    render() {
        return (
        <form onSubmit={this.submitHelper} className="form text-center mt-5">
            <div className="form-control border-none">
                <label htmlFor="email">帳號：</label>
                <input type="email" id="email" ref={this.emailField} />
            </div>
            <div className="form-control border-none">
                <label htmlFor="password">密碼：</label>
                <input type="password" id="password" ref={this.passwordField} />
            </div>
            <div className="form-actions mt-3">
                <button type="button" className="mx-1" onClick={this.switchModeHelper}>
                    { this.state.isLogin ?  '前往註冊' : '前往登入'}
                </button>
                <button className="btn btn-primary mx-1" type="submit">送出</button>
            </div>
        </form>
        )
    }
}
