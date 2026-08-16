export function Features() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 sm:text-4xl">
            Everything important, in one place.
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Stay Consistent */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-xl font-bold text-primary-600">
              ✓
            </div>

            <h3 className="text-xl font-semibold text-neutral-900">
              Stay Consistent
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Create habits, mark daily progress and build streaks that keep
              you accountable.
            </p>
          </div>

          {/* Know Your Spending */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-xl font-bold text-primary-600">
              ₦
            </div>

            <h3 className="text-xl font-semibold text-neutral-900">
              Know Your Spending
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Record expenses, organise them by category and keep an eye on
              your budget.
            </p>
          </div>

          {/* See Your Progress */}
          <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-xl font-bold text-primary-600">
              ↗
            </div>

            <h3 className="text-xl font-semibold text-neutral-900">
              See Your Progress
            </h3>

            <p className="mt-3 leading-7 text-neutral-600">
              Use simple reports to understand your habits and spending over
              time.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}