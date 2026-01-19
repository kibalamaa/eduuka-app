import { Plus } from "lucide-react";

type Props = {
  onOpenModal: () => void;
};

export default function ExpenseHeader({ onOpenModal }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Sales</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          What's sold.
        </p>
      </div>
      <button 
        onClick={onOpenModal}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-lg font-medium transition shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Record Sale
      </button>
    </div>
  );
}