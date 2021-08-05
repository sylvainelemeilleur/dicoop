package fr.cirad.domain;

import java.util.Comparator;

public class Language implements Comparable<Language> {

    public String name;

    private static final Comparator<Language> COMPARATOR = Comparator.comparing(l -> l.name);

    public Language() {
        // No-arg constructor required for Hibernate and OptaPlanner
    }

    public Language(String name) {
        this.name = name;
    }

    @Override
    public int compareTo(Language o) {
        return COMPARATOR.compare(this, o);
    }

    @Override
    public boolean equals(Object o) {
        return COMPARATOR.equals(o);
    }

    @Override
    public int hashCode() {
        return COMPARATOR.hashCode();
    }

}
