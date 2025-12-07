'use client';

import { Plus, X } from 'lucide-react';

interface Props {
  label: string;
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder?: string;
}

export default function DynamicList({ label, items, onChange, placeholder }: Props) {
  const handleAdd = () => {
    onChange([...items, '']);
  };

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            value={item}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 p-2 border rounded-lg text-sm"
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1"
      >
        <Plus className="w-4 h-4" /> Tambah Poin
      </button>
    </div>
  );
}