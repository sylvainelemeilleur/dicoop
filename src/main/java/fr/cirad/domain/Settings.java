package fr.cirad.domain;

public class Settings {
    public int nbProParticipants;
    public Range numberOfAssignmentsForAProfessional;

    public int nbNonProParticipants;
    public Range numberOfAssignmentsForANonProfessional;

    public int nbExternalParticipants;
    public Range numberOfAssignmentsForAnExternal;

    public int nbRotationsToReinspect;

    public DistanceMatrix distanceMatrix;
    public Range travellingDistanceRange;

    public Settings() {
        // Empty constructor needed by serialization
    }
}
