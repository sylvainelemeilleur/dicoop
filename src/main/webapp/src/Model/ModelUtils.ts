import { SolverOptions } from "src/api";

export function copySettings(settings: SolverOptions): SolverOptions {
  return {
    nbProParticipants: settings.nbProParticipants,
    nbNonProParticipants: settings.nbNonProParticipants,
    maximumNumberOfAssignments: settings.maximumNumberOfAssignments,
  };
}
