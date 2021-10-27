export const Constants = {
  SETTINGS: "Settings",
  PARTICIPANTS: "Participants",
  SOLUTIONS: "Solutions",
};

const sheetsNames = [
  Constants.SETTINGS,
  Constants.PARTICIPANTS,
  Constants.SOLUTIONS,
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
