import {StartPage, SummaryPage, ModelEvaluation } from "./pages"

export const routes = () => [
    {path: '/', element: <StartPage/>},
    {path: '/summary', element: <SummaryPage/>},
    {path: '/model-response', element: <ModelEvaluation/>}
]