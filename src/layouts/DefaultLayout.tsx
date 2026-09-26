import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

export default function DefaultLayout() {
    return (
        <div className="min-h-screen bg-white text-[#040136] flex flex-col font-sans antialiased selection:bg-[#EE4C01]/20 selection:text-[#EE4C01]">
            <Header />
            <main className="flex-1 w-full flex flex-col">
                <Outlet />
            </main>
        </div>
    )
}
