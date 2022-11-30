import { FC, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import useHttp, { HandleFn, LoginResType } from 'hooks/useHttp';
import { useDispatch } from 'react-redux';
import { authActions } from 'stores/auth.slice';

const loginSchema = yup.object().shape({
  email: yup.string().email('Invalid email.').required('Email is required.'),
  password: yup
    .string()
    .min(6, 'Password too short.')
    .required('Password is required.'),
});

type LoginType = {
  email: string;
  password: string;
};

const initValuesLogin: LoginType = {
  email: '',
  password: '',
};

const LoginForm: FC = () => {
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery('(min-width: 600px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleData = useCallback<HandleFn<LoginResType>>(
    response => {
      dispatch(
        authActions.login({ user: response.user, token: response.token })
      );
    },
    [dispatch]
  );
  const { loading, error, makeRequest } = useHttp(
    '/api/auth/login',
    handleData,
    'post'
  );

  const submitHandler = (
    values: LoginType,
    onSubmitProps: FormikHelpers<LoginType>
  ) => {
    console.log(values);

    makeRequest({ data: { email: values.email, password: values.password } });
  };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return (
    <Formik
      onSubmit={submitHandler}
      initialValues={initValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        handleSubmit,
        handleBlur,
        handleChange,
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
              label='Email'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name='email'
              error={!!touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 4' }}
            />
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
              Login
            </LoadingButton>
            {error && (
              <Typography color='#cc1111' textAlign='center' fontSize='16px'>
                {error.response!.data.message}
              </Typography>
            )}
            <Typography
              onClick={() => navigate('/register')}
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
              Don't have an account? Sign up here.
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
