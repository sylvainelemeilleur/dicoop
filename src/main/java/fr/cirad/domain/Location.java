package fr.cirad.domain;

public class Location {

    public String name;

    public Location() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Location(String name) {
        this.name = name;
    }

}
