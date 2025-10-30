import sequelize from "../config/database.config";
import  RefreshToken from "./refreshToken.model";
import User from "./user.model";
 

//associations
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

 
export { User, RefreshToken };
