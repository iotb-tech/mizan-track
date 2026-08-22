import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16">
        
      {/*left side of our hero page*/}
        <div className="max-w-xl">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-primary-500">
            Your daily balance, simplified
          </span>

          <h1 className="text-4xl font-bold leading-tight text-neutral-900 sm:text-5xl lg:text-6xl">
            Build consistency.
            <span className="block text-primary-500">
              Track your money.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">
            Mizan Track brings your habits, expenses, and personal progress
            into one simple dashboard so you can see where your time, energy,
            and money are going.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-primary-500 px-7 py-3.5 font-semibold text-white shadow-md shadow-primary-500/20 transition hover:bg-primary-600 active:scale-[0.98]"
            >
              Get Started
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-neutral-300 bg-white px-7 py-3.5 font-semibold text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 active:scale-[0.98]"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="text-primary-500 font-bold">✓</span> Track habits</span>
            <span className="flex items-center gap-1.5"><span className="text-primary-500 font-bold">₦</span> Manage expenses</span>
            <span className="flex items-center gap-1.5"><span className="text-primary-500 font-bold">↗</span> Monitor progress</span>
          </div>
        </div>

        {/* Right side of our hero page */}
        <div id="overview" className="relative hidden lg:block">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl">

            {/* Mini dashboard header */}
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <div>
                <p className="text-sm font-bold text-neutral-900">
                  Good morning, Fellow
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  Here&apos;s your progress today
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                <span className="text-xs text-primary-500">●</span>
              </div>
            </div>

            <div className="flex min-h-330px">

              {/* Mini sidebar */}
              <aside className="w-150px border-r border-neutral-200 bg-neutral-50 p-4">
                <div className="space-y-2 text-xs">

                  <div className="rounded-lg bg-primary-500 px-3 py-2 font-medium text-white">
                    ⌂ Dashboard
                  </div>

                  <div className="rounded-lg px-3 py-2 text-neutral-600">
                    ✓ Habits
                  </div>

                  <div className="rounded-lg px-3 py-2 text-neutral-600">
                    ▣ Expenses
                  </div>

                  <div className="rounded-lg px-3 py-2 text-neutral-600">
                    ▤ Reports
                  </div>

                </div>
              </aside>

              {/* Mini dashboard content */}
              <div className="flex-1 p-5">

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3">

                  <div className="rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-lg">🔥</div>
                    <p className="mt-2 text-xl font-bold text-neutral-900">
                      7
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      days streak
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-lg text-primary-500">✓</div>
                    <p className="mt-2 text-xl font-bold text-neutral-900">
                      3/5
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      today
                    </p>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-white p-3">
                    <div className="text-lg text-primary-500">₦</div>
                    <p className="mt-2 text-xl font-bold text-neutral-900">
                      24.5k
                    </p>
                    <p className="text-[10px] text-neutral-500">
                      expenses
                    </p>
                  </div>

                </div>

                {/* Mini chart */}
                <div className="mt-5 rounded-xl border border-neutral-200 p-4">

                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-900">
                      Weekly Overview
                    </p>

                    <span className="text-[10px] text-neutral-500">
                      This week
                    </span>
                  </div>

                  <div className="mt-5 flex h-32 items-end justify-between gap-2">
                    <div className="h-[40%] w-full rounded-t-md bg-primary-100" />
                    <div className="h-[65%] w-full rounded-t-md bg-primary-500" />
                    <div className="h-[35%] w-full rounded-t-md bg-primary-100" />
                    <div className="h-[85%] w-full rounded-t-md bg-primary-500" />
                    <div className="h-[52%] w-full rounded-t-md bg-primary-100" />
                    <div className="h-[30%] w-full rounded-t-md bg-primary-100" />
                    <div className="h-[20%] w-full rounded-t-md bg-primary-100" />
                  </div>

                  <div className="mt-2 flex justify-between text-[9px] text-neutral-400">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>

                </div>

              </div>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute -bottom-6 -right-6 -z-10 h-32 w-32 rounded-full bg-primary-100 blur-2xl" />
        </div>
      </div>
    </section>
  );
}
