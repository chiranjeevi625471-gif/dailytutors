import Link from "next/link";
import type { PromoBanner } from "@/lib/types";

export default function PromoBannerSection({ banners }: { banners: PromoBanner[] }) {
  return (
    <section className="bg-white py-8 sm:py-10 md:py-12">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.link}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center">
                  <span className="text-white text-center text-xl font-bold px-4">{banner.title}</span>
                </div>
              )}
              
              {/* Overlay with title */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <div className="w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg group-hover:text-xl transition-all">
                    {banner.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
