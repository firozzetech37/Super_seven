/** YouTube embed via the privacy-enhanced domain inside a framed stage; the iframe loads lazily. */
export function VideoEmbed({ id, title }: { id: string; title: string }) {
  return (
    <div className="card-premium relative rounded-[1.75rem] bg-stadium p-2 shadow-[0_30px_70px_rgba(15,46,99,0.3)] ring-1 ring-white/10 sm:p-3">
      <div className="overflow-hidden rounded-2xl bg-navy-deep ring-1 ring-white/10">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    </div>
  );
}
