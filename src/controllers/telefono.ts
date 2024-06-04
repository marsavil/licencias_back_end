import { Request, Response } from "express";

const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_TOKEN = process.env.TWILIO_TOKEN;
const SERVICE_SID = process.env.SERVICE_SID;
const client = require("twilio")(TWILIO_SID, TWILIO_TOKEN);

const telefono = {
  validacion: async function (req: Request, res: Response) {
    // valida el número ingresado por el usuario y envia sms de verificación
    const { phone } = req.body;

    if (phone) {
      try {
        client.verify.v2
          .services(SERVICE_SID)
          .verifications.create({ to: phone, channel: "sms" })
          .then((verification: { sid: any }) => {
            return res.status(200).send(verification);
          });
      } catch (error) {
        return res.send(error);
      }
    } else {
      return res.status(400).send("Ingrese un número de teléfono válido");
    }
  },
  verificacion: async function (req: Request, res: Response) {
    // verifica el código ingresado por el usuario y lo coteja con en previamente enviado
    console.log("entro")
    const { code, phone } = req.body;
    try {
      if (code) {
        client.verify.v2
          .services(SERVICE_SID)
          .verificationChecks.create({ to: phone, code })
          .then((verification_check: any) => {
            return res.status(200).send(verification_check);
          });
      } else {
        res.status(400).send("Debe ingresar el código que recibio por SMS");
      }
    } catch (error: any) {
      return res.status(500).send({message:"Este es el error que se esta mostrando",error:error.message});
    }
  },
};
export default telefono;
