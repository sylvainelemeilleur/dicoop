package fr.cirad.domain;

public class TimeSlot {

    public String name;

    public TimeSlot() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public TimeSlot(String name) {
        this.name = name;
    }

}
