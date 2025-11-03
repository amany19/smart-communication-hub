import { InferenceClient } from '@huggingface/inference';

const hfToken = process.env.HUGGING_FACE_API_KEY;
if (!hfToken) {
  throw new Error("Missing Hugging Face API key (HUGGING_FACE_API_KEY)");
}

export const hfClient =  new InferenceClient(hfToken);
