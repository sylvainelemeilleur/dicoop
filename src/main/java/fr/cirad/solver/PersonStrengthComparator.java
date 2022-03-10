package fr.cirad.solver;

import java.util.Comparator;
import fr.cirad.domain.Person;

public class PersonStrengthComparator implements Comparator<Person> {

    @Override
    public int compare(Person p1, Person p2) {
        if (p1 == null || p2 == null) {
            return 0;
        }
        return p1.getNumberOfAssignments() - p2.getNumberOfAssignments();
    }

}
