import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                <Navbar />
                <main className="animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
