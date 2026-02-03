// Base persona with only truly common defaults
// Gender is NOT included - it's a required test variable
const basePersona = {
  country: 'United States',
  age: '42',
};

// Gender options for reference
const GENDER = {
  MAN: 'Man',
  WOMAN: 'Woman',
  // More Options (requires clicking "More options" first)
  NON_BINARY: "Non Binary",
  TRANSFEMININE: "Transfeminine",
  TRANSMASCULINE: "Transmasculine",
  AGENDER: "AGENDER",
  I_DONT_KNOW: "I don't know",
  PREFER_NOT_TO_SAY: "Prefer not to say",
  OTHER: 'Other'

};

// Factory function to create personas with overrides
const createPersona = (id, overrides) => ({
  id,
  ...basePersona,
  ...overrides,
});

// Helper to check if gender requires "More Options" click
const requiresMoreOptions = (gender) => {
  return ![GENDER.MAN, GENDER.WOMAN].includes(gender);
};

module.exports = {
  basePersona,
  createPersona,
  GENDER,
  requiresMoreOptions,
};
