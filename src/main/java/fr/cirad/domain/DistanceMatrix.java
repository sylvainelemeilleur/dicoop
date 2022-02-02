package fr.cirad.domain;

import java.util.List;

public class DistanceMatrix {
    public List<String> locations;
    public Integer[][] distances;

    public DistanceMatrix() {
        // must have a no-args constructor so it can be deserialized by Jackson
    }

    public DistanceMatrix(List<String> locations, Integer[][] distances) {
        this.locations = locations;
        this.distances = distances;
    }

    public Integer getDistance(String location1, String location2) {
        int index1 = locations.indexOf(location1);
        int index2 = locations.indexOf(location2);
        if (index1 > -1 && index2 > -1) {
            return distances[index1][index2];
        } else {
            return 0;
        }
    }
}
