import { CoordinatePlane } from "@/features/coordinatePlane/CoordinatePlane";

export default function CoordinatePlaneRoute() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">
        Coordinate plane
      </h1>
      <CoordinatePlane />
    </div>
  );
}
