import { FC, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { EditOutlined } from '@mui/icons-material';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import FlexBetween from './FlexBetween';
import useHttp, { HandleFn, LoginResType } from 'hooks/useHttp';
import { LoadingButton } from '@mui/lab';

const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  email: yup.string().email('Invalid email.').required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password too short.')
    .required('Password is required.'),
  passwordConfirm: yup
    .string()
    .min(6, 'Password too short.')
    .test(
      'password-match',
      'Password do not match',
      (value, context) => value === context.parent.password
    )
    .required('Password is required.'),
  location: yup.string().required('Location is required.'),
  occupation: yup.string().required('Occupation is required.'),
  picture: yup.string().required('Picture is required.'),
});

type RegisterType = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  location: string;
  occupation: string;
  picture: File;
};

const initValuesRegister: RegisterType = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
  location: '',
  occupation: '',
  picture: new File([], ''),
};

const RegisterForm: FC = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const navigate = useNavigate();

  const handleData = useCallback<HandleFn>(() => {
    navigate('/login');
  }, [navigate]);

  const { loading, error, makeRequest } = useHttp(
    '/api/auth/register',
    handleData,
    'post'
  );

  function submitHandler(
    values: RegisterType,
    onSubmitProps: FormikHelpers<RegisterType>
  ) {
    const sendData = { ...values, picturePath: values.picture.name };
    const formData = new FormData();
    Object.entries(sendData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    makeRequest({ data: formData });
  }

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <Formik
      onSubmit={submitHandler}
      initialValues={initValuesRegister}
      validationSchema={registerSchema}
    >
      {({
        handleSubmit,
        handleBlur,
        handleChange,
        setFieldValue,
        values,
        touched,
        errors,
      }) => (
        /* Form field */
        <form onSubmit={handleSubmit}>
          <Box
            display='grid'
            gap='30px'
            gridTemplateColumns='repeat(4, minmax(0, 1fr))'
            sx={{
              '& > div': {
                gridColumn: isNonMobile ? undefined : 'span 4',
              },
            }}
          >
            <TextField
              label='Name'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.name}
              name='name'
              error={!!touched.name && !!errors.name}
              helperText={touched.name && errors.name}
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label='Email'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name='email'
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label='Location'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.location}
              name='location'
              error={!!touched.location && !!errors.location}
              helperText={touched.location && errors.location}
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label='Occupation'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.occupation}
              name='occupation'
              error={!!touched.occupation && !!errors.occupation}
              helperText={touched.occupation && errors.occupation}
              sx={{ gridColumn: 'span 4' }}
            />
            {/* Dropzone */}
            <Box
              gridColumn='span 4'
              border={`1px solid ${palette.neutral.medium}`}
              borderRadius='5px'
              p='1rem'
            >
              <Dropzone
                accept={{
                  'image/*': ['.png', '.jpeg', '.jpg'],
                }}
                multiple={false}
                onDrop={acceptedFiles => {
                  setFieldValue('picture', acceptedFiles[0]);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p='1rem'
                    sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    {!values.picture.name ? (
                      <p>Add Picture Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{values.picture.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
            <TextField
              label='Password'
              type='password'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name='password'
              error={!!touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label='Confirm Password'
              type='password'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.passwordConfirm}
              name='passwordConfirm'
              error={!!touched.passwordConfirm && !!errors.passwordConfirm}
              helperText={touched.passwordConfirm && errors.passwordConfirm}
              sx={{ gridColumn: 'span 4' }}
            />
          </Box>

          {/* Buttons */}
          <Box>
            <LoadingButton
              disabled={
                !Object.keys(touched).length || !!Object.keys(errors).length
              }
              loading={loading}
              fullWidth
              type='submit'
              sx={{
                m: '2rem 0',
                p: '1rem',
                bgcolor: palette.primary.main,
                color: palette.background.paper,
                '&:hover': {
                  color: palette.primary.main,
                },
              }}
            >
              Register
            </LoadingButton>

            <Typography
              onClick={() => navigate('/login')}
              sx={{
                textDecoration: 'underline',
                color: palette.primary.main,
                transition: 'all 0.2s',
                '&:hover': {
                  cursor: 'pointer',
                  color: palette.primary.dark,
                },
              }}
            >
              Already have an account? Login here.
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default RegisterForm;
