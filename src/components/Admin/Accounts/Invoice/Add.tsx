import React from 'react';
import { Field, Form, Formik, ErrorMessage, FieldArray, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

interface OptionType {
  value: string;
  label: string;
}

interface ServiceItem {
  machineType: string;
  description: string;
  quantity: number;
  rate: number;
  hsnno: string;
}

const machineOptions: OptionType[] = [
  'Fixed X-Ray',
  'Mobile X-Ray',
  'C-Arm',
  'Cath Lab/Interventional Radiology',
  'Mammography',
  'CT Scan',
  'PET CT',
  'CT Simulator',
  'OPG',
  'CBCT',
  'BMD/DEXA',
  'Dental IOPA',
  'Dental Hand Held',
  'O Arm',
  'KV Imaging (OBI)',
  'Lead Apron Test',
  'Thyroid Shield Test',
  'Gonad Shield Test',
  'Radiation Survey of Radiation Facility',
  'Others',
].map((label) => ({ label, value: label }));

const InvoiceSchema = Yup.object().shape({
  invoiceId: Yup.string().required('Invoice ID is required'),
  buyerName: Yup.string().required('Buyer Name is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  gstin: Yup.string().required('GSTIN is required'), gstPercent: Yup.number().required('GST % is required').min(0).max(100),
  discountPercent: Yup.number().required('Discount % is required').min(0).max(100),

  services: Yup.array()
    .of(
      Yup.object().shape({
        machineType: Yup.string().required('Machine Type is required'),
        description: Yup.string().required('Description is required'),
        quantity: Yup.number().required('Quantity is required').positive('Must be positive').integer('Must be an integer'),
        rate: Yup.number().required('Rate is required').positive('Must be a positive number'),
        hsnno: Yup.string().required('HSN/SAC No is required'),
      })
    )
    .min(1, 'At least one service is required'),
});

const GrandTotalDisplay: React.FC = () => {
  const { values } = useFormikContext<{ services: ServiceItem[]; gstPercent: number; discountPercent: number }>();
  const subtotal = values.services.reduce((sum, service) => sum + service.quantity * service.rate, 0);
  const gstAmount = (subtotal * values.gstPercent) / 100;
  const discountAmount = (subtotal * values.discountPercent) / 100;
  const total = subtotal + gstAmount - discountAmount;

  return (
    <div className="text-right font-bold text-lg mt-4">
      {/* Subtotal: ₹{subtotal.toFixed(2)} <br />
      GST ({values.gstPercent}%): ₹{gstAmount.toFixed(2)} <br />
      Discount ({values.discountPercent}%): -₹{discountAmount.toFixed(2)} <br /> */}
      <div className="mt-2">Grand Total: ₹{total.toFixed(2)}</div>
    </div>
  );
};


const Add = () => {
  return (
    <div>
      <ol className="flex text-gray-500 font-semibold dark:text-white-dark mb-4">
        <li><Link to="/" className="hover:text-gray-500/70 dark:hover:text-white-dark/70">Dashboard</Link></li>
        <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
          <Link to="/admin/clients" className="text-primary">Invoice</Link>
        </li>
        <li className="before:w-1 before:h-1 before:rounded-full before:bg-primary before:inline-block before:relative before:-top-0.5 before:mx-4">
          <span>Add Invoice</span>
        </li>
      </ol>

      <h5 className="font-semibold text-lg mb-4">Add Invoice</h5>

      <Formik
        initialValues={{
          invoiceId: '',
          buyerName: '',
          address: '',
          state: '',
          gstin: '',
          gstPercent: 18,
          discountPercent: 0,
          services: [
            {
              machineType: '',
              description: '',
              quantity: 0,
              rate: 0,
              hsnno: '',
            },
          ],
        }}
        validationSchema={InvoiceSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values) => {
          console.log(' Submit triggered');
          console.log(values);
        }}
      >
        {({ values }) => (
          <Form className="space-y-5">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 panel">
              {[
                { name: 'invoiceId', label: 'Invoice ID' },
                { name: 'buyerName', label: 'Buyer Name' },
                { name: 'address', label: 'Address' },
                { name: 'state', label: 'State' },
                { name: 'gstin', label: 'GSTIN' },
              ].map(({ name, label }) => (
                <div key={name}>
                  <label htmlFor={name} className="block mb-1 font-medium">{label}</label>
                  <Field name={name} className="form-input" placeholder={`Enter ${label}`} />
                  <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
                </div>
              ))}
            </div>

            {/* Services Section */}
            <div className="panel">
              <h5 className="font-semibold text-lg mb-4">Service Details</h5>
              <FieldArray name="services">
                {({ push, remove }) => (
                  <>
                    {values.services.map((_, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end mb-4">
                        <div>
                          <label className="block mb-1 font-medium">Machine Type</label>
                          <Field as="select" name={`services[${index}].machineType`} className="form-select">
                            <option value="">Select Machine</option>
                            {machineOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name={`services[${index}].machineType`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">Description</label>
                          <Field name={`services[${index}].description`} className="form-input" placeholder="Description" />
                          <ErrorMessage name={`services[${index}].description`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">Quantity</label>
                          <Field name={`services[${index}].quantity`} type="number" className="form-input" />
                          <ErrorMessage name={`services[${index}].quantity`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">Rate</label>
                          <Field name={`services[${index}].rate`} type="number" className="form-input" />
                          <ErrorMessage name={`services[${index}].rate`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block mb-1 font-medium">HSN/SAC No</label>
                          <Field name={`services[${index}].hsnno`} type="text" className="form-input" />
                          <ErrorMessage name={`services[${index}].hsnno`} component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="flex items-center pt-6">
                          {values.services.length > 1 && (
                            <button type="button" onClick={() => remove(index)} className="text-red-500 text-xs">
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        push({
                          machineType: '',
                          description: '',
                          quantity: 0,
                          rate: 0,
                          hsnno: '',
                        })
                      }
                      className="btn btn-primary mt-3"
                    >
                      + Add Another Service
                    </button>
                  </>
                )}
              </FieldArray>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 panel mt-2">
              <div>
                <label htmlFor="gstPercent" className="block mb-1 font-medium">GST %</label>
                <Field
                  name="gstPercent"
                  type="number"
                  className="form-input"
                  placeholder="Enter GST %"
                />
                <ErrorMessage name="gstPercent" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="discountPercent" className="block mb-1 font-medium">Discount %</label>
                <Field
                  name="discountPercent"
                  type="number"
                  className="form-input"
                  placeholder="Enter Discount %"
                />
                <ErrorMessage name="discountPercent" component="div" className="text-red-500 text-sm mt-1" />
              </div>

            </div>
            <GrandTotalDisplay />

            <div className="flex justify-end">
              <button type="submit" className="btn btn-success">Submit Invoice</button>
            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Add;
