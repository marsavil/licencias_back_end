import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import Admin from "../models/admin";
import SysAdmin from "../models/systemAdmin";
import Medico from "../models/medico";
import Sector from "../models/sector";
import Employee from "../models/empleado";
const {
  sysAdmin,
  admins,
  employees,
  sectors,
  medicos,
} = require("../data/placeholder-data");
const ROUNDS = Number(process.env.ROUNDS);

const charge = {
  chargeDB: async function () {
    // carga inicial de sectores

    for (let i = 0; i < sectors.length; i++) {
      const sectorDb = await Sector.find({ id: sectors[i].id });
      if (!sectorDb.length) {
        await Sector.create({
          id: sectors[i].id,
          name: sectors[i].name,
          active: sectors[i].active,
          employees: sectors[i].employees,
        });
        console.log(`se cargo el sector ${sectors[i].name}`);
      } else {
        console.log("este es el sector", sectorDb);
        console.log(`Ya existe el sector con el id ${sectors[i].id}`);
      }
    }
    // cargar el administrador de sistema
    for (let i = 0; i < sysAdmin.length; i++) {
      let sysAdminDB = await SysAdmin.find({ id: sysAdmin[i].id });
      if (!sysAdminDB.length) {
        let hashed = await bcrypt.hash(sysAdmin[i].password, ROUNDS);
        await SysAdmin.create({
          id: sysAdmin[i].id,
          name: sysAdmin[i].name,
          surname: sysAdmin[i].surname,
          password: hashed,
          level: sysAdmin[i].level,
          active: sysAdmin[i].active,
        });
        console.log("Administrador de sistem agregado exitosamente");
      }
    }

    // carga inicial Administrador
    const systemAdmin = await SysAdmin.find();
    if (!systemAdmin.length)
      return "Es necesario el administrador de sistema para agregar un adiministrador";
    for (let i = 0; i < admins.length; i++) {
      let adminDB = await Admin.find({ id: admins[i].id });
      if (!adminDB.length) {
        let hashed = await bcrypt.hash(admins[i].password, ROUNDS);
        await Admin.create({
          id: admins[i].id,
          name: admins[i].name,
          surname: admins[i].surname,
          dni: admins[i].dni,
          telephone: admins[i].telephone,
          password: hashed,
          level: admins[i].level,
          active: admins[i].active,
          lastModified: {
            by: systemAdmin[0]._id,
            date: Date.now(),
          },
        });
        console.log("Administrador agregado exitosamente");
      } else {
        console.log(`Ya existe el administrador con el id ${admins[i].id}`);
      }
    }

    // carga inicial de medicos

    for (let i = 0; i < medicos.length; i++) {
      const medicoDB = await Medico.find({ id: medicos[i].id });
      if (!medicoDB.length) {
        const hashed = await bcrypt.hash(medicos[i].password, ROUNDS);
        const adminDB = await SysAdmin.find({ dni: "00000000" });
        await Medico.create({
          id: medicos[i].id,
          name: medicos[i].name,
          surname: medicos[i].surname,
          dni: medicos[i].dni,
          password: hashed,
          telephone: medicos[i].telephone,
          level: medicos[i].level,
          active: medicos[i].active,
          lastModified: {
            by: adminDB[0]._id,
            date: Date.now(),
          },
        });
        console.log("Profesional médico agregado exitosamente");
      } else {
        console.log(`Ya existe el medico con el id ${medicos[i].id}`);
      }
    }

    //carga inicial empleados

    for (let i = 0; i < employees.length; i++) {
      let employeeDB = await Employee.find({ id: employees[i].id });
      if (!employeeDB.length) {
        let sectorDB = await Sector.find({ name: employees[i].sector });
        if (!sectorDB)
          console.log(
            `No existe el sector ${employees[i].sector}. Debe ser creado previamente.`
          );
        let hashed = await bcrypt.hash(employees[i].password, ROUNDS);
        let adminDB = await SysAdmin.find({ dni: "00000000" });
        await Employee.create({
          id: employees[i].id,
          name: employees[i].name,
          surname: employees[i].surname,
          dni: employees[i].dni,
          telephone: employees[i].telephone,
          sector: sectorDB[0]._id,
          password: hashed,
          discharged: employees[i].discharged,
          level: employees[i].level,
          active: employees[i].active,
          lastModified: {
            by: adminDB[0]._id,
            date: Date.now(),
          },
        });
        console.log("Empleado agregado correctamente");
      } else {
        console.log(`Ya existe el empleado con el id ${employees[i].id}`);
      }
    }
  },
  updateSectorsEmployees: async function () {
    try {
      let employeesDB = await Employee.find();
      for (let i = 0; i < employeesDB.length; i++) {
        let sectorDB = await Sector.findById(employeesDB[i].sector);
        if ( !sectorDB ) {
          console.log(`No existe el sector con el id ${employeesDB[i].sector}`);
        }
        if (sectorDB.employees.includes(employeesDB[i]._id)) {
          console.log(
            `El empleado con el id ${employeesDB[i]._id} ya forma parte del sector ${sectorDB.name}`
          );
        } else {
          sectorDB.employees.push(employeesDB[i]._id);
          await sectorDB.save();
          console.log("Empleado agregado al sector");
        }
      }
      console.log("Sectores actualizados")
    } catch (error: any) {
      console.log(error.message);
    }
  },
};
export default charge;
