import { Request, Response } from "express";
import Employee from "../models/empleado";
import Document from "../models/documentacion";
import Permit from  "../models/licencia";

const documents = {
  ver: async function (req: Request, res: Response){
    try {
      const { licencia } = req.body;
      if ( licencia ){
        const documentacion = await Document.find({licenciaId: licencia});
        const licenciaDB = await Permit.findById(licencia);
        const employee = await Employee.findById(licenciaDB.empleadoId)
        if (!documentacion) {
          return res.status(404).send({message: `No existe ninguna documentación asociada a la licencia ${licencia}`})
        }
        res.status(200).send({licencia: licenciaDB, empleado: employee, documento: documentacion[0]})
      }
      if ( !licencia )
        return res
        .status(400)
        .send('Debe ingresar un id de una licencia para poder un documento')
    } catch (error:any) {
      res.status(500).send(error.message)
    }
  }
}
export default documents;