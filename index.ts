import server from "./src/app";
import charge from "./src/controllers/chargeDB";
import { connectToDB } from "./src/db";

const { PORT } = process.env;
const port = Number(PORT);


connectToDB().then(() => {
  server.listen(port, () => {
    console.log(`listening to ${PORT}`); // eslint-disable-line no-console
    // charge.chargeDB();
    //charge.updateSectorsEmployees();
  });
});
