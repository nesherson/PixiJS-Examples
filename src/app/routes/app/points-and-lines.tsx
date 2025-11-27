import { PointsAndLinesCanvas } from "../../../features/pointsAndLines/PointsAndLinesCanvas";

export default function PointsAndLines() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-indigo-600 mb-4">Points and lines</h1>
            <PointsAndLinesCanvas />
        </div>
    );
}