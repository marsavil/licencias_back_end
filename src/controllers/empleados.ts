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

const empleados = {
  cargar: async function (req: Request, res: Response) {
    try {
      const { name, surname, dni, telefono, sector, empresa} = req.body;
      const hashed = await bcrypt.hash(dni, ROUNDS);
      const worker = await Empleado.findOne({
        where: {
          dni
        }
      })
      if ( worker ) { // verifica la existencia del empleado
        return res.status(400).send("El empleado que intenta ingresar ya se encuentra registrado")
      }
      if ( name && surname && telefono && sector && empresa && dni ) {
        // para cargar empleados manualmente desde una UI
        const section = await Sector.findOne({
          where: {
            name: sector,
          },
        });
        const firm = await Empresa.findOne({
          where: {
            name: empresa,
          },
        });
        section && firm
          ? Empleado.create({
              name,
              surname,
              dni,
              telefono,
              sectorId: section.id,
              empresaId: firm.id,
              password: hashed,
              level: "Low"
            })
          : res
              .status(400)
              .send("No es posible encontra la empresa o el sector indicado");
        return res.status(200).send("Empleado cargado correctamente");
      } else {
        return res.status(400).send("Debe ingresar todos los datos seleccionados")
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  },
  ver: async function (req: Request, res: Response) {
    // devuelve un array con los empleados cargados
    const empleados = await Empleado.findAll();
    return res.status(200).send(empleados);
  },
  eliminar: async function (req: Request, res: Response) {
    // Elimina un empleado. Borrado Lógico
    try {
      const { id } = req.body;
      if (id) {
        const empleado = await Empleado.findOne({
          where: {
            id,
          },
        });
        empleado
          ? (empleado.active = false)
          : res.status(400).send(`No existe un empleado con el id ${id}`);
        empleado.save();
        return res.status(200).send("empleado eliminado");
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  }
}
export default empleados;