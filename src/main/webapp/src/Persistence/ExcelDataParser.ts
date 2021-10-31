import { Location, Person, PersonType, SolverOptions } from "src/api";
import { DEFAULT_SETTINGS } from "src/Model/Defaults";
import { NamedEntity } from "src/Model/NamedEntity";
import { PersistenceData } from "src/Model/PersistenceData";
import XLSX from "xlsx";
import { Constants } from "./ExcelValidation";

export function parseExcelData(workbook: XLSX.WorkBook): PersistenceData {
  const data = new PersistenceData();
  workbook.SheetNames.forEach((name) => {
    const sheet = workbook.Sheets[name];
    const options =
      name === Constants.PARTICIPANTS
        ? {}
        : {
            header: 1,
          };
    const sheetData = XLSX.utils.sheet_to_json(sheet, options);
    switch (name) {
      case Constants.SETTINGS:
        data.settings = parseSettings(sheetData);
        break;
      case Constants.PARTICIPANTS:
        data.participants = parseParticipants(sheetData);
        break;
      case Constants.SOLUTIONS:
        break;
      default:
        console.log(`Unknown sheet name: ${name}`);
        break;
    }
  });
  return data;
}

function parseSettings(sheetData: Array<any>): SolverOptions {
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
    list.push({
      name: item,
    } as NamedEntity);
  });
  return list;
}
