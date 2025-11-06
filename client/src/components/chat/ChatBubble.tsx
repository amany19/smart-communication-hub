import { timeAgo } from "@/utils/time";

interface Props {
  message: string;
  isSender?: boolean;
  timestamp: string;
}

export default function ChatBubble({ message, isSender, timestamp }: Props) {
  return (
    <div className={`flex flex-col mb-2 ${isSender ? "items-end" : "items-start"}`}>
      <div
        className={`max-w-[85%] min-w-[40%] px-3 py-2 rounded-xl
                    text-sm sm:text-base md:text-lg lg:text-xl
                    ${isSender
            ? "bg-primary text-white rounded-br-none"
            : "bg-surface border border-border text-text rounded-bl-none"
          }`}
      >
        {message}
      </div>
      <span className="text-[10px] text-text-muted mt-1">{timeAgo(timestamp)}</span>
    </div>
  );
}
