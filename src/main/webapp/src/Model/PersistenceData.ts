import { Person, Settings } from "src/api";
import { CommitteeSet } from "./CommitteeSet";
import { DEFAULT_SETTINGS, NO_HISTORY, NO_PARTICIPANTS } from "./Defaults";

export class PersistenceData {
  // Defaults values
  public settings: Settings = DEFAULT_SETTINGS;
  public participants: Array<Person> = NO_PARTICIPANTS;
  public history: Array<CommitteeSet> = NO_HISTORY;
}
