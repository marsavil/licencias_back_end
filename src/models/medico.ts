import mongoose from "mongoose";
const medicoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    surname: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dni: { type: String, required: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, default: 'Mid', required: true },
    active: { type: Boolean, required: true },
    lastModified: {
      by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
});
const Medico = mongoose.models.Medico || mongoose.model("Medico", medicoSchema);
// const Medico = mongoose.model("Medico", medicoSchema);
export default Medico;