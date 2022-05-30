## Onboarding Proposal 



### Question 1
Please describe a couple different ways that you could have approached state management for Part 1 of this ticket, and the advantages and disadvantages of each.


## Current Approach
So at the current moment, I think the way I approached the state management for Part 1 is a bit hardcoded. I have two states set, with one for each steps `onboardingStep` and `notificstionsStep`. 

An advantage of this is that when updating state changes it is not too commplicated because you just need
to loop through the desired array of the current step to find the field to update `const field = onboardingSteps.findIndex((key) => key.name === name);` 

```javascript
onboardingSteps = [{ name: 'firstName' }, {name: 'lastName'}]
// key to look for = "firstName"
```
This would take O(n) time when updating because you only need to loop through the object once where n is the number of questions for each step. 

However, the disadvantage of this approach is that is that by storing each step as a state variable, it is not very scalable if we receive a very complicated onboarding that has multiple steps.

## Potential Approach
Another potential approach is instead of storing each step as a state, have a state variable `steps` that store
all the steps from `GET api/onboarding` into a variable as is: 

```javascript
const steps = {
  [{'name': 'firstName', 'type': 'text'}, {'name': 'lastName', 'type': 'text'}], 
  [{'name': 'country', 'type': 'text}....], 
}
```

The advantage is that you do not need to create K state variables to store each step where K is equal to the number of steps in an onboarding form. 

The disadvantage is that rendering the form on the frontend might be slightly complicated, especially when updating the variable as user enter their name / country...etc. One would first have to loop through each step, then for each step looped through all the questions per step to find the desired updated field.


### Question 2 
For the onboarding form, I would first define a model called Onboarding, so a file name `db/models/onboarding.js`. 

```javascript
const { Op } = require("sequelize");
const db = require("../db");

const Onboarding = db.define("onboarding", {});

module.exports = Onboarding;
```

It will be a one-to-many relationship, where an onboarding can have multiple questions,
but each question only belongs to one onboarding form. This can be defined within  `db/models/index.js` as something along the line of:

```javascript
Onboarding.hasMany(Question, { foreignKey : 'onboardingId'})
Question.belongsTo(Onboarding, { foreignKey : 'onboardingId'})
```

For an onboarding question, we can create a file `db/models/question.js` with the following main attributes:
- "name": a unique string that stores the name of the quesiton, (e.g "firstName" or "lastName") 
- "label": the label for the text field, such as "First Name"
- "type": the type of that input field, such as "yes-no" or "text". A potential approach is to define
this properties so that the type can only be from a list of potential form types (such as only either "yes-no", "text", or "multiline-text")
- required: whether the field is required in the form 
- stepValue: this store what step the question should be in for that onboarding form. So for example, if a question has a step value of 0, then it would appear with other questions that are in the same steps.


```javascript 
const Sequelize = require("sequelize");
const db = require("../db");

const Question = db.define("question", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  label: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
        isIn: [['text', 'yes-no', 'multiline-text']]
    }
  },
  required: {
    type: Sequelize.BOOLEAN,
    allowNull: true
  },
  stepValue: {
    type: Sequelize.INTEGER,
    validate: {
      min: 0
    }
  }
});

module.exports = Question;
```