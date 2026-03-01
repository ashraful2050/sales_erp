import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="w-full sm:max-w-md mb-2 px-4">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm transition-colors group"
                >
                    <ArrowLeft
                        size={14}
                        className="group-hover:-translate-x-0.5 transition-transform"
                    />
                    Back to home
                </Link>
            </div>

            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 rounded-2xl shadow-lg" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
