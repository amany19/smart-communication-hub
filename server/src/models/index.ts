import sequelize from "../config/database.config";
import  RefreshToken from "./refreshToken.model";
import User from "./user.model";
import Message from "./message.model";

//associations
//RefreshToken ↔ User
User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

 // Message ↔ User (as sender)
User.hasMany(Message, {
  foreignKey: 'sender_id',
  as: 'sentMessages',
  onDelete: 'CASCADE',
});
Message.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender',
});

//Message ↔ User (as a receiver)
User.hasMany(Message, {
  foreignKey: 'receiver_id',
  as: 'receivedMessages',
  onDelete: 'CASCADE',
});
Message.belongsTo(User, {
  foreignKey: 'receiver_id',
  as: 'receiver',
});
export { User, RefreshToken ,Message};
