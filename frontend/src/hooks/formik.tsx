import { useFormik } from 'formik';
export const useFormikHook = ({
  initialValues,
  submitFunction,
  validationSchema,
}: any) => {
  const formik: any = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values: any) => {
      submitFunction(values);
    },
  });

  return formik;
};
