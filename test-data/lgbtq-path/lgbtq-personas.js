const { createPersona } = require('../persona-builder');

// LGBTQ+ pathway - Any non-straight orientation triggers this branch
// First branch: LGBTQ+ specialist question (Yes/No)

// Gay orientation variants
const gaySpecialistYes = createPersona('Gay_Specialist_Yes', {
  gender: 'Man',
  orientation: 'Gay',
  lgbtqSpecialist: 'Yes',
  relationship: 'Single',
});

const gaySpecialistNo = createPersona('Gay_Specialist_No', {
  gender: 'Man',
  orientation: 'Gay',
  lgbtqSpecialist: 'No',
  relationship: 'Single',
});

// Lesbian orientation variants
const lesbianSpecialistYes = createPersona('Lesbian_Specialist_Yes', {
  gender: 'Woman',
  orientation: 'Lesbian',
  lgbtqSpecialist: 'Yes',
  relationship: 'Married',
});

const lesbianSpecialistNo = createPersona('Lesbian_Specialist_No', {
  gender: 'Woman',
  orientation: 'Lesbian',
  lgbtqSpecialist: 'No',
  relationship: 'Married',
});

// Bisexual/Pansexual variants
const biPanSpecialistYes = createPersona('BiPan_Specialist_Yes', {
  gender: 'Man',
  orientation: 'BiPan',
  lgbtqSpecialist: 'Yes',
  relationship: 'Relationship',
});

const biPanSpecialistNo = createPersona('BiPan_Specialist_No', {
  gender: 'Woman',
  orientation: 'BiPan',
  lgbtqSpecialist: 'No',
  relationship: 'Relationship',
});

// Other orientations - add as needed
const queerSpecialistYes = createPersona('Queer_Specialist_Yes', {
  gender: 'Woman',
  orientation: 'Queer',
  lgbtqSpecialist: 'Yes',
  relationship: 'Single',
});

const asexualSpecialistNo = createPersona('Asexual_Specialist_No', {
  gender: 'Man',
  orientation: 'Asexual',
  lgbtqSpecialist: 'No',
  relationship: 'Single',
});

module.exports = {
  // Individual exports
  gaySpecialistYes,
  gaySpecialistNo,
  lesbianSpecialistYes,
  lesbianSpecialistNo,
  biPanSpecialistYes,
  biPanSpecialistNo,
  queerSpecialistYes,
  asexualSpecialistNo,

  // Grouped by specialist preference
  specialistYesPersonas: [
    gaySpecialistYes,
    lesbianSpecialistYes,
    biPanSpecialistYes,
    queerSpecialistYes,
  ],
  specialistNoPersonas: [
    gaySpecialistNo,
    lesbianSpecialistNo,
    biPanSpecialistNo,
    asexualSpecialistNo,
  ],

  // All LGBTQ personas
  allLgbtqPersonas: [
    gaySpecialistYes,
    gaySpecialistNo,
    lesbianSpecialistYes,
    lesbianSpecialistNo,
    biPanSpecialistYes,
    biPanSpecialistNo,
    queerSpecialistYes,
    asexualSpecialistNo,
  ],
};
