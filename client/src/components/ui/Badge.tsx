interface Props {
  type: "positive" | "neutral" | "negative";
}

export default function Badge({ type }: Props) {
  const classes = {
    positive: "bg-green-200 text-green-800",
    neutral: "bg-gray-200 text-gray-800",
    negative: "bg-red-200 text-red-800",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-md ${classes[type]}`}>
      {type}
    </span>
  );
}
