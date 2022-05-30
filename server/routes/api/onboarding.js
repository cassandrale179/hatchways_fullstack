const router = require('express').Router();
const { User } = require('../../db/models');
const { Op } = require('sequelize');
const onlineUsers = require('../../onlineUsers');

const steps = [
  [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'multiline-text',
    },
  ],
  [
    {
      name: 'country',
      label: 'Country',
      type: 'text',
      required: true,
    },
    {
      name: 'receiveNotifications',
      label:
        'Would you like to receive email notifications for new messages when logged out?',
      type: 'yes-no',
      required: true,
    },
    {
      name: 'receiveUpdates',
      label: 'Would you like to receive product updates via email?',
      type: 'yes-no',
      required: true,
    },
  ],
];

// get onboarding form
router.get('/', async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    return res.status(200).json({ steps });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
