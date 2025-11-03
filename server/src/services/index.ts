import AuthService from "./auth.service";
import { InsightService } from "./insights.service";
import MessageService from "./message.service";
import UserService from "./user.service";
import { InsightRepository, MessageRepository } from "../repositories";

 
const messageRepository = new MessageRepository();
const insightRepository = new InsightRepository();


const messageService = new MessageService(messageRepository);
const insightService = new InsightService(insightRepository, messageService);

 
export {
 
    messageService,
    insightService
}


export {
    AuthService,
    UserService,
    MessageService, 
    InsightService
}