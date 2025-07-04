import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { showMessage } from '../../../common/ShowMessage';
import { useState } from 'react';

// Dummy data for SRF No + client name dropdown
const srfClientOptions = [
  { value: 'ABSRF/2025/05/001', label: 'ABSRF/2025/05/001 - Apollo Hospital' },
  { value: 'ABSRF/2025/08/002', label: 'ABSRF/2025/05/002 - MedTech Supplies' },
  { value: 'ABSRF/2025/02/003', label: 'ABSRF/2025/05/003 - BioGenix Pvt Ltd' },
];

const paymentTypes = ['Advanced', 'Balance', 'Complete'];

const Add = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null); // state for preview
  const PaymentSchema = Yup.object().shape({
    srfClient: Yup.string().required('Please select SRF and Client'),
    totalAmount: Yup.number().required('Total amount is required').positive('Must be positive'),
    paymentAmount: Yup.number().required('Payment amount is required').positive('Must be positive'),
    paymentType: Yup.string().required('Please select payment type'),
    screenshot: Yup.mixed().required('Please attach a screenshot'),
    utrNumber: Yup.string(), // Optional
  });

  const handleSubmit = (values: any) => {
    // You can handle file upload here
    showMessage('Payment recorded successfully', 'success');
    navigate('/admin/payments');
  };

  return (
    <>
      {/* Breadcrumbs */}
      <ol className="flex text-gray-500 font-semibold dark:text-white-dark mb-4">
        <li><Link to="/" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">Dashboard</Link></li>
        <li className="before:w-1 before:h-1 before:bg-primary before:rounded-full before:mx-4">
          <Link to="/admin/payments" className="text-primary">Payments</Link>
        </li>
        <li className="before:w-1 before:h-1 before:bg-primary before:rounded-full before:mx-4">
          <Link to="#" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">Add Payment</Link>
        </li>
      </ol>
      {/* Form */}
      <Formik
        initialValues={{
          srfClient: '',
          totalAmount: '',
          paymentAmount: '',
          paymentType: '',
          screenshot: null,
          utrNumber: '',
        }}
        validationSchema={PaymentSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, submitCount }) => (
          <Form className="space-y-5">
            <div className="panel">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* SRF + Client Dropdown */}
                <div className={submitCount ? (errors.srfClient ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="srfClient" className="text-sm font-semibold text-gray-700">SRF No.</label>
                  <Field as="select" name="srfClient" className="form-select w-full">
                    <option value="" disabled>Select SRF No.</option>
                    {srfClientOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="srfClient" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Total Amount */}
                <div className={submitCount ? (errors.totalAmount ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="totalAmount" className="text-sm font-semibold text-gray-700">Total Amount</label>
                  <Field type="number" name="totalAmount" placeholder="Enter total amount" className="form-input w-full" />
                  <ErrorMessage name="totalAmount" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Payment Amount */}
                <div className={submitCount ? (errors.paymentAmount ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="paymentAmount" className="text-sm font-semibold text-gray-700">Payment Amount</label>
                  <Field type="number" name="paymentAmount" placeholder="Enter payment amount" className="form-input w-full" />
                  <ErrorMessage name="paymentAmount" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Payment Type Dropdown */}
                <div className={submitCount ? (errors.paymentType ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="paymentType" className="text-sm font-semibold text-gray-700">Payment Type</label>
                  <Field as="select" name="paymentType" className="form-select w-full">
                    <option value="" disabled>Select type</option>
                    {paymentTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="paymentType" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                <div>
                  <label htmlFor="utrNumber" className="text-sm font-semibold text-gray-700">UTR Number (Optional)</label>
                  <Field type="text" name="utrNumber" placeholder="Enter UTR number" className="form-input w-full" />
                  <ErrorMessage name="utrNumber" component="div" className="text-red-500 text-sm mt-1" />
                </div>
                {/* Screenshot Upload */}
                {/* Screenshot Upload with Preview */}
                <div className="md:col-span-2">
                  <div className={submitCount ? (errors.screenshot ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="screenshot" className="text-sm font-semibold text-gray-700">Attach Screenshot</label>
                    <input
                      type="file"
                      name="screenshot"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        setFieldValue("screenshot", file);
                        if (file) {
                          setImagePreview(URL.createObjectURL(file));
                        } else {
                          setImagePreview(null);
                        }
                      }}
                      className="form-input w-full"
                    />
                    <ErrorMessage name="screenshot" component="div" className="text-red-500 text-sm mt-1" />

                    {/* Preview */}
                    {imagePreview && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-1">Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Screenshot Preview"
                          className="w-32 h-32 object-cover border rounded shadow"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* UTR Number (Optional) */}

              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-6">
                <button type="submit" className="btn btn-primary px-6 py-2 text-white bg-primary hover:bg-primary-dark rounded">
                  Submit Payment
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Add;
