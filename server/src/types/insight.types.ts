 export interface InsightType {
  id: string;
  conversation_id: string;
  summary?: string;
  sentiment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface InsightCreationAttributes
  extends Partial<Omit<InsightType, 'id'>> {}