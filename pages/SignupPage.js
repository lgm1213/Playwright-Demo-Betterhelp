const { expect } = require('@playwright/test')

class SignupPage {
  constructor(page) {
    this.page = page;

    // Selectors
    // Navigation & Buttons
    this.getStartedButton = page.getByTestId('get-started-nav');
    this.nextButton = page.getByTestId('next-button');
    this.previousQuestionButton = page.getByTestId('back-button');

    //Questionnaire Starts
    this.questionnaireContentLabel = page.getByTestId("questionnaire-content-label")

    // Therapy Type
    this.individualTherapy = page.getByText('Individual (for myself)');

    // Country Selection
    this.countryTrigger = page.getByTestId('questionnaire-react-dropdown-trigger');
    this.countryDropdownOptions = page.getByTestId('questionnaire-react-dropdown-options');

    // Gender Selections
    this.genderPrompt = page.getByText(/what is your gender identity\?/i);

    // Age Selections
    this.agePrompt = page.getByText(/how old are you\?/i);
    this.ageTrigger = page.getByRole('button', { name: /select your age/i });

    // Identity/Orientation Selections
    this.identifyPrompt = page.getByText(/how do you identify\?/i);
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

    // BetterHelp usage question (appears if previousTherapy is Yes)
    this.usedBetterHelpPrompt = page.getByText(/was your previous therapy through betterhelp\?/i);

    // Login form selectors for previous Better Help users
    this.loginPrompt = page.getByText(/welcome back\!/i);
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByTestId('eap-admin-login-submit');
    this.loggedInHeader = page.getByTestId('client-header-nick-name');
    this.twoFactorPrompt = page.getByText(/enter your 5-digit verification code/i);

    // Cookie consent banner
    this.cookieConsentButton = page.getByRole('button', { name: 'I Agree' });
  }

  // POM Navigation Workflow Directions
  async navigate() {
    await this.page.goto('/')
    await this.dismissCookieConsent()
    await this.getStartedButton.click();
    await expect(this.questionnaireContentLabel).toBeVisible();
  }

  async dismissCookieConsent() {
    // Dismiss cookie banner if present (don't fail if not shown)
    try {
      await this.cookieConsentButton.click({ timeout: 3000 });
    } catch {
      // Cookie banner not present or already dismissed
    }
  }

  async goToPreviousQuestion() {
    await this.previousQuestionButton.waitFor({ state: 'visible' });
    await this.previousQuestionButton.click({ force: true });
  }

  async proceed() {
    await this.nextButton.waitFor({ state: 'visible' });
    await this.nextButton.click();
  }

  async selectIndividualTherapy() {
    await this.individualTherapy.waitFor({ state: 'visible' });
    await this.individualTherapy.click();
  }

  // POM Questionnaire Prompts
  async selectCountry(name) {
    await this.countryTrigger.click();
    await this.countryDropdownOptions.waitFor({ state: 'visible' });

    // The selected option includes "checkmark" in its accessible name
    const option = this.page.getByRole('option', { name: `${name} checkmark` });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  async selectGender(gender) {
    // Wait for gender prompt to confirm we're on the right page
    await expect(this.genderPrompt).toBeVisible({ timeout: 10000 });

    // More Options genders require clicking the "More options" button first
    const moreOptionsGenders = ["Non Binary", "Transfeminine", "Transmasculine", "Agender", "I don't know", "Prefer not to say", "Other"];

    // Scope to gender question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.genderPrompt
    });

    if (moreOptionsGenders.includes(gender)) {
      await questionContainer.getByRole('button', { name: 'More options' }).click();
    }

    await questionContainer.getByText(gender, { exact: true }).click();

    // "Other" gender option requires entering text
    if (gender === "Other") {
      const otherInput = this.page.getByTestId('question-other-text');
      await otherInput.fill('Test gender identity');
      await this.nextButton.click();
    }
  }

  async waitForAgeQuestion(){
    await this.agePrompt.waitFor({ state: 'visible', timeout: 10000 });
    await expect(this.agePrompt).toBeVisible();
  }

  async selectAge(age) {
    await this.ageTrigger.click();
    await this.countryDropdownOptions.waitFor({ state: 'visible' });

    const option = this.page.getByRole('option', { name: age.toString(), exact: true });
    await option.scrollIntoViewIfNeeded();
    await option.click();
  }

  // POM Questionnaire Base Persona
  async startQuestionnaireBasics(persona) {
    await this.navigate();
    await this.selectIndividualTherapy();
    await this.selectCountry(persona.country);
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
    // Map persona values to display text
    const identityTextMap = {
      'Straight': 'Straight',
      'Gay': 'Gay',
      'Lesbian': 'Lesbian',
      'BiPan': 'Bi or Pan',
      'BiOrPan': 'Bi or Pan',
      'PreferNotToSay': 'Prefer not to say',
      'Questioning': 'Questioning',
      'Queer': 'Queer',
      'Asexual': 'Asexual',
      'DoNotKnow': "I don't know",
      'Other': 'Other'
    };

    // More Options orientations require clicking the button first
    const moreOptionsOrientations = ["Questioning", "Queer", "Asexual", "DoNotKnow", "Other"];

    // Scope to identity question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.identifyPrompt
    });

    if (moreOptionsOrientations.includes(identity)) {
      await questionContainer.getByRole('button', { name: 'More options' }).click();
    }

    const displayText = identityTextMap[identity] || identity;
    await questionContainer.getByText(displayText, { exact: true }).click();
  }

  async waitForLGBTQSpecialistQuestion(){
    await expect(this.lgbtqSpecialistPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.lgbtqSpecialistPrompt).toHaveText("Would you like to be matched with a therapist who specializes in LGBTQ+ issues?");
  }

  async selectLGBTQSpecialist(match) {
    // Values: 'Yes', 'No' - scope to the LGBTQ question container using role
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.lgbtqSpecialistPrompt
    });
    await questionContainer.getByText(match, { exact: true }).click();
  }

  async waitForRelationshipQuestion(){
    await expect(this.relationshipStatusPrompt).toBeVisible({ timeout: 10000});
    await expect(this.relationshipStatusPrompt).toHaveText('What is your relationship status?')
  }

  async selectRelationship(status) {
    // Map persona values to display text
    const statusTextMap = {
      'Single': 'Single',
      'InARelationship': 'In a relationship',
      'Married': 'Married',
      'Divorced': 'Divorced',
      'Widowed': 'Widowed',
      'Other': 'Other'
    };

    // Scope to relationship question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.relationshipStatusPrompt
    });

    const displayText = statusTextMap[status] || status;
    await questionContainer.getByText(displayText, { exact: true }).click();
  }

  async waitForReligiousImportanceQuestion() {
    await expect(this.religousImportancePrompt).toBeVisible({ timeout: 10000 });
    await expect(this.religousImportancePrompt).toHaveText("How important is religion in your life?");
  }

  async selectReligiousImportance(importance) {
    // Map persona values to display text
    const importanceTextMap = {
      'VeryImportant': 'Very important',
      'Important': 'Important',
      'SomewhatImportant': 'Somewhat important',
      'NotImportantAtAll': 'Not important at all'
    };

    // Scope to religious importance question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.religousImportancePrompt
    });

    const displayText = importanceTextMap[importance] || importance;
    await questionContainer.getByText(displayText, { exact: true }).click();
  }

  async waitForReligionQuestion() {
    await expect(this.religiousIdentityPrompt).toBeVisible({timeout: 10000});
    await expect(this.religiousIdentityPrompt).toHaveText("Which religion do you identify with?");
  }

  async selectReligion(religion) {
    // Map persona values to display text
    const religionTextMap = {
      'Christianity': 'Christianity',
      'Judaism': 'Judaism',
      'Islam': 'Islam',
      'Hinduism': 'Hinduism',
      'Buddhism': 'Buddhism',
      'Other': 'Other',
      'None': 'None',
      'PreferNotToSay': 'Prefer not to say'
    };

    // Scope to religion question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.religiousIdentityPrompt
    });

    const displayText = religionTextMap[religion] || religion;
    await questionContainer.getByText(displayText, { exact: true }).click();
  }

  // Christian-specific branch (only appears if Christianity is selected as a religion)
  async waitForChristianTherapyQuestion() {
    await expect(this.christianTherapyPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.christianTherapyPrompt).toHaveText("Would you like to be matched with a therapist who provides Christian-based therapy?")
  }

  async selectChristianTherapy(preference) {
    // Values: 'Yes', 'No' - scope to the Christian therapy question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.christianTherapyPrompt
    });
    await questionContainer.getByText(preference, { exact: true }).click();
  }

  // Spiritual question (appears after religion prompt)
  async waitForSpiritualQuestion() {
    await expect(this.spiritualPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.spiritualPrompt).toHaveText("Do you consider yourself to be spiritual?");
  }

  async selectSpiritual(answer) {
    // Values: 'Yes', 'No' - scope to the spiritual question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.spiritualPrompt
    });
    await questionContainer.getByText(answer, { exact: true }).click();
  }

  // Previous therapy question
  async waitForPreviousTherapyQuestion() {
    await expect(this.previousTherapyPrompt).toBeVisible({ timeout: 10000 });
  }

  async selectPreviousTherapy(answer) {
    // Values: 'Yes', 'No' - scope to the previous therapy question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.previousTherapyPrompt
    });
    await questionContainer.getByText(answer, { exact: true }).click();
  }

  // BetterHelp usage question (only appears if previousTherapy is Yes)
  async waitForUsedBetterHelpQuestion() {
    await expect(this.usedBetterHelpPrompt).toBeVisible({ timeout: 10000 });
  }

  async selectUsedBetterHelp(answer) {
    // Values: 'Yes', 'No' - scope to the BetterHelp usage question container
    const questionContainer = this.page.getByRole('listitem').filter({
      has: this.usedBetterHelpPrompt
    });
    await questionContainer.getByText(answer, { exact: true }).click();
  }

  // Login flow (appears if usedBetterHelp is Yes)
  async waitForLoginPrompt() {
    await expect(this.loginPrompt).toBeVisible({ timeout: 10000 });
    await expect(this.page.getByText('We know your needs can change')).toBeVisible();
  }

  async login(email, password) {
    await this.emailInput.click();
    await this.emailInput.fill(email);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async performReturningUserLogin(persona) {
    // Complete login flow for returning BetterHelp users
    await this.waitForLoginPrompt();
    await this.login(persona.email, persona.password);
  }

  async verifyLoginSuccess() {
    // if the Login succeeded we will reach the dashboard OR 2FA page
    await expect(
      this.loggedInHeader.or(this.twoFactorPrompt)
    ).toBeVisible({ timeout: 15000 });
  }

}

module.exports = { SignupPage };
