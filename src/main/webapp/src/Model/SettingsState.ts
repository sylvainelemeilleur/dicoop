export interface SettingsState {
  nbProParticipants: [number, number];
  numberOfAssignmentsForAProfessional: [number, number];
  nbNonProParticipants: [number, number];
  numberOfAssignmentsForANonProfessional: [number, number];
  nbExternalParticipants: [number, number];
  numberOfAssignmentsForAnExternal: [number, number];
  nbRotationsToReinspect: number;
  nbInspectorsFollowingUp: number;
  travellingDistanceRange: [number, number];
  committeeMeetingSize: [number, number];
  useAvailability: boolean;
  shuffleParticipants: boolean;
}
