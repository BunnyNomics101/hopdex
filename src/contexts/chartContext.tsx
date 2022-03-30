import React, { createContext, useContext, useEffect, useState } from 'react'
import { useMarkPrice } from "../utils/markets";


type ChartData = {
    value: number,
    time: number,
}

interface ChartContext {
    shownChartData: ChartData[],
}

const chartContext = createContext<ChartContext>({
    shownChartData: []
})

export function useChartData() {
    return useContext(chartContext)
}


export function ChartProvider({ children }: { children: any }) {

    const [shownChartData, setShownChartData] = useState<ChartData[]>([])
    const markPrice = useMarkPrice()

    useEffect(() => {
        if (markPrice === null) return;
        const nowDate = new Date();
        const nowUnix = Math.floor(nowDate.getTime() / 1000);
        setShownChartData((prev) => [...prev, { time: nowUnix, value: markPrice }]);
    }, [markPrice]);

    const value: ChartContext = {
        shownChartData
    }
    return (
        <chartContext.Provider value={value}>
            {children}
        </chartContext.Provider>
    )
}
