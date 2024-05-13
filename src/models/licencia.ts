import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineModel(sequelize: Sequelize) {
  sequelize.define("licencia", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    empleadoId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    empresaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    sectorId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coordenadas: {
      type: DataTypes.STRING
    },
    medicoId: {
      type: DataTypes.UUID,
    },
    solicitada: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revisada: {
      type: DataTypes.DATE,
    },
    otorgada:{
      type: DataTypes.BOOLEAN,
    },
    validez:{
      type: DataTypes.ENUM("24", "48", "72"), // según propositos de la empresa,
    },
    derivacion:{
      type: DataTypes.BOOLEAN,
    },
    documentacionId: {
    type: DataTypes.UUID,
    allowNull: false,
    }
  });
};