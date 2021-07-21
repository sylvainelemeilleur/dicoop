package fr.cirad.domain;

import java.time.Instant;
import java.util.List;

public class Committee {

    public Person evaluatedPerson;

    public List<Skill> evaluatedSkills;

    public Instant createdDate = Instant.now();

    public List<CommitteeAssignment> assignments;

    public Committee() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Committee(Person evaluatedPerson, List<Skill> evaluatedSkills) {
        this.evaluatedPerson = evaluatedPerson;
        this.evaluatedSkills = evaluatedSkills;
    }

}
