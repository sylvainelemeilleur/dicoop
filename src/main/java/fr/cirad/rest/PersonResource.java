package fr.cirad.rest;

import java.util.List;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import fr.cirad.bootstrap.DemoDataService;
import fr.cirad.domain.Person;

@Path("api/persons")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonResource {

    @Inject
    DemoDataService service;

    @GET
    public List<Person> list() {
        return service.persons;
    }

}
