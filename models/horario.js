const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TGAHOR', {
    disciplina: DataTypes.STRING,
    professor: DataTypes.STRING,
    sala: DataTypes.STRING,
    diaSemana: DataTypes.STRING,
    horario: DataTypes.STRING,
    tipo: DataTypes.STRING,
    turno: DataTypes.STRING,
    curso: DataTypes.STRING
  });
};
