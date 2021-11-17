package fr.cirad.domain;

public class Settings {
    public int nbProParticipants;
    public int nbNonProParticipants;
    public int nbExternalParticipants;
    public Range numberOfAssignments;
    public int nbRotationsToReinspect;

    public Settings() {
        // Empty constructor needed by serialization
    }
}
