const { createPersona, GENDER } = require('../persona-builder');

// Straight pathway - Religious importance branch
// These use NON-CHRISTIAN religions to test the direct path to spiritual question
// (Christian personas are in christian-personas.js)

const religiousVeryImportant = createPersona('Straight_Man_Jewish_VeryImportant', {
  gender: GENDER.MAN,
  orientation: 'Straight',
  relationship: 'Single',
  religiousImportance: 'VeryImportant',
  religion: 'Judaism',
  spiritual: 'Yes',
  previousTherapy: 'Yes',
});

const religiousImportant = createPersona('Straight_Woman_Muslim_Important', {
  gender: GENDER.WOMAN,
  orientation: 'Straight',
  relationship: 'Married',
  religiousImportance: 'Important',
  religion: 'Islam',
  spiritual: 'Yes',
  previousTherapy: 'No',
});

const religiousSomewhatImportant = createPersona('Straight_Man_Buddhist_SomewhatImportant', {
  gender: GENDER.MAN,
  orientation: 'Straight',
  relationship: 'Divorced',
  religiousImportance: 'SomewhatImportant',
  religion: 'Buddhism',
  spiritual: 'No',
  previousTherapy: 'Yes',
});

const religiousNotImportant = createPersona('Straight_Woman_NotReligious', {
  gender: GENDER.WOMAN,
  orientation: 'Straight',
  relationship: 'Single',
  religiousImportance: 'NotImportantAtAll',
  // No religion question - skips to spiritual
  spiritual: 'No',
  previousTherapy: 'No',
});

module.exports = {
  religiousVeryImportant,
  religiousImportant,
  religiousSomewhatImportant,
  religiousNotImportant,

  // Array for parameterized tests
  allReligiousPersonas: [
    religiousVeryImportant,
    religiousImportant,
    religiousSomewhatImportant,
    religiousNotImportant,
  ],

  // Grouped by branch outcome
  religiousPathPersonas: [
    religiousVeryImportant,
    religiousImportant,
    religiousSomewhatImportant,
  ],
  nonReligiousPathPersonas: [
    religiousNotImportant,
  ],
};
