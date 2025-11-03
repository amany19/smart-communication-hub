export function generateConversationId(user1Id: string, user2Id: string): string {
  
  const sortedIds = [user1Id, user2Id].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
}

export function parseConversationId(conversationId: string): { user1Id: string; user2Id: string } {
  const [user1Id, user2Id] = conversationId.split('_');
  return { user1Id, user2Id };
}