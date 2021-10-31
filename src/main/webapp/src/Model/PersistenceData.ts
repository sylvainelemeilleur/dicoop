import { Person, Settings } from "src/api";
import {
  DEFAULT_SETTINGS,
  NO_PARTICIPANTS,
  UNDEFINED_SOLUTION,
} from "./Defaults";
import { Solution } from "./Solution";

export class PersistenceData {
  // Defaults values
  public settings: Settings = DEFAULT_SETTINGS;
  public participants: Array<Person> = NO_PARTICIPANTS;
  public committeeSolution: Solution = UNDEFINED_SOLUTION;
}
