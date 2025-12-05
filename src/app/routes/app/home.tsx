import { GettingStartedCanvas } from "../../../features/home/components/GettingStartedCanvas";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">
        Getting started
      </h1>
      <GettingStartedCanvas />
    </div>
  );
}
