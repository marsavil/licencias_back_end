import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    surname: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    dni: { type: String, required: true },
    telephone: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, default: 'High', required: true },
    active: { type: Boolean, required: true },
    lastModified: {
        by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SysAdmin' || 'Admin',
            required: true,
        },
        date: {
            type: Date,
        },
    },
});
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
// const Admin = mongoose.model("Admin", adminSchema);
export default Admin;