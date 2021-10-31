import { Person, Settings } from "src/api";
import { Solution } from "./Solution";

export const DEFAULT_SETTINGS = {
  nbProParticipants: 2,
  nbNonProParticipants: 1,
  maximumNumberOfAssignments: 5,
} as Settings;

export const UNDEFINED_SOLUTION = new Solution(
  "UNDEFINED",
  [],
  {},
  "NOT_STARTED",
  "",
  ""
);

export const NO_PARTICIPANTS = new Array<Person>();
