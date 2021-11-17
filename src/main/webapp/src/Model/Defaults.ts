import { Person, Range, Settings } from "src/api";
import { CommitteeSet } from "./CommitteeSet";
import { Solution } from "./Solution";

export const DEFAULT_SETTINGS = {
  nbProParticipants: 2,
  nbNonProParticipants: 1,
  nbExternalParticipants: 0,
  numberOfAssignments: { value: [1, 5] } as Range,
} as Settings;

export const UNDEFINED_SOLUTION = new Solution(
  [],
  new CommitteeSet(),
  "NOT_STARTED",
  "",
  ""
);

export const NO_PARTICIPANTS = new Array<Person>();

export const NO_HISTORY = new Array<CommitteeSet>();
