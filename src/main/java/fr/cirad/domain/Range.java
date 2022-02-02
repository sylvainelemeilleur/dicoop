package fr.cirad.domain;

public class Range {
    public int[] value = new int[2];

    public Range() {
        // Empty constructor needed by serialization
    }

    public Range(int min, int max) {
        this.value[0] = min;
        this.value[1] = max;
    }

    public int getMin() {
        return value[0];
    }

    public int getMax() {
        return value[1];
    }

    public boolean contains(int value) {
        return value >= this.value[0] && value <= this.value[1];
    }
}
