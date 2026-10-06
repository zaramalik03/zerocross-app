"use client"
import React, { useMemo, useState } from "react";

type FilterGroup = {
  label: string;
  options: { label: string; value: string }[];
};

const filterGroups: FilterGroup[] = [
  {
    label: "Allergens",
    options: [
      { label: "Gluten", value: "gluten" },
      { label: "Peanuts", value: "peanut" },
      { label: "Tree Nuts", value: "tree-nut" },
      { label: "Dairy", value: "dairy" },
      { label: "Egg", value: "egg" },
      { label: "Soy", value: "soy" },
      { label: "Fish", value: "fish" },
      { label: "Shellfish", value: "shellfish" },
      { label: "Sesame", value: "sesame" },
      { label: "Wheat", value: "wheat" },
    ],
  },
  {
    label: "Special Diets",
    options: [
      { label: "Keto", value: "keto" },
      { label: "Paleo", value: "paleo" },
      { label: "Mediterranean", value: "mediterranean" },
      { label: "Low Carb", value: "low-carb" },
      { label: "High Protein", value: "high-protein" },
      { label: "Low FODMAP", value: "low-fodmap" },
    ],
  },
  {
    label: "Lifestyle",
    options: [
      { label: "Vegan", value: "vegan" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Pescatarian", value: "pescatarian" },
      { label: "Halal", value: "halal" },
      { label: "Kosher", value: "kosher" },
    ],
  },
  {
    label: "Cuisine",
    options: [
      { label: "Japanese", value: "japanese" },
      { label: "Indian", value: "indian" },
      { label: "Mexican", value: "mexican" },
      { label: "Thai", value: "thai" },
      { label: "Korean", value: "korean" },
      { label: "Mediterranean", value: "mediterranean-cuisine" },
      { label: "Middle Eastern", value: "middle-eastern" },
      { label: "African", value: "african" },
      { label: "Latin American", value: "latin-american" },
    ],
  },
];

type FilterProps = {
  onFilterChange?: (selected: string[]) => void;
};

const Filter = ({ onFilterChange }: FilterProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleFilter = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter(item => item !== value)
      : [...selected, value];
    setSelected(next);
    onFilterChange?.(next);
  };

  const clearAll = () => {
    setSelected([]);
    onFilterChange?.([]);
  };

  const toggleGroup = (label: string) => {
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>
          Filter
        </h3>
        {selected.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium transition-colors duration-150"
            style={{ color: '#E8A020' }}
          >
            Clear all ({selected.length})
          </button>
        )}
      </div>

      {/* Active chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map(val => {
            const label = filterGroups.flatMap(g => g.options).find(o => o.value === val)?.label ?? val;
            return (
              <button
                key={val}
                onClick={() => toggleFilter(val)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                style={{ backgroundColor: '#1A3D2B', color: '#FAF7F0' }}
              >
                {label} ×
              </button>
            );
          })}
        </div>
      )}

      {/* Groups */}
      {filterGroups.map(group => (
        <div key={group.label} className="border-t pt-4" style={{ borderColor: '#E5E7EB' }}>
          <button
            className="flex items-center justify-between w-full mb-3"
            onClick={() => toggleGroup(group.label)}
          >
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4A5568' }}>
              {group.label}
            </span>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{collapsed[group.label] ? '▶' : '▼'}</span>
          </button>
          {!collapsed[group.label] && (
            <div className="flex flex-wrap gap-2">
              {group.options.map(option => {
                const active = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter(option.value)}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150"
                    style={active
                      ? { backgroundColor: '#1A3D2B', color: '#FAF7F0', borderColor: '#1A3D2B' }
                      : { backgroundColor: 'transparent', color: '#4A5568', borderColor: '#D1D5DB' }
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Filter;
