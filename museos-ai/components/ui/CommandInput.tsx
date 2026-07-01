interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CommandInput({
  value,
  onChange,
}: CommandInputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="What do you want to create today?"
      className="
      w-full
      rounded-full
      border
      border-white/10
      bg-white/[0.05]
      px-8
      py-6
      text-lg
      outline-none
      backdrop-blur-xl
      placeholder:text-white/30
      focus:border-violet-400/50
      "
    />
  );
}