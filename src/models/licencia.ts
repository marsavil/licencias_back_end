import mongoose from "mongoose";
const permitSchema = new mongoose.Schema({
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      allowNull: false,
    },
    sectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sector',
      allowNull: false
    },
    direccion: {
      type: String,
      allowNull: false,
    },
    coordenadas: {
      type: String
    },
    medicoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Permit',
    },
    solicitada: {
      type: Date,
      default: Date.now()
    },
    revisada: {
      type: Date,
    },
    otorgada:{
      type: Boolean,
    },
    validez:{
      type: String,
      enum: ["24", "48", "72"], // según propositos de la empresa,
    },
    derivacion:{
      type: Boolean,
      default: false,
    },
    documentacionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    allowNull: false,
    }
  });
  const Permit = mongoose.models.Permit || mongoose.model("Permit", permitSchema);
  // const Permit = mongoose.model("Permit", permitSchema);
  export default Permit;