import MinerInputForm from "./MinerInputForm";

const MinerEntryPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-12 pb-12">
      <div className="py-24 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="items-center justify-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                Targon Miner Status
              </h2>
              <MinerInputForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinerEntryPage;
