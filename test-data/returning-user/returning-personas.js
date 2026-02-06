const { createPersona, GENDER } = require('../persona-builder');

// Returning user pathway - User has used BetterHelp before and will login
// This triggers the login flow instead of continuing to account creation

const returningUserLogin = createPersona('Returning_User_Login', {
  gender: GENDER.MAN,
  orientation: 'Straight',
  relationship: 'Single',
  religiousImportance: 'NotImportantAtAll',
  spiritual: 'No',
  previousTherapy: 'Yes',
  usedBetterHelp: 'Yes',
  country: 'United States',
  email: process.env.BETTERHELP_EMAIL,
  password: process.env.BETTERHELP_PASSWORD,
});

module.exports = {
  returningUserLogin,

  // Array for parameterized tests
  returningUserPersonas: [
    returningUserLogin,
  ],
};
