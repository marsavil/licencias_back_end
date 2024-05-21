import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  surname: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dni: { type: String, required: true },
  telephone: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: String, default: "Low", required: true },
  sector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sector",
  },
  permits: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permit",
    },
  ],
  active: { type: Boolean, required: true },
  lastModified: {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
});
const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
// const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
