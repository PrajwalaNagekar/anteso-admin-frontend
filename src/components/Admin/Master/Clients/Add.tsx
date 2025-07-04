import * as Yup from 'yup';
import { Field, Form, Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { showMessage } from '../../../common/ShowMessage';
const AddClient = () => {
    const navigate = useNavigate();
    const SubmittedForm = Yup.object().shape({
        name: Yup.string().required('Please fill the Field'),
        email: Yup.string().email('Invalid email').required('Please fill the Email'),
        address: Yup.string().required('Please fill the Field'),
        phone: Yup.string()
            .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
            .required('Please fill the Field'),
        business: Yup.string().required('Please fill the Field'),
        gstNo: Yup.string().required('Please fill the Field'),
    });
    const submitForm = () => {
        showMessage('Form submitted successfully', 'success');
        navigate('/admin/clients');
    };
    return (
        <>
            <ol className="flex text-gray-500 font-semibold dark:text-white-dark mb-4">
                <li>
                    <Link to="/" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        Dashboard
                    </Link>
                </li>
                <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <Link to="/admin/clients" className="text-primary">
                        Clients
                    </Link>
                </li>
                <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
                    <Link to="#" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">
                        Add Clients
                    </Link>
                </li>
            </ol>
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    address: '',
                    phone: '',
                    business: '',
                    gstNo: '',
                }}
                validationSchema={SubmittedForm}
                onSubmit={() => {}}
            >
                {({ errors, submitCount, touched }) => (
                    <Form className="space-y-5">
                        <div className="panel">
                            <h5 className="font-semibold text-lg mb-4">Client Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="name">Name </label>
                                    <Field name="name" type="text" id="name" placeholder="Enter Name" className="form-input" />

                                    {submitCount && errors.name ? <div className="text-danger mt-1">{errors.name}</div> : null}
                                </div>
                                <div className={submitCount ? (errors.email ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="email">Email </label>
                                    <Field name="email" type="text" id="email" placeholder="Enter Email Address" className="form-input" />
                                    {submitCount && errors.email ? <div className="text-danger mt-1">{errors.email}</div> : ''}
                                </div>
                                <div className={submitCount ? (errors.address ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="address">Address </label>
                                    <Field name="address" type="text" id="address" placeholder="Enter Address" className="form-input" />
                                    {submitCount && errors.address ? <div className="text-danger mt-1">{errors.address}</div> : ''}
                                </div>
                                <div className={submitCount ? (errors.phone ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="phone">Phone </label>
                                    <Field name="phone" type="number" id="phone" placeholder="Enter Phone Number" className="form-input" />
                                    {submitCount && errors.phone ? <div className="text-danger mt-1">{errors.phone}</div> : ''}
                                </div>
                                <div className={submitCount ? (errors.business ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="business">Business </label>
                                    <Field name="business" type="text" id="business" placeholder="Enter Business" className="form-input" />
                                    {submitCount && errors.business ? <div className="text-danger mt-1">{errors.business}</div> : ''}
                                </div>
                                <div className={submitCount ? (errors.gstNo ? 'has-error' : 'has-success') : ''}>
                                    <label htmlFor="gstNo">GST Number </label>
                                    <Field name="gstNo" type="text" id="gstNo" placeholder="Enter GST Number" className="form-input" />
                                    {submitCount && errors.gstNo ? <div className="text-danger mt-1">{errors.gstNo}</div> : ''}
                                </div>
                            </div>
                        </div>
                        <div className="w-full mb-6 flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-success !mt-6"
                                onClick={() => {
                                    if (touched.name && !errors.name) {
                                        submitForm();
                                    }
                                }}
                            >
                                Submit Form
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default AddClient;
