import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className={css.input}
      onChange={handleChange}
      type="text"
      value={value}
      placeholder="Search notes"
    />
  );
}