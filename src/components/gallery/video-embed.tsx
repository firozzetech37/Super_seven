/** YouTube embed via the privacy-enhanced domain; the iframe loads lazily. */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-navy-deep shadow-[0_24px_50px_rgba(15,46,99,0.3)] ring-1 ring-white/10">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="aspect-video w-full"
      />
    </div>
  );
}
