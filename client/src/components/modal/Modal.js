import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import humanzSpinner from'../../assets/img/humanz-spinner.png';

import './modal.css'


const Modal = ({ isShowing, hide, clientData , submitForm, submitLoading, submitError }) => isShowing ? ReactDOM.createPortal(
    <React.Fragment>
        <div className="modal-overlay" />
        <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal">
                <div className="modal-header">
                    {clientData?
                    <h2>Update client</h2>:              
                    <h2>Add client</h2>}
                    <button type="button" className="modal-close-button" data-dismiss="modal" aria-label="Close" onClick={hide}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
    
                <Formik
                    initialValues={clientData? 
                    {
                        fullName: clientData.name,
                        id: clientData.client_id,
                        phoneNumber: clientData.phone,
                        email: clientData.email
                    }: 
                    {
                        fullName: '',
                        id: '',
                        phoneNumber: '',
                        email: ''
                    }}

                    validationSchema={Yup.object({
                        fullName: Yup.string()
                            .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field ")
                            .max(20, 'Must be 20 characters or less')
                            .required('Required'),
                        id: Yup.number()
                            .max(11111, 'Must be 5 characters or ,ore')
                            .max(11111111111, 'Must be 11 characters or less')
                            .required('Required'),
                        phoneNumber: Yup.string()
                            .min(6, 'Must be 6 characters or more')
                            .max(15, 'Must be 15 characters or less')
                            .matches(/^[0-9]+$/, "Must be only digits")
                            .required('Required'),
                        email: Yup.string()
                            .email('Invalid email address')
                            .required('Required'),
                    })}
                    onSubmit={(values) => {
                        submitForm(values);
                    }}
                >
                    <Form>
                        <div className="modal-body d-flex flex-column">
                            
                            <label htmlFor="fullName">Full Name</label>
                            <Field name="fullName" type="text" />
                            <ErrorMessage name="fullName" >
                                {value => <div className="text-danger">{value}</div>}
                            </ErrorMessage>

                            <label htmlFor="id">ID</label>
                            <Field name="id" type="text" />
                            <ErrorMessage name="id" >
                                {value => <div className="text-danger">{value}</div>}
                            </ErrorMessage>
                            
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <Field name="phoneNumber" type="text" />
                            <ErrorMessage name="phoneNumber" >
                                {value => <div className="text-danger">{value}</div>}
                            </ErrorMessage>

                            <label htmlFor="email">Email Address</label>
                            <Field name="email" type="email" />
                            <ErrorMessage name="email" >
                                {value => <div className="text-danger">{value}</div>}
                            </ErrorMessage>

                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <div>
                                <h3 className={'text-danger ' + (!submitError ? 'd-none':'')}>submit error...</h3>
                            </div>
                            <div>
                                { !submitLoading?
                                <button className="submit-button" type="submit">{clientData?<h5>update</h5>:<h5>add</h5>}</button>:
                                <div class="spinner">
                                    <img className='hummanz-spinner' src={humanzSpinner} alt="humanz-spinner"/>
                                </div>}
                            </div>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    </React.Fragment>, document.body
) : null;

export default Modal;