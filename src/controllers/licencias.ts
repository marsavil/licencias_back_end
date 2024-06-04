import { Request, Response } from "express";
import Employee from "../models/empleado";
import Document from "../models/documentacion";
import Permit from  "../models/licencia";
import Sector from "../models/sector";
import dotenv from 'dotenv';

dotenv.config();


const { CONSULTA } = process.env;

const licencias = {
  cargar: async function (req: Request, res: Response) {
    const {
      nombre,
      apellido,
      sector,
      telefono,
      direccion,
      coordenadas,
      documentacion,
      id
    } = req.body;
    try {
      // Primera verificación de datos ingresados

      if (!nombre || !apellido) {
        return res.status(400).send("Debe ingresar su nombre y apellido");
      }
      if (!sector) {
        return res
          .status(400)
          .send("Debe indicar el sector donde se desempeña");
      }
      if (!telefono) {
        return res.status(400).send("Debe ingresar su número de teléfono");
      }
      if (!direccion) {
        return res
          .status(400)
          .send("Debe ingresar la dirección donde se encuentra");
      }

      // Consulta de datos

      const solicitante = await Employee.findById(id);
      const sectorDB =  await Sector.findById(solicitante.sector); 
      const seccion = await Sector.find({
          name: sector,
      });
      //Segunda verificación

      if (solicitante.name  !== nombre || solicitante.surname !== apellido )
        return res
          .status(400)
          .send(
            `El nombre ${nombre} ${apellido} no coincide con el nombre del usuario actual . Verifique los datos ingresados y vuelva a intentarlo. Si el problema persiste comuniquese telefóicamente a ${CONSULTA}`
          );
      if (!seccion.length)
        return res
          .status(400)
          .send(
            `El sector ${sector} no existe en nuestra base de datos. ¿Quiso ingresar ${sectorDB.name}?` 
          );
      if (sectorDB.name !== sector )
        return res
          .status(400)
          .send(
            `El sector ${sector} no coincide con el sector del usuario actual. Verifique los datos ingresados y vuelva a intentarlo. Si el problema persiste comuniquese telefóicamente a ${CONSULTA}`
          );
      if (solicitante.telephone!== telefono)
      

      // Registro en base de datos de la nueva licencia
      console.log("se va a crear la documentacion");
      const nuevaDocumentacion = await Document.create({
        path: documentacion,
      });
      //const documentDB = await Document.find({ path:  documentacion})
      console.log("guardo la documentacion", nuevaDocumentacion);
      const nuevaLicencia = await Permit.create({
        empleadoId: solicitante._id,
        sectorId: sectorDB._id,
        solicitada: new Date(),
        direccion,
        coordenadas,
        documentacionId: nuevaDocumentacion._id,
      });
      // const licenciaDB = await Permit.find({documentacionId: documentDB[0]._id})
      const licenciaDB = await Permit.find({documentacionId:nuevaDocumentacion._id})
      // documentDB[0].licenciaID = licenciaDB[0]._id;
      nuevaDocumentacion.licenciaID = licenciaDB[0]._id;
      // documentDB[0].save();
      nuevaDocumentacion.save()
      solicitante.telephone = telefono;
      solicitante.permits.push(licenciaDB[0]._id)
      solicitante.save();
      res
        .status(200)
        .send({
          message:
            "Hemos recibido su solicitud. Será contactado por un profesional a la brevedad",
        });
    } catch (error: any) {
      return res.send(error.message);
    }
  },
  ver: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
    if (id) {
      const licencia = await Permit.findById( id );
      if (!licencia) {
        return res
          .status(400)
          .send(`La solicitud de licencia con id ${id} no existe`);
      } else {
        return res.status(200).send(licencia);
      }
    } else {
      const licencias = await Permit.find();
      const resueltas = await Permit.find({otorgada: true || false})
      return res.status(200).send({resumen: `Existen ${licencias.length} solicitudes de licencia registradas, de las cuales ${resueltas.length} fueron resuletas`,data:licencias})
    }
    } catch (error: any) {
      return res.status(500).send(error.message)
    }
  },
  evaluar: async function (req: Request, res: Response) {
    try {
        const { licencia, medico, cobertura, resolucion } = req.body;
        const hours = Number(cobertura);

        if (!licencia) {
            return res.status(400).send("Se requiere el ID de la licencia");
        }

        const licenciaDB = await Permit.findById(licencia);
        if (!licenciaDB) {
            return res.status(404).send("Licencia no encontrada");
        }

        const empleado = await Employee.findById(licenciaDB.empleadoId);
        if (!empleado) {
            return res.status(404).send("Empleado no encontrado");
        }

        // Verificar que `licenciaDB.solicitada` sea una fecha válida
        const fechaSolicitud = new Date(licenciaDB.solicitada);
        if (isNaN(fechaSolicitud.getTime())) {
            return res.status(500).send("Error: Fecha de solicitud no válida");
        }

        // Calcular la fecha de alta médica
        const alta = new Date(fechaSolicitud);
        alta.setHours(alta.getHours() + hours);

        // Verificar si `alta` es una fecha válida antes de asignarla
        if (isNaN(alta.getTime())) {
            console.log("Error: Fecha de alta médica no válida", alta);
            return res.status(500).send("Error: Fecha de alta médica no válida");
        }

        licenciaDB.medicoId = medico;
        licenciaDB.revisada = Date.now();
        licenciaDB.otorgada = resolucion;
        licenciaDB.validez = cobertura;

        // Asignar `alta` a `medicalReleaseDate` solo si `alta` es una fecha válida
        console.log("Fecha de alta a asignar:", alta);
        empleado.medicalReleaseDate = isNaN(alta.getTime()) ? null : alta;

        await licenciaDB.save();
        await empleado.save();

        return res.status(200).send({ acción: `Licencia ${licenciaDB._id} evaluada`, data: licenciaDB });
    } catch (error: any) {
        console.log("Error al evaluar la licencia:", error);
        return res.status(500).send({ message: error.message });
    }
}



};
export default licencias;
