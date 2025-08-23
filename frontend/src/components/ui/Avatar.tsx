export default function Avatar({
  initials,
  small,
}: {
  initials: string;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 grid place-items-center text-xs ${
        small ? "w-8 h-8" : "w-10 h-10"
      }`}
    >
      {initials}
    </div>
  );
}
