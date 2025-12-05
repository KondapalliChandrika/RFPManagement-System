import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRFPsRequest } from '../../rfp/redux/rfp.actions';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { formatDate, formatCurrency } from '../../../basemodules/utils/format';
const Dashboard = () => {
    const dispatch = useDispatch();
    const { rfps, loading } = useSelector(state => state.rfp);

    useEffect(() => {
        dispatch(fetchRFPsRequest());
    }, [dispatch]);

    const stats = {
        total: rfps.length,
        draft: rfps.filter(r => r.status === 'draft').length,
        sent: rfps.filter(r => r.status === 'sent').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-typography-900 mb-2">Dashboard</h1>
                <p className="text-typography-600">Manage your RFPs and vendor proposals</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                    <div className="text-center">
                        <p className="text-primary-600 text-sm font-medium mb-1">Total RFPs</p>
                        <p className="text-4xl font-bold text-primary-900">{stats.total}</p>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
                    <div className="text-center">
                        <p className="text-warning-600 text-sm font-medium mb-1">Draft</p>
                        <p className="text-4xl font-bold text-warning-900">{stats.draft}</p>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
                    <div className="text-center">
                        <p className="text-success-600 text-sm font-medium mb-1">Sent</p>
                        <p className="text-4xl font-bold text-success-900">{stats.sent}</p>
                    </div>
                </Card>
            </div>

            {/* Recent RFPs */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-typography-900">Recent RFPs</h2>
                    <Link to="/create-rfp" className="btn-primary">
                        Create New RFP
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {rfps.length === 0 ? (
                        <Card>
                            <p className="text-center text-typography-500 py-8">
                                No RFPs yet. Create your first RFP to get started!
                            </p>
                        </Card>
                    ) : (
                        rfps.map((rfp) => (
                            <Card key={rfp.id} className="hover:shadow-2xl transition-shadow duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-typography-900">{rfp.title}</h3>
                                            <Badge status={rfp.status} />
                                        </div>
                                        <p className="text-typography-600 mb-3">{rfp.description}</p>
                                        <div className="flex gap-6 text-sm text-typography-500">
                                            <span>Budget: {formatCurrency(rfp.budget)}</span>
                                            <span>Deadline: {formatDate(rfp.deadline)}</span>
                                            <span>Created: {formatDate(rfp.created_at)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {rfp.status === 'sent' && (
                                            <Link
                                                to={`/proposals/${rfp.id}`}
                                                className="btn-outline text-sm px-4 py-2"
                                            >
                                                View Proposals
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
