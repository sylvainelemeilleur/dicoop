import {
  Committee,
  CommitteeAssignment,
  Location,
  Person,
  PersonType,
  Settings,
  TimeSlot,
} from "src/api";
import { CommitteeSet } from "src/Model/CommitteeSet";
import { DEFAULT_SETTINGS } from "src/Model/Defaults";
import { stringNotEmpty } from "src/Model/ModelUtils";
import { NamedEntity } from "src/Model/NamedEntity";
import { PersistenceData } from "src/Model/PersistenceData";
import { SolvedCommittee } from "src/Model/SolvedCommittee";
import XLSX from "xlsx";
import { Constants } from "./ExcelValidation";
import { v4 as uuid } from "uuid";

export function parseExcelData(workbook: XLSX.WorkBook): PersistenceData {
  const data = new PersistenceData();
  workbook.SheetNames.forEach((name) => {
    const sheet = workbook.Sheets[name];
    const options =
      name === Constants.PARTICIPANTS
        ? {}
        : {
            header: 1,
            raw: false,
          };
    const sheetData = XLSX.utils.sheet_to_json(sheet, options);
    switch (name) {
      case Constants.SETTINGS:
        data.settings = parseSettings(sheetData);
        break;
      case Constants.PARTICIPANTS:
        data.participants = parseParticipants(sheetData);
        break;
      case Constants.HISTORY:
        console.log("HISTORY SHEET PARSING TO DO");
        break;
      case Constants.SOLUTION:
        data.history.push(parseSolution(sheetData));
        console.log(data.history);
        break;
      default:
        console.log(`Unknown sheet name: ${name}`);
        break;
    }
  });
  return data;
}

function parseSolution(sheetData: Array<any>): CommitteeSet {
  const set: CommitteeSet = new CommitteeSet();
  sheetData.forEach((rowData: Array<any>) => {
    const firstCell = rowData[0];
    if (firstCell === Constants.SOLUTION_EVALUATED_PERSON) {
      // ignore headers
    } else if (firstCell === Constants.SOLUTION) {
      set.date = rowData[1];
    } else {
      const evaluatedPerson = {
        name: rowData[0],
      } as Person;
      const solvedCommittee = new SolvedCommittee(uuid(), evaluatedPerson);
      const timeSlot = { name: rowData[1] } as TimeSlot;
      const committee = {
        id: uuid(),
        createdDate: ``,
        evaluatedPerson,
      } as Committee;
      for (let i = 2; i < rowData.length; i++) {
        const assignedPerson = { name: rowData[i] } as Person;
        solvedCommittee.assignments.push({
          assignedPerson,
          timeSlot,
          committee,
        } as CommitteeAssignment);
      }
      set.add(solvedCommittee);
    }
  });
  return set;
}

function parseSettings(sheetData: Array<any>): Settings {
  const settings = DEFAULT_SETTINGS;
  sheetData.forEach((rowData: Array<any>) => {
    const settingName = rowData[0];
    const settingValue = rowData[1];
    switch (settingName) {
      case Constants.SETTING_NUMBER_OF_PRO:
        settings.nbProParticipants = +settingValue;
        break;
      case Constants.SETTING_NUMBER_OF_NON_PRO:
        settings.nbNonProParticipants = +settingValue;
        break;
      case Constants.SETTING_MAX_NUMBER_OF_ASSIGNMENTS:
        settings.maximumNumberOfAssignments = +settingValue;
        break;
      default:
        console.log(`Unknown setting name ${settingName}`);
        break;
    }
  });
  return settings;
}

function parseParticipants(sheetData: Array<any>): Array<Person> {
  const participants = new Array<Person>();
  sheetData.forEach((rowData: any) => {
    const person = {
      name: rowData[Constants.PARTICIPANT_NAME].trim(),
      personType: {
        name: rowData[Constants.PARTICIPANT_TYPE].trim(),
      } as PersonType,
      location: {
        name: rowData[Constants.PARTICIPANT_LOCATION].trim(),
      } as Location,
      skills: parseNamedList(rowData[Constants.PARTICIPANT_SKILLS]),
      languages: parseNamedList(rowData[Constants.PARTICIPANT_LANGUAGES]),
      availability: parseNamedList(rowData[Constants.PARTICIPANT_AVAILABILITY]),
      skillsToCertificate: parseNamedList(
        rowData[Constants.PARTICIPANT_SKILLS_TO_CERTIFICATE]
      ),
    } as Person;
    participants.push(person);
  });
  return participants;
}

function parseNamedList(s: string): Array<NamedEntity> {
  const list = new Array<NamedEntity>();
  s.split(",").forEach((item) => {
    item = item.trim();
    if (stringNotEmpty(item)) {
      list.push({
        name: item,
      } as NamedEntity);
    }
  });
  return list;
}
