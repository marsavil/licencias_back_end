import mongoose from "mongoose";
const sysAdminSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    surname: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    level: { type: String, default: 'High', required: true },
    active: { type: Boolean, required: true }
});
const SysAdmin = mongoose.models.SysAdmin || mongoose.model("SysAdmin", sysAdminSchema);
// const SysAdmin = mongoose.model("SysAdmin", sysAdminSchema);
export default SysAdmin;