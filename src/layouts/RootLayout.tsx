import { Outlet } from 'react-router';
import { MainNavigation } from '../components/MainNavigation';

export default function RootLayout() {
    return (
        <>
            <header>
                <MainNavigation />
            </header>

            <main className="page">
                <Outlet />
            </main>
        </>
    )
}