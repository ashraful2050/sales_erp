import { useForm } from "@inertiajs/react";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

export default function SearchFilter({ value, onChange, placeholder = "Search…", className = "" }) {
    const ref = useRef();
    return (
        <div className={`relative ${className}`}>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
                ref={ref}
                type="text"
                value={value ?? ""}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-8 py-2 text-sm border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {value && (
                <button onClick={() => onChange("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
