import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const token = {
  getToken : (payload: any) => {
    return jwt.sign(
      {
        data: payload,
      },
      process.env.JWT as string,
      { expiresIn: "1h" }
    );
  },

  getTokenData : (token: string) => {
    let data = null;
    jwt.verify(token, process.env.JWT as string, (err, decoded) => {
      if (err) {
        console.log("Error al obtener data del Token");
      } else {
        data = decoded;
      }
    });
    return data;
  },
};

export default token;
