module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define("products", {
        id:{
          type:DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey:true
        },
        name: {
            type: DataTypes.STRING
        },
        price: {
            type: DataTypes.NUMBER
        },
        description: {
            type: DataTypes.STRING
        },
        views:{
            type:DataTypes.NUMBER,
            defaultValue:0
        },
        deleted:{
            type:DataTypes.NUMBER,
            defaultValue:0
        }
    })
    return product
}