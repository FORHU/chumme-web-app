"use client";

const PRESET_COLORS = [
  "#3A0519",
  "#4A0920",
  "#5A0D28",
  "#670D2F",
  "#740E35",
  "#82103C",
  "#8B1144",
  "#9A134D",
  "#A53860",
  "#B03D6B",
  "#BB4276",
  "#C64881",
  "#D14D8C",
  "#DC5397",
  "#E658A2",
  "#EF5EAD",
  "#F563B8",
  "#FA69C3",
  "#EF88AD",
  "#F292B6",
  "#F59CBF",
  "#F8A6C8",
  "#FBB0D1",
  "#FEBADA",
  "#FFC4E3",
  "#FFCEEC",
  "#FFD8F0",
  "#FFE2F4",
  "#FFECF8",
  "#FFF6FC",
  "#FFDAB9",
  "#FFCBA4",
  "#FFBC8F",
  "#FFAD7A",
  "#FF9E65",
  "#FF8F50",
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  isDark?: boolean;
}

export const ColorPicker = ({
  value,
  onChange,
  isDark = false,
}: ColorPickerProps) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-14 h-14 rounded-xl border-2 border-white/30 shadow-lg shrink-0"
        style={{ backgroundColor: value }}
      />
      <div>
        <div
          className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          Selected
        </div>
        <div
          className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {value.toUpperCase()}
        </div>
      </div>
    </div>

    <div
      className={`rounded-xl p-4 border ${
        isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-10 h-10 rounded-full transition-all hover:scale-110 ${
              value === color
                ? "ring-4 ring-[#A53860] ring-offset-2 scale-110"
                : "hover:ring-2 hover:ring-white/50"
            }`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>

    <div className="mt-3">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          if (e.target.value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
            onChange(e.target.value);
          }
        }}
        placeholder="#A53860"
        className={`w-full h-10 px-3 rounded-lg text-sm transition-all border ${
          isDark
            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
        } focus:border-[#A53860] focus:ring-2 focus:ring-[#A53860]/10 outline-none`}
      />
    </div>
  </div>
);
