import Cafe from "#src/models/cafe";



export abstract class DatabasePopulate {

    /**
     * Populate cafes only
     */
    public static async cafes(){
        await Cafe.insertMany([
            {name: "Cafe 1", description: "Lorem Ipsum", location: "West", employee_count: 0},
            {name: "Cafe 2", description: "Lorem Ipsum", location: "West", employee_count: 0},
            {name: "Cafe 3", description: "Lorem Ipsum", location: "West", employee_count: 0},
            {name: "Cafe 4", description: "Lorem Ipsum", location: "East", employee_count: 0},
            {name: "Cafe 5", description: "Lorem Ipsum", location: "East", employee_count: 0},
        ]);
    }

}