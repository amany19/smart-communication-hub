import api from './api';

export const sendMessage = async (data: {
  sender_id: string;
  receiver_id: string;
  text: string;
}) => {
  const res = await api.post('/messages', data);
  return res.data;
};
