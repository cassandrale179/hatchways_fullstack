## Onboarding Proposal 



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