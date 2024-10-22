import { useState } from 'react';
export const emailRegexp = new RegExp(/[^@\t\r\n]+@[^@\t\r\n]+\.[^@\t\r\n]+/);

const useLoginForm = (initialState, minPasswordLength) => {
  const [credentials, setCredentials] = useState(initialState);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: {
        value,
        hasError: name === 'password' && value.length < minPasswordLength,
      },
    }));
  };

  const validateEmail = (email) => emailRegexp.test(email);

  const handleBlur = () => {
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      email: {
        ...prevCredentials.email,
        hasError: !validateEmail(credentials.email.value),
      },
    }));
  };

  return {
    credentials,
    handleChange,
    handleBlur,
  };
};

export default useLoginForm;
