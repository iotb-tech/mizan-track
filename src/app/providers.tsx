"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/lib/ThemeContext";


export function Providers({ children }:{ children: ReactNode}){
    const [queryClient] = useState(
        () => new QueryClient({
            defaultOptions:{
                queries: {
                    staleTime: 30_000,
                    retry: 1,
                    refetchOnWindowFocus: true,
                }
            }
        })
    );

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </ThemeProvider>
    )
}