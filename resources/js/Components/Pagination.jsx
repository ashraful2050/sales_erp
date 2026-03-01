import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;
    return (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
            <p className="text-sm text-slate-500">
                Showing results
            </p>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    if (link.label === "&laquo; Previous")
                        return (
                            <Link key={i} href={link.url ?? "#"} disabled={!link.url}
                                className={`p-1.5 rounded ${link.url ? "hover:bg-slate-100 text-slate-600" : "text-slate-300 cursor-not-allowed"}`}>
                                <ChevronLeft size={16} />
                            </Link>
                        );
                    if (link.label === "Next &raquo;")
                        return (
                            <Link key={i} href={link.url ?? "#"} disabled={!link.url}
                                className={`p-1.5 rounded ${link.url ? "hover:bg-slate-100 text-slate-600" : "text-slate-300 cursor-not-allowed"}`}>
                                <ChevronRight size={16} />
                            </Link>
                        );
                    return (
                        <Link key={i} href={link.url ?? "#"}
                            className={`min-w-[32px] h-8 flex items-center justify-center rounded text-sm font-medium transition-colors
                                ${link.active ? "bg-blue-600 text-white" : "hover:bg-slate-100 text-slate-600"}
                                ${!link.url ? "cursor-not-allowed opacity-40" : ""}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
