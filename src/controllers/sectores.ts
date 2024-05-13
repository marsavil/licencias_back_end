import { Request, Response } from "express";
import { v4 } from 'uuid';
import * as bcrypt from "bcrypt";
import Sector from "../models/sector"
const ROUNDS = Number(process.env.ROUNDS);

const sectores = {
  cargar: async function (req: Request, res: Response) {
    // agregar nombre de los sectores que componen la empresa en la constante sectores para la carga inicial
    try {
      const { name } = req.body;
      const sector = await Sector.find({name});
      console.log("este es el sector",sector)
      if ( sector.length ){ // verificar la existencia del sector
        return res.status(400).send(`el sector ${name} ya existe`)
      }
      if ( !name ) {
        return res.status(400).send("Debe asignar un nombre para el nuevo sector")
      }
      if ( name ) {
        // carga de un nuevo sector desde UI
        await Sector.create({
          id: v4(),
          name,
          active: false
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
      console.log(error)
      return res.status(400).send(error);
    }
  },
  ver: async function (req: Request, res: Response) {
    // devuelve un array con los sectores cargados
    const sectores = await Sector.find();
    return res.status(200).send(sectores);
  },
  eliminar: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
      if ( id ) {
        const sector = await Sector.deleteOne({_id: id});
        return res.status(200).send("sector eliminado");
      } else {
        return res.status(400).send("Debe ingresar un id valido para eliminar un sector");
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  },
  activar: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
      if ( id ) {
        const sector = await Sector.updateOne({_id: id}, {active: true});
        return res.status(200).send("sector activado");
      } else {
        return res.status(400).send("Debe ingresar un id valido para activar un sector");
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}
export default sectores;