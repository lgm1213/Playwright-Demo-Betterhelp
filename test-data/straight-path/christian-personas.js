const { createPersona, GENDER } = require('../persona-builder');

// Christian pathway - Branch after selecting Christianity as religion
// Question: "Would you like to be matched with a therapist who provides Christian-based therapy?"

// Christian therapy - Yes branch
const christianTherapyYesSpiritual = createPersona('Christian_TherapyYes_Spiritual_TherapyBefore', {
  gender: GENDER.MAN,
  orientation: 'Straight',
  relationship: 'Single',
  religiousImportance: 'VeryImportant',
  religion: 'Christianity',
  christianTherapy: 'Yes',
  spiritual: 'Yes',
  previousTherapy: 'Yes',
});

const christianTherapyYesNotSpiritual = createPersona('Christian_TherapyYes_NotSpiritual_NoTherapyBefore', {
  gender: GENDER.WOMAN,
  orientation: 'Straight',
  relationship: 'Married',
  religiousImportance: 'Important',
  religion: 'Christianity',
  christianTherapy: 'Yes',
  spiritual: 'No',
  previousTherapy: 'No',
});

// Christian therapy - No branch
const christianTherapyNoSpiritual = createPersona('Christian_TherapyNo_Spiritual_TherapyBefore', {
  gender: GENDER.MAN,
  orientation: 'Straight',
  relationship: 'Divorced',
  religiousImportance: 'SomewhatImportant',
  religion: 'Christianity',
  christianTherapy: 'No',
  spiritual: 'Yes',
  previousTherapy: 'Yes',
});

const christianTherapyNoNotSpiritual = createPersona('Christian_TherapyNo_NotSpiritual_NoTherapyBefore', {
  gender: GENDER.WOMAN,
  orientation: 'Straight',
  relationship: 'Widowed',
  religiousImportance: 'VeryImportant',
  religion: 'Christianity',
  christianTherapy: 'No',
  spiritual: 'No',
  previousTherapy: 'No',
});

module.exports = {
  // Individual exports
  christianTherapyYesSpiritual,
  christianTherapyYesNotSpiritual,
  christianTherapyNoSpiritual,
  christianTherapyNoNotSpiritual,

  // Grouped by Christian therapy preference
  christianTherapyYesPersonas: [
    christianTherapyYesSpiritual,
    christianTherapyYesNotSpiritual,
  ],
  christianTherapyNoPersonas: [
    christianTherapyNoSpiritual,
    christianTherapyNoNotSpiritual,
  ],

  // All Christian branch personas
  allChristianPersonas: [
    christianTherapyYesSpiritual,
    christianTherapyYesNotSpiritual,
    christianTherapyNoSpiritual,
    christianTherapyNoNotSpiritual,
  ],
};
