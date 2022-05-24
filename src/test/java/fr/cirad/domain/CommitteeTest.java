package fr.cirad.domain;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import java.util.List;
import org.junit.jupiter.api.Test;

class CommitteeTest {

    @Test
    void metMinimumAssignmentsByPersonTypeTest() {
        var settings = new Settings();
        settings.nbProParticipants = new Range(2, 2);
        settings.nbNonProParticipants = new Range(0, 0);
        settings.nbExternalParticipants = new Range(0, 0);
        var distanceMatrix = new DistanceMatrix();
        var person1 = new Person("person1", settings);
        person1.personType = PersonType.PROFESSIONAL;
        var person2 = new Person("person2", settings);
        person2.personType = PersonType.PROFESSIONAL;
        var person3 = new Person("person3", settings);
        person3.personType = PersonType.PROFESSIONAL;
        var committee1 = new Committee(person1, settings);
        var assignment1 = new CommitteeAssignment(1l, person2, committee1,
                PersonType.PROFESSIONAL,
                distanceMatrix);
        var assignment2 = new CommitteeAssignment(2l, person3, committee1,
                PersonType.PROFESSIONAL,
                distanceMatrix);
        var assignments = List.of(assignment1, assignment2);
        // Test with min 2 Pros
        assertTrue(committee1.metMinimumAssignments(assignments));
        // Test with min 1 NonPro
        settings.nbNonProParticipants = new Range(1, 1);
        assertFalse(committee1.metMinimumAssignments(assignments));
    }

}
