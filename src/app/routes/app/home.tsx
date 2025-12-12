import { GettingStarted } from "@/features/home";

export default function HomeRoute() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Getting started
      </h1>
      <GettingStarted />
    </div>
  );
}
