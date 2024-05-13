import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
const {
  Empleado,
  Empresa,
  Licencia,
  Sector,
  Documentacion,
  Medico,
} = require("../db");
const ROUNDS = Number(process.env.ROUNDS);

const medicos = {
  cargar: async function (req: Request, res: Response) {
    try {
      const { name, surname, dni } = req.body;
      const verify = await Medico.findOne({
        where: {
          dni
        }
      })
      // verifica si el médico a ingresar ya estuvo registrado
      if ( verify && verify.name === name && verify.surname === surname && verify.active === false ){
        verify.active = true
        verify.save()
        return res.status(200).send( {message:"Profesional médico re habilitado exitosamente", data: verify});
      }
      if ( verify && verify.name === name && verify.surname === surname && verify.active === true ){
        return res.status(200).send({message: "El médico que intenta ingresar ya se encuentra registrado", data: verify});
      }
      // carga manual de un nuevo médico desde UI
      if (name && surname && dni && !verify ) {
        const hashed = await bcrypt.hash(dni, ROUNDS);
        const created = await Medico.create({
          name,
          surname,
          dni,
          password: hashed,
          level: "Mid"
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
    const medicos = await Medico.findAll();
    return res.status(200).send(medicos);
  },
  eliminar: async function (req: Request, res: Response) {
    // Elimina una empresa. Borrado Lógico
    try {
      const { id } = req.body;
      if ( id ) {
        const medico = await Medico.findOne({
          where: {
            id,
          },
        });
        if ( medico ) {
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