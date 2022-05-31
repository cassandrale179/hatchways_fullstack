import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
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
        setErrorMessage("Unable to fetch onboarding steps");
        return;
      }
      const { steps } = res.data;
      if (steps?.length !== 2) {
        return;
      }

      for (const [index, step] of steps.entries()) {
        for (const element of step) {
          element.value = element?.type === "yes-no" ? null : "";
        }
        steps[index] = step;
        setOnboardingStep(steps[0]);
        setNotificationsStep(steps[1]);
      }
      setStep(0);
    };

    getOnboardingSteps();

    if (user && user.id && user.completedOnboarding){
      history.push("/home");
    } else {
      getOnboardingSteps();
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (stepToUpdate, name, value) => {
    const copy = makeDeepCopy(stepToUpdate);
    const field = copy.findIndex((key) => key.name === name);
    if (field === -1) {
      return;
    }
    if (copy[field]?.type === "yes-no") {
      if (copy[field].value === null) {
        value = true;
      } else {
        value = !copy[field].value;
      }
    }
    copy[field] = {
      ...copy[field],
      value: value,
    };
    return copy;
  };

  const handleOnboardingUpdate = (event) => {
    let { name, value } = event.target;
    const copy = updateField(onboardingStep, name, value);
    setOnboardingStep(copy);
  };

  const handleNotificationUpdate = (event) => {
    let { name, value } = event.target;
    const copy = updateField(notificationsStep, name, value);
    setNotificationsStep(copy);
  };

  const handleNext = () => {
    const invalid = onboardingStep.findIndex(
      (key) => key.value === "" && key.required
    );
    if (invalid !== -1) {
      setErrorMessage("Please fill out all required fields before proceeding");
      return;
    } else {
      setErrorMessage("");
      setStep(1);
    }
  };

  const handleBack = () => {
    setStep(0);
  };

  const getNameAndValueOnly = (stepToExtract) => {
    const data = [];
    for (const field of stepToExtract){
      const filteredField = (({ name, value }) => ({ name, value }))(field);
      data.push(filteredField)
    }
    return data;
  }

  const handleSubmitForm = async () => {
    const invalid = notificationsStep.findIndex(
      (key) => (key.value === "" || key.value === null) && key.required
    );
    if (invalid !== -1) {
      setErrorMessage("Please fill out all required fields before proceeding");
      return;
    } else {
      setErrorMessage("");      
      const body = {
        "steps": [
          getNameAndValueOnly(onboardingStep),
          getNameAndValueOnly(notificationsStep),
        ]
      }
      const res = await axios.post("/api/onboarding", body); 
      if (res.status === 200){
        history.push("/home");
      } else {
        console.log(res)
      }
    }
  };

  const renderOnboardingForm = () => {
    return (
      <Grid container className={classes.form}>
        {onboardingStep.map((step) => (
          <>
          <TextField
            key={step.name}
            className={classes.textField}
            label={step.label}
            name={step.name}
            variant="standard"
            required={step.required}
            value={step.value}
            onChange={handleOnboardingUpdate}
            multiline={step.type === "multiline-text"}
            rows={4}
          />
          </>
        ))}

        <Typography gutterBottom className={classes.error}>
          {errorMessage}
        </Typography>

        <Grid container item xs={12} justifyContent="flex-end">
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

  const renderNotificationForm = () => {
    return (
      <Grid className={classes.form}>
        {notificationsStep.map((step) =>
          step.type === "yes-no" ? (
            <FormControlLabel
              key={step.name}
              onChange={handleNotificationUpdate}
              className={classes.switch}
              control={<Switch color="primary" checked={step.value === true} />}
              label={step.label}
              name={step.name}
              required={step.required}
            />
          ) : (
            <TextField
              key={step.name}
              className={classes.textField}
              label={step.label}
              name={step.name}
              variant="standard"
              required={step.required}
              value={step.value}
              onChange={handleNotificationUpdate}
              multiline={step.type === "multiline-text"}
              rows={4}
            />
          )
        )}
        <Typography gutterBottom className={classes.error}>
          {errorMessage}
        </Typography>

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
        <> {step === 0 ? renderOnboardingForm() : renderNotificationForm()} </>
      ) : (
        <div> Loading ... </div>
      )}
    </>
  );
};

export default Onboarding;
