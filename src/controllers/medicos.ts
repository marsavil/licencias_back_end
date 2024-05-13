import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import Medico from "../models/medico";
import { v4 } from "uuid"
import Admin from "../models/admin";
const ROUNDS = Number(process.env.ROUNDS);

const medicos = {
  cargar: async function (req: Request, res: Response) {
    try {
      const { name, surname, dni, telephone, admin } = req.body;
      
      const adminDB = await Admin.findById(admin)
      const verify = await Medico.find({ dni })
      // verifica si el médico a ingresar ya estuvo registrado
      if ( verify.length && verify[0].name === name && verify[0].surname === surname && verify[0].active === false ){
        verify[0].active = true
        verify[0].save()
        return res.status(200).send( {message:"Profesional médico re habilitado exitosamente", data: verify});
      }
      if ( verify.length && verify[0].name === name && verify[0].surname === surname && verify[0].active === true ){
        return res.status(200).send({message: "El médico que intenta ingresar ya se encuentra registrado", data: verify});
      }
      // carga manual de un nuevo médico desde UI
      if (name && surname && dni && !verify[0] && admin ) {
        const hashed = await bcrypt.hash(dni, ROUNDS);
        const created = await Medico.create({
          id: v4(),
          name,
          surname,
          dni,
          telephone: telephone,
          password: hashed,
          level: "Mid",
          active: true,
          lastModified: {
            by: adminDB._id,
            date: Date.now(),
          }
        });
        return res.status(200).send({message: "Profesional médico agregado exitosamente", data: created});
      } else {
        return res
          .status(400)
          .send({message:"Debe ingresar un nombre, un apellido y una contraseña", data: {name, surname, dni}});
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  },
  ver: async function (req: Request, res: Response) {
    // devuelve un array con los sectores cargados
    const medicos = await Medico.find();
    return res.status(200).send(medicos);
  },
  eliminar: async function (req: Request, res: Response) {
    // Elimina una médico. Borrado Lógico
    try {
      const { id } = req.body;
      if ( id ) {
        const medico = await Medico.findById( id );
        if ( medico ) {
          console.log("este es el medico", medico);
          medico.active = false
          medico.save()
          return res.status(200).send({message:"médico eliminado", data: medico});
        } else {
          return  res.status(400).send(`No existe un meédico con el id ${id}`)
        }
      } else {
        return res
          .status(400)
          .send({message: "Debe ingresar un id valido para eliminar un médico", data: {id}});
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}
export default medicos; 