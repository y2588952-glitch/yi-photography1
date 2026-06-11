export default function SectionHeader({
  tag,
  title,
  desc,
}: {
  tag: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center mb-16">
      <span className="inline-block text-xs font-medium tracking-[4px] text-gold uppercase mb-4 relative
        before:content-[''] before:inline-block before:w-6 before:h-px before:bg-gold/50 before:align-middle before:mx-3
        after:content-[''] after:inline-block after:w-6 after:h-px after:bg-gold/50 after:align-middle after:mx-3
        max-sm:before:hidden max-sm:after:hidden">
        {tag}
      </span>
      <h2 className="font-serif text-[42px] font-bold text-white mb-4 tracking-[2px] max-lg:text-[34px] max-sm:text-[28px]">
        {title}
      </h2>
      <p className="text-base text-text-secondary font-light">{desc}</p>
    </div>
  );
}
