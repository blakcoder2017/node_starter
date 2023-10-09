const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

//Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Delete data on from collection on the server
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Success');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

//import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Success');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

deleteData();
importData();
