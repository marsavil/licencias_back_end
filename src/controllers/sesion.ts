import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import Employee from "../models/empleado";
import Admin from "../models/admin"; 
import Medico from "../models/medico"; 
const ROUNDS = Number(process.env.ROUNDS);

const sesion = {
  login : async function (req: Request, res: Response) {
    try {
      console.log("entró")
      const { dni, password, surname } = req.body;
      if ( !dni && !surname ) return res.status(400).send("Debe identificarse para poder proseguir")
      if( !password ) return res.status(400).send("Debe ingresar una contraseña")
      if ( dni ) {
        const medico = await Medico.find({ dni });
        const empleado = await Employee.find({ dni });
        if ( medico.length ) {
          const passwordMatch = await bcrypt.compare(password, medico[0].password)
          if( passwordMatch ) {
            return res.status(200).send({message: `Usted se encuentra loggeado como ${medico[0].surname} ${medico[0].surname}`, data: medico[0]})
          }else {
            return res.status(400).send("Contraseña de médico incorrecta")
          }
        } else if ( empleado.length ) {
          const passwordMatch = await bcrypt.compare(password, empleado[0].password)
          if ( passwordMatch ) {
            return res.status(200).send({message: `Usted se encuentra loggeado como ${empleado[0].surname} ${empleado[0].surname}`, data: empleado[0]})
          } else {
            return res.status(400).send("Contraseña de empleado incorrecta")
          }
        } else {
          return res.status(400).send("Verifique los datos ingresados")
        }
      }
      if ( surname ) {
        const admin = await Admin.find({ surname })
        if( admin.length ){
          const passwordMatch = await bcrypt.compare(password, admin[0].password)
          if ( passwordMatch ) {
            return res.status(200).send({message: `Ahora esta loggeado como administrador, bajo el id ${admin[0]._id} `, data: admin[0]})
          } else {
            return res.status(400).send("Contraseña de administrador incorrecta")
          } 
        } else {
          return res.status(400).send("Verifique los datos ingresados")
        }
        
      }
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  },
};
export default sesion;
