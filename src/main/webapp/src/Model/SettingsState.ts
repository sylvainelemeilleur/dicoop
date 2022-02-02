export interface SettingsState {
  nbProParticipants: [number, number];
  numberOfAssignmentsForAProfessional: [number, number];
  nbNonProParticipants: [number, number];
  numberOfAssignmentsForANonProfessional: [number, number];
  nbExternalParticipants: [number, number];
  numberOfAssignmentsForAnExternal: [number, number];
  nbRotationsToReinspect: number;
  travellingDistanceRange: [number, number];
  useAvailability: boolean;
}
