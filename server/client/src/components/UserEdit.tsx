import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { ManageAccountsOutlined } from '@mui/icons-material';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Button,
  IconButton,
  TextField,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import * as yup from 'yup';
import WidgetWrapper from 'components/WidgetWrapper';

import { User } from 'interfaces/index';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from 'stores/store';
import { Formik, FormikHelpers } from 'formik';
import { LoadingButton } from '@mui/lab';
import useHttp, { HandleFn } from 'hooks/useHttp';
import { authActions } from 'stores/auth.slice';

type UserEditProps = {
  user: User;
  loading?: boolean;
  onSwitch: () => void;
};
type UserEditForm = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  location: string;
  occupation: string;
};

const stringRequired = yup
  .string()
  .required(params => `${params.path} is required.`);

const userEditSchema = yup.object().shape({
  name: yup.string().required(),
  email: stringRequired.email('Invalid email.'),
  password: yup
    .string()
    .test('empty-or-match', '${path} too short', (value, context) => {
      return !value || value.trim().length === 0 || value.trim().length >= 6;
    }),
  passwordConfirm: yup
    .string()
    .test(
      'password-match',
      'Password do not match',
      (value, context) =>
        value === context.parent.password || !value || value.trim().length === 0
    ),
  location: stringRequired,
  occupation: stringRequired,
});

const UserEdit: FC<UserEditProps> = ({ onSwitch, user }) => {
  const dispatch = useDispatch();
  const token = useSelector<StateType, string>(state => state.auth.token);
  const [userImage, setUserImage] = useState<File>(new File([], ''));

  const { palette } = useTheme();
  const main = palette.primary.main;

  const userEditInitialValue = useMemo(
    () => ({
      name: user.name,
      email: user.email,
      password: '',
      passwordConfirm: '',
      location: user.location,
      occupation: user.occupation,
    }),
    [user]
  );

  const handleData = useCallback<HandleFn<User>>(
    data => {
      dispatch(authActions.login({ user: data, token }));
      onSwitch();
    },
    [dispatch, token, onSwitch]
  );
  const { loading, error, makeRequest } = useHttp(
    `/api/users/update`,
    handleData,
    'patch'
  );
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files![0];
    setUserImage(imageFile);
  };
  const submitHandler = (
    values: UserEditForm,
    onSubmitProps: FormikHelpers<UserEditForm>
  ) => {
    const sendData = {
      ...values,
      picturePath: userImage.name || user.picturePath,
    };
    const formData = new FormData();
    Object.entries(sendData).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });
    if (userImage.name) {
      formData.append('picture', userImage);
    }
    makeRequest({ data: formData, token });
  };

  return (
    <WidgetWrapper>
      {/* First row */}
      <Box
        display='grid'
        gridTemplateColumns='1fr 1fr 1fr'
        justifyItems='center'
        alignItems='center'
        gap='0.5rem'
        pb='1.1rem'
      >
        <IconButton onClick={onSwitch} sx={{ justifySelf: 'start' }}>
          <ArrowBackIcon />
        </IconButton>
        <Button
          aria-label='upload picture'
          component='label'
          sx={{ borderRadius: '50%' }}
        >
          <input
            hidden
            accept='image/*'
            multiple={false}
            type='file'
            onChange={handleImage}
          />
          <Avatar
            src={
              userImage.name
                ? URL.createObjectURL(userImage)
                : `/assets/${user.picturePath}`
            }
            alt={user.name}
            sx={{ width: '65px', height: '65px' }}
          />
        </Button>
        <Typography variant='h5' sx={{ justifySelf: 'end' }}>
          Edit Profile
        </Typography>
      </Box>

      <Divider />

      {/* Second row */}
      <Formik
        onSubmit={submitHandler}
        initialValues={userEditInitialValue}
        validationSchema={userEditSchema}
      >
        {({
          handleSubmit,
          handleBlur,
          handleChange,
          values,
          touched,
          errors,
        }) => (
          // FORM
          <form onSubmit={handleSubmit}>
            <Box display='flex' flexDirection='column' gap='1rem'>
              <TextField
                label='Name'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name='name'
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
              />
              <TextField
                label='Email'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name='email'
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                label='Location'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name='location'
                error={!!touched.location && !!errors.location}
                helperText={touched.location && errors.location}
              />
              <TextField
                label='Occupation'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name='occupation'
                error={!!touched.occupation && !!errors.occupation}
                helperText={touched.occupation && errors.occupation}
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
              />
              <TextField
                label='Confirm password'
                type='password'
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.passwordConfirm}
                name='passwordConfirm'
                error={!!touched.passwordConfirm && !!errors.passwordConfirm}
                helperText={touched.passwordConfirm && errors.passwordConfirm}
              />
            </Box>
            <Box width='100%' textAlign='center' p='1rem'>
              <LoadingButton
                type='submit'
                loading={loading}
                sx={{
                  bgcolor: main,
                  color: palette.neutral.light,
                  p: '0.5rem 1rem',
                  '&:hover': {
                    color: main,
                  },
                }}
              >
                Update
              </LoadingButton>
            </Box>
          </form>
        )}
      </Formik>
    </WidgetWrapper>
  );
};

export default UserEdit;
