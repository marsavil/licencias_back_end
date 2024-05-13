import mongoose from "mongoose";
const sectorSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee'
        }
    ],
    active: { type: Boolean, required: true }
});
const Sector = mongoose.models.Sector || mongoose.model("Sector", sectorSchema);
export default Sector;