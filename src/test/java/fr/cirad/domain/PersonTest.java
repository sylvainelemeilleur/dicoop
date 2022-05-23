package fr.cirad.domain;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

class PersonTest {

    @Test
    void isEvaluatingAndReciprocityTest() {
            var settings = new Settings();
        var distanceMatrix = new DistanceMatrix();
        var person1 = new Person("person1");
        var person2 = new Person("person2");
        var person3 = new Person("person3");
        var committee1 = new Committee(person1, settings);
        var committee2 = new Committee(person2, settings);
        Long committeeAssignmentId = 0l;
        var assignment1 = new CommitteeAssignment(committeeAssignmentId++, person2, committee1,
                        PersonType.PROFESSIONAL,
                distanceMatrix);
        var assignment2 = new CommitteeAssignment(committeeAssignmentId++, person3, committee1,
                        PersonType.PROFESSIONAL,
                distanceMatrix);
        var assignment3 = new CommitteeAssignment(committeeAssignmentId++, person1, committee2,
                        PersonType.PROFESSIONAL,
                distanceMatrix);
        var assignment4 = new CommitteeAssignment(committeeAssignmentId++, person3, committee2,
                        PersonType.PROFESSIONAL,
                distanceMatrix);
        person1.assignments.add(assignment3);
        person2.assignments.add(assignment1);
        person3.assignments.add(assignment2);
        person3.assignments.add(assignment4);
        assertTrue(person1.isEvaluating(person2));
        assertTrue(person3.isEvaluating(person1));
        assertFalse(person1.isEvaluating(person3));
    }
}
