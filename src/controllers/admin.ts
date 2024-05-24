import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import Employee from "../models/empleado";
import Sector from "../models/sector";
import Admin from "../models/admin";
import SysAdmin from "../models/systemAdmin";
const ROUNDS = Number(process.env.ROUNDS);

const admin = {
  ver: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
      if ( id ) {
        const admin = await Admin.findById(id);
        if (!admin) {
          return res.status(404).send({message: `No existe un administrador identificado con el id ${id}`})
        }
        res.status(200).send(admin)
      } else {
        const admins = await Admin.find();
        const sysAdmins = await SysAdmin.find();
        admins.length > 1 ? 
        res.status(200).send({resumen:`El sistema cuenta con ${admins.length} administaradores y un administrador local`, administradores: admins, administrador_local: sysAdmins})
        :
        res.status(200).send({resumen:`El sistema cuenta con ${admins.length} administarador y un administrador local`, administradores: admins, administrador_local: sysAdmins})
      }
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  },
  cargar: async function (req: Request, res: Response) {
    try {
      const { name, surname, dni, telephone, password, admin } = req.body
      let hashed = await bcrypt.hash(password, ROUNDS)
      const newAdmin = await Admin.create({
        id: v4(),
        name: name,
        surname: surname,
        dni: dni,
        telephone: telephone,
        password: hashed,
        level: "High",
        active: false,
        lastModified: {
          by: admin,
          date: Date.now(),
        },
      });
      res.status(200).send({message: "Administrador agregado exitosamente", data: newAdmin});
    } catch (error: any) {
      res.status(500).send(error.message)
    }
  },
  activar: async function (req: Request, res: Response) {
    try {
      const { id } = req.body
      Admin.updateOne({_id: id}, {active: false})
      res.status(200).send({message: "Administrador activado exitosamente"})
    } catch (error:any) {
      res.status(500).send(error.message)
    }
  }
}
export default admin;