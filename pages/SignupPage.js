const { expect } = require('@playwright/test')

class SignupPage {
  constructor(page) {
    this.page = page;

    // Selectors
    // Navigation & Buttons
    this.getStartedButton = page.getByTestId('get-started-nav');
    this.nextButton = page.getByTestId('next-button');
    this.previousQuestionButton = page.getByTestId('back-button');

    // Therapy Type
    this.individualTitle = page.locator('label', { hasText: 'Individual'});

    // Country Selection
    this.countryTrigger = page.getByRole('combobox');

    // Gender Selections
    this.genderPrompt = page.getByText(/what is your gender identity\?/i);

    // Age Selections
    this.agePrompt = page.getByText(/how old are you\?/i);
    this.ageTrigger = page.locator('#mui-component-select-question-Age');
    

    // Identity/Orientation Selections
    this.identifyPrompt = page.getByText(/how do you identify\?/i);
    this.menuContainer = page.getByRole('listbox');
    this.lgbtqSpecialistPrompt = page.getByText(/Would you like to be matched with a therapist who specializes in LGBTQ\+ issues\?/i);

    // Relationship Status Selection
    this.relationshipStatusPrompt = page.getByText(/what is your relationship status\?/i);

    // Religious Questions Selections
    this.religousImportancePrompt = page.getByText(/how important is religion in your life\?/i);
    this.religiousIdentityPrompt = page.getByText(/which religion do you identify with\?/i);

    // Christian-specific branch
    this.christianTherapyPrompt = page.getByText(/would you like to be matched with a therapist who provides christian-based therapy\?/i);

    // Spiritual question (after religion branch or if religion not important)
    this.spiritualPrompt = page.getByText(/do you consider yourself to be spiritual\?/i);

    // Previous therapy question
    this.previousTherapyPrompt = page.getByText(/have you ever been in therapy before\?/i);
    
  }

  // POM Navigation Workflow Directions
  async navigate() {
    await this.page.goto('/')
    await this.getStartedButton.click()
  }

  async goToPreviousQuestion() {
    await this.previousQuestionButton.waitFor({ state: 'visible' });
    await this.previousQuestionButton.click({ force: true });
  }

  async selectMoreOptions() {
    await this.moreOptions.waitFor({ state: 'visible'});
    await this.moreOptions.click();
  }

  async proceed() {
    await this.nextButton.click();
  }

  async selectIndividualTherapy() {
    await this.individualTitle.click();
  }

  // POM Questionnaire Prompts
  async selectCountry(name) {
    // Click the trigger and wait for the menu to render
    await this.countryTrigger.click();
    await this.menuContainer.waitFor({ state: 'visible'});

    // Finds the specific option within the menu
    const option = this.menuContainer.getByRole('option', { name, exact: true});
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  async selectGender(gender) {
    // Wait for gender prompt to confirm we're on the right page
    await expect(this.genderPrompt).toBeVisible({ timeout: 10000 });
    await this.genderPrompt.scrollIntoViewIfNeeded();

    // Primary options: Man, Woman
    // More Options require clicking the "More options" button first
    const moreOptionsGenders = ["Non Binary", "Transfeminine", "Transmasculine", "Agender", "I don't know", "Prefer not to say", "Other"];

    // Map display values to label for attribute IDs
    const genderLabelMap = {
      "Man": "Man",
      "Woman": "Woman",
      "Non Binary": "NonBinary",
      "Transfeminine": "Transfeminine",
      "Transmasculine": "Transmasculine",
      "Agender": "Agender",
      "I don't know": "Unknown",
      "Prefer not to say": "PreferNotToSay",
      "Other": "Other"
    };

    if (moreOptionsGenders.includes(gender)) {
      // Finds the "More Options" button within the gender question container
      const moreOptionsBtn = this.page.getByRole('button', { name: 'More options' }).filter({ visible: true });
      await moreOptionsBtn.scrollIntoViewIfNeeded();
      await moreOptionsBtn.click();
      // Waits for options to expand
      await this.page.waitForTimeout(500);
    }

    const labelId = genderLabelMap[gender] || gender;
    const label = this.page.locator(`label[for="question-GenderIdentity-${labelId}"]`);
    await label.scrollIntoViewIfNeeded();
    await label.click();

    // "Other" gender option requires entering text in an input field and clicking the Next button
    if (gender === "Other") {
      const otherInput = this.page.getByTestId('question-other-text');
      await otherInput.waitFor({ state: 'visible', timeout: 5000 });
      await otherInput.fill('Test gender identity');
      // Clicks the visible Next button (the one in the current question context)
      const visibleNextBtn = this.page.getByTestId('next-button').filter({ visible: true }).last();
      await visibleNextBtn.click();
    }
  }

  async waitForAgeQuestion(){
    await this.agePrompt.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.agePrompt).toBeVisible();
  }

  async selectAge(age) {
    await this.ageTrigger.waitFor({ state: 'visible'});
    await this.ageTrigger.click();

    await this.menuContainer.waitFor({ state: 'visible' });
    const option = this.menuContainer.getByRole('option', { name: age.toString(), exact: true });

    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  // POM Questionnaire Base Persona
  async startQuestionnaireBasics(persona) {
    await this.navigate();
    await this.selectIndividualTherapy();
    await this.selectCountry('United States');
    await this.proceed();

    await this.selectGender(persona.gender);
    await this.waitForAgeQuestion();
    await this.selectAge(persona.age);
  }

  async waitForIdentityQuestion(){
    await expect(this.identifyPrompt).toBeVisible({ timeout: 10000});
    await expect(this.identifyPrompt).toHaveText("How do you identify?");
  }

  async selectSexualOrientation(identity) {
    // Options that require clicking "More options" first
    const moreOptionsOrientations = ["Questioning", "Queer", "Asexual", "DoNotKnow", "Other"];

    if (moreOptionsOrientations.includes(identity)) {
      // Get the last visible "More options" button (the one for the current orientation question)
      const moreOptionsBtn = this.page.getByRole('button', { name: 'More options' }).filter({ visible: true }).last();
      await moreOptionsBtn.scrollIntoViewIfNeeded();
      await moreOptionsBtn.click();
      await this.page.waitForTimeout(500);
    }

    const label = this.page.locator(`label[for="question-Identify-${identity}"]`);
    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  async waitForLGBTQSpecialistQuestion(){
    await expect(this.lgbtqSpecialistPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.lgbtqSpecialistPrompt).toHaveText("Would you like to be matched with a therapist who specializes in LGBTQ+ issues?");
  }

  async selectLGBTQSpecialist(match) {
    // Values: 'Yes', 'No'
    const selector = `label[for="question-MatchLGBTQ-${match}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }
  
  async waitForRelationshipQuestion(){
    await expect(this.relationshipStatusPrompt).toBeVisible({ timeout: 10000});
    await expect(this.relationshipStatusPrompt).toHaveText('What is your relationship status?')
  }

  async selectRelationship(status) {
    const selector = `label[for="question-RelationshipStatus-${status}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  async waitForReligiousImportanceQuestion() {
    await expect(this.religousImportancePrompt).toBeVisible({ timeout: 10000 });
    await expect(this.religousImportancePrompt).toHaveText("How important is religion in your life?");
  }

  async selectReligiousImportance(importance) {
    // Values: 'VeryImportant', 'Important', 'SomewhatImportant', 'NotImportantAtAll'
    const selector = `label[for="question-HowImportantIsReligion-${importance}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  async waitForReligionQuestion() {
    await expect(this.religiousIdentityPrompt).toBeVisible({timeout: 10000});
    await expect(this.religiousIdentityPrompt).toHaveText("Which religion do you identify with?");
  }

  async selectReligion(religion) {
    const selector = `label[for="question-ReligionFromHowImportantIsReligion-${religion}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  // Christian-specific branch (only appears if Christianity is selected as a religion)
  async waitForChristianTherapyQuestion() {
    await expect(this.christianTherapyPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.christianTherapyPrompt).toHaveText("Would you like to be matched with a therapist who provides Christian-based therapy?")
  }

  async selectChristianTherapy(preference) {
    // Values: 'Yes', 'No'
    const selector = `label[for="question-MatchChristian-${preference}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  // Spiritual question (appears after religion prompt)
  async waitForSpiritualQuestion() {
    await expect(this.spiritualPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.spiritualPrompt).toHaveText("Do you consider yourself to be spiritual?");
  }

  async selectSpiritual(answer) {
    // Values: 'Yes', 'No'
    const selector = `label[for="question-IsSpiritual-${answer}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }

  // Previous therapy question
  async waitForPreviousTherapyQuestion() {
    await expect(this.previousTherapyPrompt).toBeVisible({ timeout: 10000 });
  }

  async selectPreviousTherapy(answer) {
    // Values: 'Yes', 'No'
    const selector = `label[for="question-PreviousTherapy-${answer}"]`;
    const label = this.page.locator(selector);

    await label.scrollIntoViewIfNeeded();
    await label.click();
  }


  async fillInputField(labelText, value) {
    const input = this.page.getByTestId('question-other-text')

  }

  
}

module.exports = { SignupPage };