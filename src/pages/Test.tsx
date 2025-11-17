export default function Test() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-indigo-600 mb-4">Test Page</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <p className="text-slate-600">
                    This is a test route to demonstrate navigation.
                </p>
                <button className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors cursor-pointer">
                    Click Me
                </button>
            </div>
        </div>
    );
}