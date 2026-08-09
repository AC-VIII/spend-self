import Link from "next/link";

type BlogCardProps = {
  post: BlogPost;
};

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center gap-3 text-sm">
          <span className="font-medium text-neutral-900">
            {post.category}
          </span>

          <span className="h-1 w-1 rounded-full bg-neutral-400" />

          <span className="text-neutral-500">{post.readTime}</span>
        </div>

        <h3 className="text-xl font-semibold leading-tight tracking-tight text-neutral-950 transition-colors group-hover:text-neutral-600">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-600">
          {post.excerpt}
        </p>

        <div className="mt-5 text-sm font-medium text-neutral-900">
          Read article →
        </div>
      </div>
    </Link>
  );
}