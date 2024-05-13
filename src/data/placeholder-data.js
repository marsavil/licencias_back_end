const admins = [{
  id: '7ab7008d-354f-492c-858e-87b7dc6908f2',
  surname: 'One',
  name: 'Admin',
  dni: '987456321',
  telephone: '1234567890',
  password: '987456321',
  level: 'High',
  active: true,
},
{
  id:"88e328d6-13b3-4c90-9bb6-53e54d9d82ed",
  surname: "system",
  name: "System",
  dni: "00000000",
  telephone: "00000000",
  password: "00000000",
  level: "High",
  active: false,
}]

const employees = [
  {
    id: '5ef8c4ad-6536-4e34-bba4-cd873243a08f',
    surname: 'One',
    name: 'User',
    dni: '12345678',
    telephone: '1234567890',
    sector:'Logística',
    password: '12345678',
    discharged: true,
    level: 'Low',
    active: true,
    lastModified:{
        by: '',
        date:'',
    },
  },
  {
    id: 'cd0c2571-a2fd-492d-8f43-37a93eeadec1',
    surname: 'Two',
    name: 'User',
    dni: '123456789',
    telephone: '1234567890',
    sector:'Taller',
    password: '123456789',
    alta: true,
    level: 'Low',
    active: true,
    lastModified:{
        by: '',
        date:'',
    },
  },
  {
    id: '90ccbeac-b192-4910-8ca8-d0b2c4c7b3a0',
    surname: 'Three',
    name: 'User',
    dni: '123123456',
    telephone: '1234567890',
    sector:'Administración',
    password: '123123456',
    alta: true,
    level: 'Low',
    active: true,
    lastModified:{
        by: '',
        date:'',
    },
  },
];
const sectors = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Logística',
    active: true,
    employess: []
  },
  {
    id: 'cd0c2571-a2fd-492d-8f43-37a93eeadec1',
    name: 'Taller',
    active: true,
    employess: []
  },
  {
    id: '90ccbeac-b192-4910-8ca8-d0b2c4c7b3a0',
    name: 'Administración',
    active: true,
    employess: []
  },
]
const  medicos = [
  {
    id: 'd1c02f85-dbfd-489c-a225-9ec19963d020',
    surname: 'One',
    name: 'Doc',
    dni: '12345456',
    telephone: '1234567890',
    password: '12345456',
    level: 'Mid',
    active: true,
    lastModified:{
        by: '',
        date:'',
    },
  },
  {
    id: 'c117e596-5cf2-4f49-875c-19c2448b2783',
    surname: 'Two',
    name: 'Doc',
    dni: '789456456',
    telephone: '1234567890',
    password: '789456456',
    level: 'Mid',
    active: true,
    lastModified:{
        by: '',
        date:'',
    },
  },
]
module.exports = {
  admins,
  employees,
  sectors,
  medicos,
}
