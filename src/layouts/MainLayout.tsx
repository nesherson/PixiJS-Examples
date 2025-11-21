import { Link, useLocation } from 'react-router-dom';
import { paths, type RouteKeys } from '../config/paths';

interface SideNavigationItem {
    name: string;
    to: string;
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    
    const navigation = Object.keys(paths).map(key => {
        const routeKey = key as RouteKeys;

        return {
            name: paths[routeKey].name,
            to: paths[routeKey].getHref()
        };
    }) as SideNavigationItem[];

    const getLinkClass = (path: string) => {
        const baseClass = "block px-4 py-3 rounded-lg transition-colors duration-200";
        const activeClass = "bg-slate-700 text-white";
        const inactiveClass = "text-slate-400 hover:bg-slate-800 hover:text-white";

        return location.pathname === path
            ? `${baseClass} ${activeClass}`
            : `${baseClass} ${inactiveClass}`;
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
            <aside className="w-64 bg-slate-900 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white tracking-wider">PixiJS Learning</h2>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map(n => {
                        return (
                            <Link key={n.name} to={n.to} className={getLinkClass(n.to)}>
                                {n.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <main className="flex-1 overflow-y-auto relative">
                <header className="bg-white h-16 border-b border-slate-200 flex items-center px-6 sticky top-0 z-10">
                     <span className="text-sm font-medium text-slate-500">
                        Application / {navigation.find(n => n.to === location.pathname)?.name}
                    </span>
                </header>

                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}