import Employee, {EGender} from './models/employee';
import Cafe from './models/cafe';
import mongoose from 'mongoose';
import utils from "./utils/utils";

require('dotenv').config();

const connect = require('./middlewares/database');

const port = process.env.NODE_PORT || 8079;

// Connect DB and then populate
console.log("connecting...");
connect().then(async () => {

  console.log("Connected!");
  console.log("Seeding database...");
  // seed DB
  const location = ["West", "East", "North", "South"];
  for (let i1 = 0; i1 < 10;i1++){
    let cafe = await Cafe.create({name: "CafeCafe" + i1,
                                  description: "Lorem Ipsum",
                                  location: location[ i1 % location.length],
                                  employee_count: 5});
    let cafe_id = cafe._id;
    for (let i2 = 0; i2 < 5; i2++ ){
      let qid = "UI" + utils.generateRandomId(7);
      let today = new Date();
      let timeskip = new Date(today.getTime() - 1000*24*60*60*i2);
      let employee = await Employee.create({ _id:qid,
                                            name: `Emplo${i1}-${i2}`,
                                            email_address: `a${i1}_${i2}@dot.com`,
                                            phone_number: `876543${i1}${i2}`,
                                            gender: ((i2 % 2) == 1)?EGender.Male:EGender.Female,
                                            date_start: timeskip,
                                            cafe_id: cafe_id});
    }
  }
  console.log("Done!")
  process.exit()
}, 
  () => { console.log("Failed to connect Database")}
);


