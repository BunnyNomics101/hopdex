import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useMarket, useMarkPrice, useOrderbook } from "../utils/markets";
import { useInterval } from "../utils/useInterval";


type ChartData = {
    value: number,
    time: number,
}

interface ChartContext {
    shownChartData: ChartData[],
    markPrice: number,
    orderbook: {bids: any[], asks: any[]}
}

const chartContext = createContext<ChartContext>({
    shownChartData: [],
    markPrice: 0,
    orderbook: {bids: [], asks: []}
})

export function useChartData() {
    return useContext(chartContext)
}


export function ChartProvider({ children }: { children: any }) {

    const [shownChartData, setShownChartData] = useState<ChartData[]>([])
    const [orderbook] = useOrderbook()
    const markPrice = useMarkPrice(orderbook)

    const { market } = useMarket()

    const updateChart = useCallback(()=>{
        if (markPrice === null) return;

        const nowDate = new Date();
        const nowUnix = Math.floor(nowDate.getTime() / 1000);

        setShownChartData((prev) => {
            if (!(prev.length > 0))
                return [...prev, { time: nowUnix, value: markPrice }];
            if (prev[prev.length - 1].time >= nowUnix) return prev;
            return [...prev, { time: nowUnix, value: markPrice }]
        });

    },[markPrice])


    // useEffect(()=>{
    //     console.log(orderbook)
    // },[orderbook])

    useInterval(() => {
        updateChart()
    }, 5000);


    // emptying chart on maket change
    useEffect(() => {
        if (!market) return;
        setShownChartData([])
    }, [market])

    const value: ChartContext = {
        shownChartData,
        markPrice,
        orderbook
    }
    return (
        <chartContext.Provider value={value}>
            {children}
        </chartContext.Provider>
    )
}
