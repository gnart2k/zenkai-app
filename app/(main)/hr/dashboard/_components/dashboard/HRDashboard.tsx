import { ChartAreaInteractive } from "@/components/common/chart-area-interactive"
import { DataTable } from "@/components/common/data-table"

import data from "./data.json"
import { HRSectionCards } from "./hr-section-cards"

export default function HRDashboard() {
  return (
    <>

        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <HRSectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
    </>
  )
}
