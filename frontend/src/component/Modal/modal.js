import React from 'react'
import './modal.css';

const modal = props => (
  <div className="modal_div">
    <section className="modal_content">
        <h1>{props.title}</h1>
        {props.children}
    </section>
    <section className="modal_actions">
      {props.canCancel && (
        <button className="btn btn-danger mx-2" onClick={props.onConfirm}>
            送出
        </button>
      )}
      {props.canConfirm && (
        <button className="btn btn-outline-primary" onClick={props.onCancel}>
            取消
        </button>
      )}
    </section>
  </div>
)

export default modal