package fr.cirad.domain;

public class Settings {
    public Range nbProParticipants;
    public Range numberOfAssignmentsForAProfessional;

    public Range nbNonProParticipants;
    public Range numberOfAssignmentsForANonProfessional;

    public Range nbExternalParticipants;
    public Range numberOfAssignmentsForAnExternal;

    public int nbRotationsToReinspect;
    public int nbInspectorsFollowingUp;

    public DistanceMatrix distanceMatrix;
    public Range travellingDistanceRange;

    public Boolean useAvailability;
    public Boolean shuffleParticipants;

    public Settings() {
        // Empty constructor needed by serialization
    }
}
