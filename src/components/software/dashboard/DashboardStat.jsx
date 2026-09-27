"use client";

export default function DashboardStat({
  title,
  value,
  icon,
  description,
  variant = "white",
}) {
  const colors = {
    sky: {
      box: "bg-sky-50 border-sky-100",
      title: "text-sky-700",
      value: "text-sky-800",
      icon: "bg-white text-sky-600",
      description: "text-sky-600/70",
    },

    blue: {
      box: "bg-blue-50 border-blue-100",
      title: "text-blue-700",
      value: "text-blue-800",
      icon: "bg-white text-blue-600",
      description: "text-blue-600/70",
    },

    green: {
      box: "bg-green-50 border-green-100",
      title: "text-green-700",
      value: "text-green-800",
      icon: "bg-white text-green-600",
      description: "text-green-600/70",
    },

    purple: {
      box: "bg-purple-50 border-purple-100",
      title: "text-purple-700",
      value: "text-purple-800",
      icon: "bg-white text-purple-600",
      description: "text-purple-600/70",
    },

    orange: {
      box: "bg-orange-50 border-orange-100",
      title: "text-orange-700",
      value: "text-orange-800",
      icon: "bg-white text-orange-600",
      description: "text-orange-600/70",
    },

    white: {
      box: "bg-white border-slate-100",
      title: "text-slate-600",
      value: "text-slate-800",
      icon: "bg-slate-50 text-slate-600",
      description: "text-slate-400",
    },
  };

  const color = colors[variant] || colors.white;

  return (
    <div
      className={`
        w-full
        rounded-xl
        border
        ${color.box}
        shadow-sm
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:shadow-md
      `}
    >
      <div className="p-4">

        {/* Title + Icon */}
        <div className="flex items-center justify-between">

          <p className={`text-sm font-medium ${color.title}`}>
            {title}
          </p>

          {icon && (
            <div
              className={`
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                shadow-sm
                ${color.icon}
              `}
            >
              {icon}
            </div>
          )}

        </div>

        {/* Value */}
        <div
          className={`
            mt-2
            text-2xl
            font-semibold
            ${color.value}
          `}
        >
          {value}
        </div>

        {/* Description */}
        {description && (
          <p
            className={`
              mt-1
              text-xs
              ${color.description}
            `}
          >
            {description}
          </p>
        )}

      </div>
    </div>
  );
}