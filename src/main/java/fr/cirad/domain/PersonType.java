package fr.cirad.domain;

public class PersonType {

    public String name;

    public PersonType() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public PersonType(String name) {
        this.name = name;
    }

}
