interface Props {
  label: string;
}

export default function Pill({ label }: Props) {
  return (
    <span className="px-3 py-1 text-xs bg-accent text-text rounded-full">
      {label}
    </span>
  );
}
