export interface SettingsState {
  nbProParticipants: number;
  numberOfAssignmentsForAProfessional: [number, number];
  nbNonProParticipants: number;
  numberOfAssignmentsForANonProfessional: [number, number];
  nbExternalParticipants: number;
  numberOfAssignmentsForAnExternal: [number, number];
  nbRotationsToReinspect: number;
  travellingDistanceRange: [number, number];
}
