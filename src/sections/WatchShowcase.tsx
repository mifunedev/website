"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaYoutube, FaPlay } from "react-icons/fa";
import {
  YOUTUBE_CHANNEL_URL,
  YOUTUBE_HANDLE,
  type YouTubeVideo,
} from "@/lib/youtube";

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

/** One click-to-play card. The heavy YouTube player only loads on click — the
 *  resting state is a single thumbnail image, so the section stays fast. */
function VideoCard({ video, index }: { video: YouTubeVideo; index: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-green-500/40"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {playing ? (
          <iframe
            src={`${video.embedUrl}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play: ${video.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/90 shadow-[0_0_30px_rgba(34,197,94,0.5)] transition-transform duration-300 group-hover:scale-110">
                <FaPlay className="ml-1 h-5 w-5 text-black" />
              </span>
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-montserrat text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-green-500">
          {video.title}
        </h3>
        {video.published && (
          <p className="mt-auto pt-3 font-montserrat text-xs text-muted-foreground">
            {formatDate(video.published)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

function SectionHeader({ subtitle }: { subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-16 text-center"
    >
      <p className="mb-4 flex items-center justify-center gap-2 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
        <FaYoutube className="h-5 w-5 text-red-500" />
        Watch &amp; Learn
      </p>
      <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
        See how we build,{" "}
        <span className="text-green-500">in public.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl font-montserrat text-lg text-muted-foreground">
        {subtitle}
      </p>
    </motion.div>
  );
}

function ChannelCta({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-12 text-center"
    >
      <a
        href={YOUTUBE_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-montserrat text-sm font-semibold text-white shadow-lg transition-colors hover:bg-red-500"
      >
        <FaYoutube className="h-5 w-5" />
        {label}
      </a>
    </motion.div>
  );
}

export default function WatchShowcase({ videos }: { videos: YouTubeVideo[] }) {
  const hasVideos = videos.length > 0;

  return (
    <section id="watch" className="relative scroll-mt-20 px-4 py-24">
      <div className="mx-auto max-w-5xl">
        {hasVideos ? (
          <>
            <SectionHeader subtitle="Real AI-engineering builds, walkthroughs, and breakdowns — the same techniques we deploy for clients, explained end to end." />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video, index) => (
                <VideoCard key={video.id} video={video} index={index} />
              ))}
            </div>
            <ChannelCta label="See every build on YouTube" />
          </>
        ) : (
          /* Teaser state — shown until the channel is live / has uploads. */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-border bg-card p-10 text-center md:p-14"
          >
            <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10 ring-1 ring-red-600/30">
              <FaYoutube className="h-8 w-8 text-red-500" />
            </span>
            <p className="mb-3 font-montserrat text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Watch &amp; Learn
            </p>
            <h2 className="font-montserrat text-3xl font-bold text-foreground md:text-4xl">
              See how we build,{" "}
              <span className="text-green-500">in public.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-montserrat text-lg text-muted-foreground">
              We&apos;re publishing AI-engineering builds and breakdowns on
              YouTube — the same techniques we deploy for clients. Subscribe and
              build alongside us.
            </p>
            <div className="mt-8">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 font-montserrat text-sm font-semibold text-white shadow-lg transition-colors hover:bg-red-500"
              >
                <FaYoutube className="h-5 w-5" />
                Subscribe on YouTube
              </a>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {YOUTUBE_HANDLE}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
