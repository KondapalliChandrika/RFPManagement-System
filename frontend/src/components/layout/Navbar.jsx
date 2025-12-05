import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard' },
        { path: '/create-rfp', label: 'Create RFP' },
        { path: '/vendors', label: 'Vendors' },
        { path: '/send-rfp', label: 'Send RFP' },
    ];

    return (
        <nav className="glass-card mb-8">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                        <span className="text-typography-white font-bold text-xl">R</span>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        RFP Manager
                    </h1>
                </div>

                <div className="flex space-x-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${location.pathname === item.path
                                    ? 'bg-primary-600 text-typography-white shadow-lg'
                                    : 'text-typography-700 hover:bg-primary-50'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
