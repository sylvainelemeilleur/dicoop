import { Range, Settings } from "src/api";

export function copySettings(settings: Settings): Settings {
  return {
    nbProParticipants: settings.nbProParticipants,
    nbNonProParticipants: settings.nbNonProParticipants,
    numberOfAssignments: {
      value: [
        settings.numberOfAssignments?.value?.[0],
        settings.numberOfAssignments?.value?.[1],
      ],
    } as Range,
  } as Settings;
}

export function stringNotEmpty(s: string): boolean {
  return /\S/.test(s);
}
