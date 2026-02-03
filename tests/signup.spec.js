const { test, expect } = require('@playwright/test');
const { SignupPage } = require('../pages/SignupPage');

const {
  religiousPathPersonas,
  nonReligiousPathPersonas
} = require('../test-data/straight-path/religious-personas');

const {
  christianTherapyYesPersonas,
  christianTherapyNoPersonas
} = require('../test-data/straight-path/christian-personas');

const {
  specialistYesPersonas,
  specialistNoPersonas
} = require('../test-data/lgbtq-path/lgbtq-personas');


test.describe('BetterHelp Signup - Straight Pathway', () => {

  test.describe('Religious Branch - Non-Christian', () => {

    for (const persona of religiousPathPersonas) {
      test(`${persona.id}`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Straight orientation - skips LGBTQ questions
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // Relationship Status
        await signup.waitForRelationshipQuestion();
        await signup.selectRelationship(persona.relationship);

        // Religious Importance
        await signup.waitForReligiousImportanceQuestion();
        await signup.selectReligiousImportance(persona.religiousImportance);

        // Religion selection
        await signup.waitForReligionQuestion();
        await signup.selectReligion(persona.religion);

        // Spiritual question (non-Christian religions go straight here)
        await signup.waitForSpiritualQuestion();
        await signup.selectSpiritual(persona.spiritual);

        // Previous therapy question
        await signup.waitForPreviousTherapyQuestion();
        await signup.selectPreviousTherapy(persona.previousTherapy);
      });
    }

  });

  test.describe('Religious Branch - Not Important', () => {

    for (const persona of nonReligiousPathPersonas) {
      test(`${persona.id}`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Straight orientation - skips LGBTQ questions
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // Relationship Status
        await signup.waitForRelationshipQuestion();
        await signup.selectRelationship(persona.relationship);

        // Religious Importance - "Not Important" skips religion question
        await signup.waitForReligiousImportanceQuestion();
        await signup.selectReligiousImportance(persona.religiousImportance);

        // Spiritual question (skips religion, goes straight here)
        await signup.waitForSpiritualQuestion();
        await signup.selectSpiritual(persona.spiritual);

        // Previous therapy question
        await signup.waitForPreviousTherapyQuestion();
        await signup.selectPreviousTherapy(persona.previousTherapy);
      });
    }

  });

  test.describe('Christian Branch - Wants Christian Therapy', () => {

    for (const persona of christianTherapyYesPersonas) {
      test(`${persona.id}`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Straight orientation - skips LGBTQ questions
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // Relationship Status
        await signup.waitForRelationshipQuestion();
        await signup.selectRelationship(persona.relationship);

        // Religious Importance
        await signup.waitForReligiousImportanceQuestion();
        await signup.selectReligiousImportance(persona.religiousImportance);

        // Religion selection - Christianity
        await signup.waitForReligionQuestion();
        await signup.selectReligion(persona.religion);

        // Christian-specific: Do you want Christian therapy?
        await signup.waitForChristianTherapyQuestion();
        await signup.selectChristianTherapy(persona.christianTherapy);

        // Spiritual question
        await signup.waitForSpiritualQuestion();
        await signup.selectSpiritual(persona.spiritual);

        // Previous therapy question
        await signup.waitForPreviousTherapyQuestion();
        await signup.selectPreviousTherapy(persona.previousTherapy);
      });
    }

  });

  test.describe('Christian Branch - No Christian Therapy', () => {

    for (const persona of christianTherapyNoPersonas) {
      test(`${persona.id}`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Straight orientation - skips LGBTQ questions
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // Relationship Status
        await signup.waitForRelationshipQuestion();
        await signup.selectRelationship(persona.relationship);

        // Religious Importance
        await signup.waitForReligiousImportanceQuestion();
        await signup.selectReligiousImportance(persona.religiousImportance);

        // Religion selection - Christianity
        await signup.waitForReligionQuestion();
        await signup.selectReligion(persona.religion);

        // Christian-specific: Do you want Christian therapy? - No
        await signup.waitForChristianTherapyQuestion();
        await signup.selectChristianTherapy(persona.christianTherapy);

        // Spiritual question
        await signup.waitForSpiritualQuestion();
        await signup.selectSpiritual(persona.spiritual);

        // Previous therapy question
        await signup.waitForPreviousTherapyQuestion();
        await signup.selectPreviousTherapy(persona.previousTherapy);
      });
    }

  });

});


test.describe('BetterHelp Signup - LGBTQ+ Pathway', () => {

  test.describe('LGBTQ+ Specialist - Yes', () => {

    for (const persona of specialistYesPersonas) {
      test(`${persona.id} - wants LGBTQ+ specialist`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Non-straight orientation - triggers LGBTQ branch
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // LGBTQ+ Specialist question
        await signup.waitForLGBTQSpecialistQuestion();
        await signup.selectLGBTQSpecialist(persona.lgbtqSpecialist);

        // TODO: Discover the next questions in the LGBTQ+ Yes flow
        // The flow after selecting "Yes" for LGBTQ+ specialist may differ
      });
    }

  });

  test.describe('LGBTQ+ Specialist - No', () => {

    for (const persona of specialistNoPersonas) {
      test(`${persona.id} - no LGBTQ+ specialist preference`, async ({ page }) => {
        const signup = new SignupPage(page);

        await signup.startQuestionnaireBasics(persona);

        // Non-straight orientation - triggers LGBTQ branch
        await signup.waitForIdentityQuestion();
        await signup.selectSexualOrientation(persona.orientation);

        // LGBTQ+ Specialist question 
        await signup.waitForLGBTQSpecialistQuestion();
        await signup.selectLGBTQSpecialist(persona.lgbtqSpecialist);

      });
    }

  });

});
