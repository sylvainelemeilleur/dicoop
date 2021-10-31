import { Settings } from "src/api";

export function copySettings(settings: Settings): Settings {
  return {
    nbProParticipants: settings.nbProParticipants,
    nbNonProParticipants: settings.nbNonProParticipants,
    maximumNumberOfAssignments: settings.maximumNumberOfAssignments,
  } as Settings;
}
