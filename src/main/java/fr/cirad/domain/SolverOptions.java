package fr.cirad.domain;

import java.util.List;

public class SolverOptions {
    public Settings settings;
    public List<Person> participants;

    public SolverOptions() {
        // Empty constructor needed by serialization
    }
}
