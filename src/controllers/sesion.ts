import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
const { Empleado, Admin, Medico } = require("../db");
const ROUNDS = Number(process.env.ROUNDS);

const sesion = {
  login : async function (req: Request, res: Response) {
    console.log("entró")
    try {
      const { dni, password, name } = req.body;
      if ( !dni && !name ) return res.status(400).send("Debe identificarse para poder proseguir")
      if( !password ) return res.status(400).send("Debe ingresar una contraseña")
      if ( dni ) {
        const medico = await Medico.findOne({
          where: {
            dni,
          },
        });
        const empleado = await Empleado.findOne({
          where: {
            dni,
          },
        });
        if ( medico ) {
          const passwordMatch = await bcrypt.compare(password, medico.password)
          if( passwordMatch ) {
            return res.status(200).send(medico)
          }else {
            return res.status(400).send("Contraseña de médico incorrecta")
          }
        } else if ( empleado) {
          const passwordMatch = await bcrypt.compare(password, empleado.password)
          if ( passwordMatch ) {
            return res.status(200).send(empleado)
          } else {
            return res.status(400).send("Contraseña de empleado incorrecta")
          }
        } else {
          return res.status(400).send("Verifique los datos ingresados")
        }
      }
      if ( name ) {
        const admin = await Admin.findOne({
          where: {
            name
          }
        })
        if( admin ){
          const passwordMatch = await bcrypt.compare(password, admin.password)
          if ( passwordMatch ) {
            return res.status(200).send(admin)
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
