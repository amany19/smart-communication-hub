import { openai } from "../config/openai.config";
import { IMessage } from "./interfaces";
import { MessageType } from "../types";

import { IInsightRepository, InsightRepository, MessageRepository } from "../repositories";
import { MessageService } from ".";
import { generateConversationId } from "../utils/conversation.util";
import { hfClient } from "../config/hg.config";

export class InsightService {
    constructor(
        private insightRepository: IInsightRepository,
        private messageService: IMessage
    ) { }
    //Temporary setting limit to analyse till updating the logic
private  offset:number =0;
private  limit:number =5;
    async openAiAnalyzeConversationPrompt(messages: string[]): Promise<{ summary: string; sentiment: string }> {
        if (!messages?.length) {
            throw new Error("No messages provided for analysis");
        }

        const conversationText = messages.join("\n");
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are a conversation analysis assistant.
Provide:
1. A short summary of the conversation.
2. Sentiment (one word): positive, neutral, or negative.

Return JSON only: {"summary":"...", "sentiment":"..."}`,
                },
                {
                    role: "user",
                    content: conversationText,
                },
            ],
            temperature: 0.2,
        });

        const output = response.choices[0]?.message?.content;

        if (!output) {
            throw new Error("AI returned empty response");
        }

        return JSON.parse(output);
    }
    async hf_SummarizeConversation(conversation: string[]) {
        const text = conversation.join("\n");

        const result = await hfClient.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
        });

        return result.summary_text;
    }

async hfAnalyzeSentiment(conversation: string[]) {
    const text = conversation.join("\n");

    const result = await hfClient.textClassification({
        model: "cardiffnlp/twitter-roberta-base-sentiment",
        inputs: text,
    });

    const top = result[0];
    const labelMap: Record<string, string> = {
        "LABEL_0": "NEGATIVE",
        "LABEL_1": "NEUTRAL",
        "LABEL_2": "POSITIVE"
    };

    const sentimentLabel = labelMap[top.label] || top.label;

    return {
        label: sentimentLabel,  
        score: top.score,
    };
}

    async hfAnalyzeConversation(user1Id: string, user2Id: string): Promise<any> {
        const messagesData = await this.messageService.getConversation(user1Id, user2Id,this.offset,this.limit);
        const messages = messagesData.map((m: MessageType) => m.text);
        const conversationId = generateConversationId(user1Id, user2Id);

        if (messages.length === 0) {
            
            return { conversation_id: conversationId,summary: null, sentiment: null };
        }

        const summary = await this.hf_SummarizeConversation(messages);
        const sentiment = await this.hfAnalyzeSentiment(messages);
        await this.insightRepository.upsertInsight({
            conversation_id: conversationId,
            summary: summary,
            sentiment: sentiment.label,
        });
        return {
            conversation_id: conversationId,
            summary: summary,
            sentiment: sentiment.label,
        }

    }
    async openAiAnalyzeConversation(user1Id: string, user2Id: string): Promise<any> {

        const messagesData = await this.messageService.getConversation(user1Id, user2Id,this.offset,this.limit);
        const messages = messagesData.map((m: MessageType) => m.text);

        if (messages.length === 0) {
            throw new Error("No messages found in conversation");
        }

        const analysis = await this.openAiAnalyzeConversationPrompt(messages);
        const conversationId = generateConversationId(user1Id, user2Id);

        return {
            conversation_id: conversationId,
            summary: analysis.summary,
            sentiment: analysis.sentiment,
        }
    }
    async analyzeAndStoreConversation(user1Id: string, user2Id: string): Promise<any> {


        const analysis = await this.hfAnalyzeConversation(user1Id, user2Id);
        console.log(analysis)

        await this.insightRepository.upsertInsight(analysis);
        return analysis
    }
}


