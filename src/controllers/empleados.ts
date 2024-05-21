import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { v4 } from "uuid";
import Employee from "../models/empleado";
import Sector from "../models/sector";
import Admin from "../models/admin";
const ROUNDS = Number(process.env.ROUNDS);

const empleados = {
  cargar: async function (req: Request, res: Response) {
    try {
      const { name, surname, dni, telefono, sector, admin } = req.body;
      const hashed = await bcrypt.hash(dni, ROUNDS);
      const worker = await Employee.find({ dni });
      if (worker.length && worker[0].active)  {
        // verifica la existencia del empleado y si está activo
        return res
          .status(400)
          .send("El empleado que intenta ingresar ya se encuentra registrado");
      }
      if (worker.length && !worker[0].active)  {
        // verifica la existencia del empleado y lo activa 
        worker[0].active = true,
        worker[0].lastModified.by = admin,
        worker[0].lastModified.date = Date.now()
        worker[0].save()
        return res.status(200).send( {message:"Empleado re habilitado exitosamente", data: worker});
        return res
          .status(200)
          .send("El empleado que intenta ingresar ya se encuentra registrado");
      }
      if (name && surname && telefono && sector && dni && admin) {
        // para cargar empleados manualmente desde una UI
        const section = await Sector.find({ name: sector });
        const adminDB = await Admin.findById(admin);

        section
          ? Employee.create({
              id: v4(),
              name,
              surname,
              dni,
              telephone: telefono,
              password: hashed,
              level: "Low",
              sectorId: section[0]._id,
              active: true,
              lastModified: {
                by: adminDB._id,
                date: Date.now(),
              },
            })
          : res.status(400).send("No es posible encontrar el sector indicado");
        return res.status(200).send("Empleado cargado correctamente");
      } else {
        return res
          .status(400)
          .send("Debe ingresar todos los datos seleccionados");
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  },
  ver: async function (req: Request, res: Response) {
    // devuelve un array con los empleados cargados
    const { id } = req.body;
    if (id) {
      const empleado = await Employee.findById(id);
      if (empleado) {
        return res.status(200).send(empleado);
      } else {
        return res.status(400).send({
          message: `El id ${id} no corresponde a un empleado registrado`,
        });
      }
    }
    const empleados = await Employee.find();
    const activos = empleados.filter((e) => e.active)
    return res.status(200).send({
      resumen: `Existen ${activos.length} empleado activos sobre ${empleados.length} empleados registrados`,
      empleados: empleados,
    });
  },
  eliminar: async function (req: Request, res: Response) {
    // Elimina un empleado. Borrado Lógico
    try {
      const { id, admin } = req.body;
      if (id) {
        const empleado = await Employee.findById(id);
        if (empleado) {
          empleado.active = false;
          empleado.lastModified.by = admin;
          empleado.lastModified.date = Date.now();
          empleado.save();
          return res.status(200).send("empleado eliminado");
        }
      } else {
        return res.status(400).send(`No existe un empleado con el id ${id}`);
      }
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  },
};
export default empleados;
