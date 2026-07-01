interface GenreTagsProps {
  genres: string[];
}

export default function GenreTags({ genres }: GenreTagsProps) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-medium text-white/85">
      {genres.map((g, i) => (
        <div key={g} className="flex flex-1 items-center gap-1.5">
          <span className="whitespace-nowrap">{g}</span>
          <span className="h-[2px] flex-1 rounded-full bg-white/25" />
          {i === genres.length - 1 && (
            <span className="h-[2px] w-3 rounded-full bg-white/25" />
          )}
        </div>
      ))}
    </div>
  );
}
