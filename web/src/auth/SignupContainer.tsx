import { FormControl, Button, Paper, Box, Typography } from "@material-ui/core";
import React, { useContext, useState, useEffect } from "react";

import { FirebaseContext } from "auth/FirebaseContext";
import { makeStyles } from "@material-ui/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const useStyles = makeStyles({
  formControl: {
    display: "block"
  },
  formWrapper: {
    margin: "auto",
    width: "425px",
    padding: "50px"
  },
  formPaper: {
    padding: "25px"
  }
});
const SignupContainer = () => {
  const classes = useStyles();

  const firebaseContext = useContext(FirebaseContext);
  const { firebase } = firebaseContext;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");

  useEffect(() => {
    ValidatorForm.addValidationRule("isPasswordMatch", value => {
      if (value !== password) {
        return false;
      }
      return true;
    });

    return () => {
      ValidatorForm.removeValidationRule("isPasswordMatch");
    };
  }, [password]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmedPassword(event.currentTarget.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // @ts-ignore
    firebase
      .createUser(email, password)
      .then((authUser: any) => {})
      .catch((error: any) => {
        console.log("error", error);
      });
  };

  return (
    <Box className={classes.formWrapper} m={6}>
      <Paper className={classes.formPaper}>
        <ValidatorForm onSubmit={handleSubmit}>
          <Typography variant="h4">Sign Up</Typography>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="normal"
              label="Email"
              variant="outlined"
              name="email"
              value={email}
              placeholder=""
              onChange={handleEmailChange}
              required
              validators={["required", "isEmail"]}
              errorMessages={["Please enter an email", "Email is not valid"]}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="normal"
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              value={password}
              validators={["required", "minNumber:6"]}
              errorMessages={[
                "Please enter a password",
                "Password must have at least 6 characters"
              ]}
              onChange={handlePasswordChange}
              required
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <TextValidator
              margin="normal"
              variant="outlined"
              label="Confirm Password"
              name="password"
              type="password"
              value={confirmedPassword}
              validators={["required", "isPasswordMatch"]}
              errorMessages={[
                "Please confirm password",
                "Passwords must match"
              ]}
              onChange={handleConfirmPasswordChange}
              required
            />
          </FormControl>
          <Button variant="outlined" type="submit">
            Sign up
          </Button>
        </ValidatorForm>
      </Paper>
    </Box>
  );
};
export default SignupContainer;
