package fr.cirad.domain;

import java.util.List;

public class DistanceMatrix {
    public List<String> locations;
    public Double[][] distances;

    public DistanceMatrix() {
        // must have a no-args constructor so it can be deserialized by Jackson
    }

    public DistanceMatrix(List<String> locations, Double[][] distances) {
        this.locations = locations;
        this.distances = distances;
    }

    public Double getDistance(String location1, String location2) {
        int index1 = locations.indexOf(location1);
        int index2 = locations.indexOf(location2);
        return distances[index1][index2];
    }
}
