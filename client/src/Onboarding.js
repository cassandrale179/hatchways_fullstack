import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  makeStyles,
} from "@material-ui/core";

import { useHistory } from "react-router-dom";
import { makeDeepCopy } from "./utils/util";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  form: {
    background: theme.palette.primary.light,
    width: 500,
    display: "block",
    margin: "auto",
    marginTop: theme.spacing(10),
    padding: theme.spacing(4),
  },
  textField: {
    width: "100%",
    marginBottom: theme.spacing(6),
  },
  error: {
    color: theme.palette.error.main,
    fontSize: 12,
  },
  switch: {
    marginBottom: theme.spacing(4),
  },
}));

const Onboarding = ({ user }) => {
  const history = useHistory();
  const classes = useStyles();

  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(null);
  const [notificationsStep, setNotificationsStep] = useState(null);

  useEffect(() => {
    const getOnboardingSteps = async () => {
      const res = await axios.get("/api/onboarding");
      if (res.status !== 200) {
        return;
      }
      const { steps } = res.data;
      if (steps?.length !== 2) {
        return;
      }

      for (const [index, step] of steps.entries()) {
        for (const element of step) {
          element.value = element?.type === "yes-no" ? false : "";
        }
        steps[index] = step;
        setOnboardingStep(steps[0]);
        setNotificationsStep(steps[1]);
      }
      setStep(0);
    };
    getOnboardingSteps();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);

    const copy = makeDeepCopy(onboardingStep);
    const indexOfFieldToUpdate = copy.findIndex((key) => key.name === name);
    if (indexOfFieldToUpdate === -1) {
      return;
    }
    copy[indexOfFieldToUpdate] = {
      ...copy[indexOfFieldToUpdate],
      value: value,
    };

    setOnboardingStep(copy);
  };

  const handleNext = () => {
    if (onboardingStep.firstName?.length === 0) {
      setErrorMessage("Please fill out all required fields before proceeding");
      return;
    } else {
      setErrorMessage("");
      setStep(1);
    }
  };

  const handleBack = () => {
    setStep(null);
  };

  const handleSubmitForm = () => {
    //
  };

  const renderForm = () => {
    return (
      <Grid container className={classes.form}>
        {onboardingStep.map((step) => (
          <TextField
            className={classes.textField}
            label={step.label}
            name={step.name}
            variant="standard"
            required={step.required}
            value={step.value}
            onChange={handleChange}
            multiline={step.type === "multiline-text"}
            rows={step.type === "multiline-text" && 4}
          />
        ))}

        <Typography gutterBottom className={classes.error}>
          {errorMessage}
        </Typography>

        <Grid container item xs={12} justify="flex-end">
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            onClick={handleNext}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderSubscribeForm = () => {
    return (
      <Grid className={classes.form}>
        <FormGroup>
          <FormControlLabel
            className={classes.switch}
            control={<Switch color="primary" />}
            label="I would like to receive email notifications for new messages when I'm logged out"
          />
          <FormControlLabel
            className={classes.switch}
            control={<Switch color="primary" />}
            label="I would like to receive updates about the product via email"
          />
        </FormGroup>
        <Grid container direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.formButton}
            onClick={handleSubmitForm}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      {onboardingStep && notificationsStep ? (
        <> {step === 0 ? renderForm() : renderSubscribeForm()} </>
      ) : (
        <div> Loading ... </div>
      )}
    </>
  );
};

export default Onboarding;
