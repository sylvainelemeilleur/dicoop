import { Person, SolverOptions } from "src/api";
import { Solution } from "src/Model/Solution";
import XLSX from "xlsx";

export function excelImport(file: any, callback) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const ab = e?.target?.result;
    const workbook = XLSX.read(ab, { type: "binary" });
    callback(workbook.SheetNames);
  };

  reader.readAsBinaryString(file);
}

export function excelExport(
  settings: SolverOptions,
  persons: Array<Person>,
  committeeSolution: Solution
) {
  // Settings sheet
  const settingsData = [
    ["Number of pro participants", settings.nbProParticipants],
    ["Number of non pro participants", settings.nbNonProParticipants],
    [
      "Maximum number of assignments per participant",
      settings.maximumNumberOfAssignments,
    ],
  ];
  const settingsWorksheet = XLSX.utils.aoa_to_sheet(settingsData);

  const sanitizeString = (s?: string) => {
    return s ?? "";
  };

  const sanitizeNamedArray = (a?: Array<any>): string => {
    if (a === undefined) {
      return "";
    } else {
      return a.map((i: any) => i.name).join(",");
    }
  };

  // Participants sheet
  const participantsData = [
    [
      "Name",
      "Type",
      "Location",
      "Skills",
      "Languages",
      "Availability",
      "Skills to Certificate",
    ],
  ];
  persons.forEach((p: Person) =>
    participantsData.push([
      sanitizeString(p.name),
      sanitizeString(p.personType?.name),
      sanitizeString(p.location?.name),
      sanitizeNamedArray(p.skills),
      sanitizeNamedArray(p.languages),
      sanitizeNamedArray(p.availability),
      sanitizeNamedArray(p.skillsToCertificate),
    ])
  );
  const participantsWorksheet = XLSX.utils.aoa_to_sheet(participantsData);

  // Solutions sheet
  const solutionsData = [
    ["Solution of " + new Date()],
    ["Evaluated Person", "Timeslot", "Assignments"],
  ];
  Object.values(committeeSolution.committees).forEach((c: any) => {
    const rowData = [c.evaluatedPerson.name];
    if (c.assignments.length) {
      rowData.push(c.assignments[0]?.timeSlot?.name);
      c.assignments.forEach((a: any) => rowData.push(a.assignedPerson.name));
    }
    solutionsData.push(rowData);
  });
  const solutionsWorksheet = XLSX.utils.aoa_to_sheet(solutionsData);

  // Saving the workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, settingsWorksheet, "Settings");
  XLSX.utils.book_append_sheet(workbook, participantsWorksheet, "Participants");
  XLSX.utils.book_append_sheet(workbook, solutionsWorksheet, "Solutions");
  XLSX.writeFile(workbook, "pgs-planner-export.xlsx");
}
