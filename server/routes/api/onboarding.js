const router = require("express").Router();
const { User } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

const steps = [
  [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "bio",
      label: "Bio",
      type: "multiline-text",
    },
  ],
  [
    {
      name: "country",
      label: "Country",
      type: "text",
      required: true,
    },
    {
      name: "receiveNotifications",
      label:
        "Would you like to receive email notifications for new messages when logged out?",
      type: "yes-no",
      required: true,
    },
    {
      name: "receiveUpdates",
      label: "Would you like to receive product updates via email?",
      type: "yes-no",
      required: true,
    },
  ],
];

// get onboarding form
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (user.completedOnboarding === true){
      return res.status(200).json({ error: "User has already completed onboarding" })
    }
  
    const { steps } = req.body;
    const mergedArrays = [].concat.apply([], steps);
    const missingKeyOrValue = mergedArrays.some(
      (k) => k?.name === null || k?.value === null
    );
    if (missingKeyOrValue) {
      return res.status(400).json({ error: "Missing value or name in onboarding questions." })
    }
    const mergedObject = mergedArrays.reduce(
      (obj, item) => Object.assign(obj, { [item?.name]: item?.value }),
      {}
    );
    if (
      !mergedObject?.firstName ||
      !mergedObject?.country ||
      mergedObject.receiveUpdates === null || 
      mergedObject.receiveNotifications === null
    ) {
      return res.status(400).json({ error: "Missing required fields." })
    }
    mergedObject["completedOnboarding"] = true;
    const result = await User.update(mergedObject, { where: { id: userId } });
  
    if (result.length === 1) {
       // Only one user should be affected.
      const updatedUser = await User.findByPk(userId);
      const body = {...updatedUser.dataValues};
      delete body["password"];
      delete body["salt"];
      return res.status(200).json(updatedUser);
    } else {
      return res.status(500).json({ error: "Unable to properly update user." })
    }
   
  } catch (error) {
    next(error);
  }
});

module.exports = router;
