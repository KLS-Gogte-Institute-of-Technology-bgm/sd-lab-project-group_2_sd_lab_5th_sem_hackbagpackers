const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Teachers = new mongoose.Schema({
  name: String,
  Subject: String,
  SubjectCode: String,
  date: Date,
  link: { type: String },
  dept: String,
  sem: String,
  desc: String,
});

module.exports = mongoose.model("Teachers", teachersScheme);
