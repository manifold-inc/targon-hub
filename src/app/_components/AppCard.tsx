interface AppCardProps {
  title: string;
  description: string;
  tokens: string;
  rating: string;
}

export const AppCard = ({
  title,
  description,
  tokens,
  rating,
}: AppCardProps) => {
  return (
    <div className="flex h-44 w-80 flex-col items-start justify-start gap-3 rounded-xl border border-[#e4e7ec] bg-white p-5 shadow">
      <div className="h-5 self-stretch text-lg font-medium leading-7 text-[#667085]">
        {title}
      </div>
      <div className="self-stretch text-xs font-normal leading-4 text-[#667085]">
        {description}
      </div>
      <div className="inline-flex items-center justify-between self-stretch pt-2">
        <div className="text-xs font-normal leading-4 text-[#98a1b2]">
          {tokens}
        </div>
        <div
          className={`py-0.75 gap-0.75 flex items-center justify-center rounded-md px-2 ${
            [
              "bg-red-500",
              "bg-blue-500",
              "bg-green-500",
              "bg-yellow-500",
              "bg-purple-500",
            ][Math.floor(Math.random() * 5)]
          }`}
        >
          <div className="flex items-center justify-start gap-1">
            <div className="text-center text-sm font-semibold leading-tight text-white">
              {rating}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
