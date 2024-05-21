import mongoose from "mongoose";
const documentSchema = new mongoose.Schema({
    path: {
      type: String,
      allowNull: false,
    },
    licenciaID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document'
    },
  });
  const Document = mongoose.models.Document || mongoose.model("Document", documentSchema);
  // const Document = mongoose.model("Document", documentSchema);
  export default Document;