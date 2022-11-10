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

    public Range committeeMeetingSize;

    public Settings() {
        // Empty constructor needed by serialization
    }

    public Range getNumberOfAssignmentsRange(PersonType personType) {
        if (personType.equals(PersonType.PROFESSIONAL))
            return numberOfAssignmentsForAProfessional;
        else if (personType.equals(PersonType.NON_PROFESSIONAL))
            return numberOfAssignmentsForANonProfessional;
        else if (personType.equals(PersonType.EXTERNAL))
            return numberOfAssignmentsForAnExternal;
        else
            return new Range(0, 5);
    }
}
