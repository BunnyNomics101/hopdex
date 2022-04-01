import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useMarket, useMarkPrice } from "../utils/markets";


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
    const firstOne = useRef(false)


    const { market } = useMarket()

    useEffect(() => {


        if (markPrice === null) return;
        console.log(firstOne.current)
        if (firstOne.current) {
            firstOne.current = false
            return
        };

        const nowDate = new Date();
        const nowUnix = Math.floor(nowDate.getTime() / 1000);

        setShownChartData((prev) => {
            if (!(prev.length > 0))
                return [...prev, { time: nowUnix, value: markPrice }];
            if (prev[prev.length - 1].time >= nowUnix) return prev;
            return [...prev, { time: nowUnix, value: markPrice }]
        });
        firstOne.current = false
    }, [markPrice]);


    // emptying chart on maket change
    useEffect(() => {
        if (!market) return;
        firstOne.current = true;
        setShownChartData([])
    }, [market])

    const value: ChartContext = {
        shownChartData
    }
    return (
        <chartContext.Provider value={value}>
            {children}
        </chartContext.Provider>
    )
}
