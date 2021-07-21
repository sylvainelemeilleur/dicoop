package fr.cirad.domain;

public class Language {

    public String name;

    public Language() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Language(String name) {
        this.name = name;
    }

}
