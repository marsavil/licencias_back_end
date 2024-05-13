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

const sectores = {
  cargar: async function (req: Request, res: Response) {
    // agregar nombre de los sectores que componen la empresa en la constante sectores para la carga inicial
    try {
      const { name } = req.body;
      const sector = await Sector.findOne({
        where: {
          name
        }
      });
      if ( sector ){ // verificar la existencia del sector
        return res.status(400).send(`el sector ${name} ya existe`)
      }
      if ( !name ) {
        return res.status(400).send("Debe asignar un nombre para el nuevo sector")
      }
      if ( name ) {
        // carga de un nuevo sector desde UI
        await Sector.create({
          name,
        });
        return res.status(200).send("sector cargado");
      } else {
        // Se puede utilizar para la carga inicial para desarrollo como tambien para realizar una carga desde el back end adaptando el array sectores
        console.log("se inicia la carga de sectores");
        const sectores = ["Administración", "Taller", "Logistica", "Limpieza"];
        for (let i = 0; i < sectores.length; i++) {
          await Sector.create({
            name: sectores[i],
          });
          console.log(`se cargo el sector ${sectores[i]}`);
        }
      }
    } catch (error) {
      return res.status(400).send(error);
    }
  },
  ver: async function (req: Request, res: Response) {
    // devuelve un array con los sectores cargados
    const sectores = await Sector.findAll();
    return res.status(200).send(sectores);
  },
  eliminar: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
      if ( id ) {
        const sector = await Sector.findOne({
          where: {
            id,
          },
        });
        sector.destroy();
        return res.status(200).send("sector eliminada");
      } else {
        return res.status(400).send("Debe ingresar un id valido para eliminar un sector");
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}
export default sectores;