package fr.cirad.domain;

public class Skill {

    public String name;

    public Skill() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Skill(String name) {
        this.name = name;
    }

}
