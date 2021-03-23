import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import Modal from '../component/Modal/modal'
import AuthContext from '../context/auth-context'
import Backdrop from '../component/Backdrop/Backdrop'

export default class eventPage extends Component {
    state = {
        creating: false,
        events: []
    }

    constructor(props) {
        super(props)
        this.titleElRef = React.createRef()
        this.priceElRef = React.createRef()
        this.dateElRef = React.createRef()
        this.descriptionElRef = React.createRef()
    }

    static contextType = AuthContext
    
    componentDidMount() {
        this.fetchEvents()
    }

    startCreateEventHandler = () => {
        this.setState({ creating: !this.state.creating })
    }
    
    modalConfirmHandler = () => {
        this.setState({ creating: false })
        const title = this.titleElRef.current.value
        const price = +this.priceElRef.current.value
        const date = this.dateElRef.current.value
        const description = this.descriptionElRef.current.value

        if (
           title.trim().length === 0 ||
           price <= 0 ||
           date.trim().length === 0 ||
           description.trim().length === 0
        ) {
          return;
        }
    
        const event = { title, price, date, description }
        console.log(event)
    
        const requestBody = {
            query: `
                mutation {
                        createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        }
        
        // get user token from context
        const token = this.context.token
    
        fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('新增失敗!')
            }
            return res.json()
        })
        .then(resData => {
            console.log('成功')
            console.log(resData)
            this.fetchEvents()
        })
        .catch(err => {
            console.log(err)
        })   
    }
    
    modalCancelHandler = () => {
        this.setState({ creating: false })
    }

    fetchEvents() {
        const requestBody = {
          query: `
              query {
                events {
                  _id
                  title
                  description
                  date
                  price
                  creator {
                    _id
                    email
                  }
                }
              }
            `
        }
    
        fetch('http://localhost:5000/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!')
            }
            return res.json()
        })
        .then(resData => {
            const events = resData.data.events
            console.log(events)
            this.setState({ events: events })
        })
        .catch(err => {
            console.log(err)
        })
    }
    
    render() {
        const eventList = this.state.events.map(event => {
            return (
                <div class="card text-left mb-3">
                    <div class="card-header">
                        <h5>{event.title}   <span class="badge bg-warning text-dark">{event.creator.email}</span></h5>
                    </div>
                    <div class="card-body">
                        <p class="card-text">
                            <li style={{listStyle: 'none'}} key={event._id}>
                                <p>時間：{event.date}</p>
                                <p>金額：${event.price} </p>
                                <p>備註：{event.description}</p>
                            </li>
                        </p>
                    </div>
                </div>              
            )
        })
        
        return ( <React.Fragment>
                <div className="container text-center mt-5">
                    {this.context.token && (
                        <Button onClick={this.startCreateEventHandler}>新增報帳項目</Button>
                    )}
                    {this.state.creating && <Backdrop />}
                    {this.state.creating && (
                        <Modal
                            title="開始記帳"
                            canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmHandler}
                        >
                        <form>
                            <div className="form-contro mt-4">
                                <label htmlFor="date" className="h4 mx-3 ">時間</label>
                                <input type="datetime-local" id="date" ref={this.dateElRef} />
                            </div>
                            <div className="form-control mt-1">
                                <label htmlFor="title" className="h4 mx-3">支出項目</label>
                                <input type="text" id="title" ref={this.titleElRef} />
                            </div>
                            <div className="form-control mt-1">
                                <label htmlFor="price" className="h4 mx-3">支出金額</label>
                                <input type="number" id="price" ref={this.priceElRef} />
                            </div>
                            <div className="form-control mt-4">
                                <label htmlFor="description" className="h4 mx-3">描述</label>
                                <textarea
                                id="description"
                                rows="3"
                                ref={this.descriptionElRef}
                                />
                            </div>
                        </form>
                        </Modal>
                    )}
                    <ul className="mt-4">
                        {eventList}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}
