import { Person, Settings } from "src/api";
import { CommitteeSet } from "src/Model/CommitteeSet";
import { PersistenceData } from "src/Model/PersistenceData";
import { Solution } from "src/Model/Solution";
import { SolvedCommittee } from "src/Model/SolvedCommittee";
import XLSX from "xlsx";
import { parseExcelData } from "./ExcelDataParser";
import {
  Constants,
  participantsColumns,
  solutionHeaders,
  ValidationResult,
  Validators,
} from "./ExcelValidation";

export function excelImport(
  file: any,
  callback: (data: PersistenceData) => void,
  error: (validationResult: ValidationResult) => void
) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const ab = e?.target?.result;
    const workbook = XLSX.read(ab, { type: "binary" });
    const sheetsValidationError = Validators.validateSheetsNames(
      workbook.SheetNames
    );
    if (sheetsValidationError.hasError()) {
      error(sheetsValidationError);
    }
    callback(parseExcelData(workbook));
  };

  reader.readAsBinaryString(file);
}

export function excelExport(
  settings: Settings,
  participants: Array<Person>,
  history: Array<CommitteeSet>,
  committeeSolution: Solution
) {
  // Settings sheet
  const settingsData = [
    [Constants.SETTING_NUMBER_OF_PRO, settings.nbProParticipants],
    [
      Constants.SETTING_NUMBER_OF_ASSIGNMENTS_FOR_A_PRO,
      settings.numberOfAssignmentsForAProfessional?.value?.[0],
      settings.numberOfAssignmentsForAProfessional?.value?.[1],
    ],
    [Constants.SETTING_NUMBER_OF_NON_PRO, settings.nbNonProParticipants],
    [
      Constants.SETTING_NUMBER_OF_ASSIGNMENTS_FOR_A_NON_PRO,
      settings.numberOfAssignmentsForANonProfessional?.value?.[0],
      settings.numberOfAssignmentsForANonProfessional?.value?.[1],
    ],
    [Constants.SETTING_NUMBER_OF_EXTERNAL, settings.nbExternalParticipants],
    [
      Constants.SETTING_NUMBER_OF_ASSIGNMENTS_FOR_AN_EXTERNAL,
      settings.numberOfAssignmentsForAnExternal?.value?.[0],
      settings.numberOfAssignmentsForAnExternal?.value?.[1],
    ],
    [
      Constants.SETTING_NUMBER_OF_ROTATIONS_TO_REINSPECT,
      settings.nbRotationsToReinspect,
    ],
  ];
  const settingsWorksheet = XLSX.utils.aoa_to_sheet(settingsData);

  const sanitizeString = (s?: string) => s ?? "";

  const sanitizeNamedArray = (a?: Array<any>): string =>
    a === undefined ? "" : a.map((i: any) => i.name).join(",");

  // Participants sheet
  const participantsData = [participantsColumns];
  participants.forEach((p: Person) =>
    participantsData.push([
      sanitizeString(p.name),
      sanitizeString(p.personType?.name),
      sanitizeString(p.location?.name),
      sanitizeNamedArray(p.skills),
      sanitizeNamedArray(p.languages),
      sanitizeNamedArray(p.availability),
      sanitizeNamedArray(p.skillsToCertificate),
      p.needsEvaluation ? "true" : "false",
      sanitizeNamedArray(p.vetoes),
    ])
  );
  const participantsWorksheet = XLSX.utils.aoa_to_sheet(participantsData);

  // Solution sheet
  const solutionsData = [[Constants.SOLUTION, new Date()], solutionHeaders];
  exportCommittees(committeeSolution.committees, solutionsData);
  const solutionWorksheet = XLSX.utils.aoa_to_sheet(solutionsData);

  // History sheet
  const historyData = new Array<any>();
  history.forEach((committees) => {
    historyData.push([Constants.SOLUTION, `${committees.date}`]);
    historyData.push(solutionHeaders);
    exportCommittees(committees, historyData);
  });
  const historyWorksheet = XLSX.utils.aoa_to_sheet(historyData);

  // Saving the workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, settingsWorksheet, Constants.SETTINGS);
  XLSX.utils.book_append_sheet(
    workbook,
    participantsWorksheet,
    Constants.PARTICIPANTS
  );
  XLSX.utils.book_append_sheet(workbook, historyWorksheet, Constants.HISTORY);
  XLSX.utils.book_append_sheet(workbook, solutionWorksheet, Constants.SOLUTION);
  XLSX.writeFile(workbook, "pgs-planner-export.xlsx");
}

const exportCommittees = (
  committees: CommitteeSet,
  worksheetData: Array<any>
) => {
  committees.getCommittees().forEach((c: SolvedCommittee) => {
    const rowData = [c.evaluatedPerson?.name];
    if (c.assignments.length) {
      rowData.push(c.findFirstTimeslotInCommon());
      c.assignments.forEach((a: any) => rowData.push(a.assignedPerson.name));
    }
    worksheetData.push(rowData);
  });
};
