export const Constants = {
  SETTINGS: "Settings",
  PARTICIPANTS: "Participants",
  SOLUTIONS: "Solutions",

  SETTING_NUMBER_OF_PRO: "Number of pro participants",
  SETTING_NUMBER_OF_NON_PRO: "Number of non pro participants",
  SETTING_MAX_NUMBER_OF_ASSIGNMENTS:
    "Maximum number of assignments per participant",

  PARTICIPANT_NAME: "Name",
  PARTICIPANT_TYPE: "Type",
  PARTICIPANT_LOCATION: "Location",
  PARTICIPANT_SKILLS: "Skills",
  PARTICIPANT_LANGUAGES: "Languages",
  PARTICIPANT_AVAILABILITY: "Availability",
  PARTICIPANT_SKILLS_TO_CERTIFICATE: "Skills to Certificate",
};

const sheetsNames = [
  Constants.SETTINGS,
  Constants.PARTICIPANTS,
  Constants.SOLUTIONS,
];

export const participantsColumns = [
  Constants.PARTICIPANT_NAME,
  Constants.PARTICIPANT_TYPE,
  Constants.PARTICIPANT_LOCATION,
  Constants.PARTICIPANT_SKILLS,
  Constants.PARTICIPANT_LANGUAGES,
  Constants.PARTICIPANT_AVAILABILITY,
  Constants.PARTICIPANT_SKILLS_TO_CERTIFICATE,
];

export interface ValidationResult {
  hasError(): boolean;
  getMessage(): string;
}

class SheetsValidationError implements ValidationResult {
  private hasMissingSheets: boolean = false;
  constructor(public missingSheets: Array<string>) {
    if (missingSheets.length) {
      this.hasMissingSheets = true;
    }
  }

  hasError(): boolean {
    return this.hasMissingSheets;
  }

  getMessage(): string {
    const missing = this.missingSheets.join(", ");
    return `Missing sheets: ${missing}`;
  }
}

export abstract class Validators {
  public static validateSheetsNames(
    names: Array<string>
  ): SheetsValidationError {
    const missingSheets = new Array<string>();
    sheetsNames.forEach((n) => {
      if (!names.includes(n)) {
        missingSheets.push(n);
      }
    });
    return new SheetsValidationError(missingSheets);
  }
}
