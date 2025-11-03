import { Op } from 'sequelize';
import { Insight } from '../models';
import { InsightType, InsightCreationAttributes } from '../types';
import { User } from '../models';
import { generateConversationId } from '../utils/conversation.util';

export interface IInsightRepository {
    createInsight(data: InsightCreationAttributes): Promise<InsightType>;
    findById(id: string): Promise<InsightType | null>;
    getByConversationId(sender_id: string, receiver_id: string): Promise<InsightType | null>;
    updateInsight(id: string, updates: Partial<InsightType>): Promise<InsightType | null>;
    upsertInsight(data: InsightCreationAttributes): Promise<InsightType>;
    deleteInsight(id: string): Promise<boolean>;
}

export class InsightRepository implements IInsightRepository {
    async createInsight(data: InsightCreationAttributes): Promise<InsightType> {
        const insight = await Insight.create(data);
        return insight.get({ plain: true }) as InsightType;
    }

    async findById(id: string): Promise<InsightType | null> {
        const insight = await Insight.findByPk(id);
        return insight ? (insight.get({ plain: true }) as InsightType) : null;
    }

    async getByConversationId(sender_id: string, receiver_id: string): Promise<InsightType | null> {
        const conversation_id = generateConversationId(sender_id, receiver_id);
        const insight = await Insight.findOne({
            where: {
                conversation_id,
            },
        });
        return insight ? (insight.get({ plain: true }) as InsightType) : null;
    }

    async updateInsight(id: string, updates: Partial<InsightType>): Promise<InsightType | null> {
        const insight = await Insight.findByPk(id);
        if (!insight) return null;

        await insight.update(updates);
        return insight.get({ plain: true }) as InsightType;
    }

    async upsertInsight(data: InsightCreationAttributes): Promise<InsightType> {
        const [insight] = await Insight.upsert(data, {
            returning: true,
            conflictFields: ['conversation_id'] 
        });
        return insight.get({ plain: true }) as InsightType;
    }

    async deleteInsight(id: string): Promise<boolean> {
        const deletedCount = await Insight.destroy({
            where: { id }
        });
        return deletedCount > 0;
    }


}

