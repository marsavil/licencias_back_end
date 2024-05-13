import { Request, Response } from "express";
const {
  Empleado,
  Empresa,
  Licencia,
  Sector,
  Documentacion,
  Medico,
} = require("../db");
const { CONSULTA } = process.env;

const licencias = {
  cargar: async function (req: Request, res: Response) {
    const {
      nombre,
      apellido,
      sector,
      empresa,
      telefono,
      direccion,
      coordenadas,
      documentacion,
    } = req.body;
    try {
      // Primera verificación de datos ingresados

      if (!nombre || !apellido) {
        return res.status(400).send("Debe ingresar su nombre");
      }
      if (!sector) {
        return res
          .status(400)
          .send("Debe indicar el sector donde se desempeña");
      }
      if (!empresa) {
        return res
          .status(400)
          .send(
            "Debe ingresar el nombre de la empresa ante la cual solicita su licencia"
          );
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

      const solicitante = await Empleado.findOne({
        where: {
          name: nombre,
          surname: apellido,
        },
      });
      const cliente = await Empresa.findOne({
        where: {
          name: empresa,
        },
      });
      console.log("este es id que hay que adjuntara a la licencia",cliente.id)
      const seccion = await Sector.findOne({
        where: {
          name: sector,
        },
      });
      //Segunda verificación

      if (!solicitante)
        return res
          .status(400)
          .send(
            `${nombre} ${apellido} no se encuentra en nuestra base de datos. Verifique los datos ingresados y vuelva a intentarlo. Si el problema persiste comuniquese telefóicamente a ${CONSULTA}`
          );

      if (!cliente)
        return res
          .status(400)
          .send(
            "La empresa ingresada no existe en nuestra base de datos. Verifique los datos ingresado y vuelva a intentarlo"
          );

      if (!seccion)
        return res
          .status(400)
          .send(
            "El sector ingresado no existe en nuestra base de datos. Verifique los datos ingresados y vuelva a intentarlo"
          );

      // Registro en base de datos de la nueva licencia
      console.log("se va a crear la documentacion");
      const nuevaDocumentacion = await Documentacion.create({
        path: documentacion,
      });
      console.log("guardo la documentacion", nuevaDocumentacion);
      const nuevaLicencia = await Licencia.create({
        empleadoId: solicitante.id,
        empresaId: cliente.id,
        sectorId: seccion.id,
        solicitada: new Date(),
        direccion,
        coordenadas,
        documentacionId: nuevaDocumentacion.id,
      });
      nuevaDocumentacion.licenciaID = nuevaLicencia.id;
      nuevaDocumentacion.save();
      solicitante.telefono = telefono;
      solicitante.save();
      res
        .status(200)
        .send({
          message:
            "Hemos recibido su solicitud. Será contactado por un profesional en las próximas horas",
        });
    } catch (error: any) {
      return res.send(error.message);
    }
  },
  ver: async function (req: Request, res: Response) {
    try {
      const { id } = req.body;
    if (id) {
      const licencia = await Licencia.findOne({
        where: {
          id,
        },
      });
      if (!licencia) {
        return res
          .status(400)
          .send(`La solicitud de licencia con id ${id} no existe`);
      } else {
        return res.status(200).send(licencia);
      }
    } else {
      const licencias = await Licencia.findAll();
      return res.status(200).send(licencias)
    }
    } catch (error: any) {
      return res.status(500).send(error.message)
    }
  },
};
export default licencias;
