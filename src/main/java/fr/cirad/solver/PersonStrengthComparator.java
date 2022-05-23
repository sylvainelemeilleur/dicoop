package fr.cirad.solver;

import java.util.Comparator;
import fr.cirad.domain.Person;

public class PersonStrengthComparator implements Comparator<Person> {

    private static final Comparator<Person> COMPARATOR =
            Comparator.comparing(Person::getNumberOfAssignments);

    @Override
    public int compare(Person a, Person b) {
        if (a == null) {
            if (b == null) {
                return 0;
            }
            return -1;
        } else if (b == null) {
            return 1;
        }
        return COMPARATOR.compare(a, b);
    }

}
