import XLSX from "xlsx";

export function excelExport(
  settings: any,
  persons: any,
  committeeSolution: any
) {
  // Settings sheet
  const settingsData = [
    ["Number of pro participants", settings.nbProParticipants],
    ["Number of non pro participants", settings.nbNonProParticipants],
  ];
  const settingsWorksheet = XLSX.utils.aoa_to_sheet(settingsData);

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
  persons.forEach((p: any) =>
    participantsData.push([
      p.name,
      p.personType.name,
      p.location.name,
      p.skills.map((s: any) => s.name).join(","),
      p.languages.map((l: any) => l.name).join(","),
      p.availability.map((a: any) => a.name).join(","),
      p.skillsToCertificate.map((s: any) => s.name).join(","),
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
