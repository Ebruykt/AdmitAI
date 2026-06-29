export default function ProgressBar({ currentStep, totalSteps }) {
  const percent = ((currentStep + 1) / totalSteps) * 100;
  return (
    <div className="w-full bg-gray-200 rounded h-2 mb-6">
      <div
        className="bg-teal-600 h-2 rounded transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}