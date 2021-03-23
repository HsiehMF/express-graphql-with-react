import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap'
import AuthContext from '../../context/auth-context'

const index = props =>  (
    <AuthContext.Consumer>
        { context => {
            console.log(context.token);
            return (

                <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/" className="mr-auto">React 搭配 GraphQL 前端頁面</Navbar.Brand>
                    <Nav>
                        {!context.token &&(<Nav.Link href="login">登入</Nav.Link>)}
                        {context.token && (
                            <React.Fragment>
                                <Button onClick={context.logout}>登出</Button>
                            </React.Fragment>
                        )}
                    </Nav>
                </Navbar>
            )
        }}
    </AuthContext.Consumer>
)

export default index

