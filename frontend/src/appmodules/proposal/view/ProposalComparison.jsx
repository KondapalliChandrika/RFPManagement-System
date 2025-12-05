import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compareProposalsRequest } from '../redux/proposal.actions';
import Card from '../../../components/ui/Card';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../../basemodules/utils/format';

const ProposalComparison = () => {
    const dispatch = useDispatch();
    const { rfpId } = useParams();
    const { comparison, loading, error } = useSelector(state => state.proposal);

    useEffect(() => {
        if (rfpId) {
            dispatch(compareProposalsRequest(rfpId));
        }
    }, [dispatch, rfpId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p className="text-error-600 mb-2">Error loading proposals</p>
                    <p className="text-typography-600">{error}</p>
                </div>
            </Card>
        );
    }

    if (!comparison) {
        return (
            <Card>
                <p className="text-center text-typography-500 py-8">No comparison data available</p>
            </Card>
        );
    }

    const { proposals, recommendation, topChoice, rfp } = comparison;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-typography-900 mb-2">Proposal Comparison</h1>
                <p className="text-typography-600">AI-powered analysis of vendor proposals</p>
            </div>

            {/* AI Recommendation */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-success-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-typography-900 mb-2">AI Recommendation</h2>
                        <p className="text-typography-700 leading-relaxed">{recommendation}</p>
                        {topChoice && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-success-600 text-white px-4 py-2 rounded-lg font-medium">
                                <span>Top Choice:</span>
                                <span>{topChoice.vendor_name}</span>
                                <span className="bg-typography-white/20 px-2 py-1 rounded">Score: {topChoice.calculatedScore}/100</span>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Proposals */}
            <div>
                <h2 className="text-2xl font-bold text-typography-900 mb-4">Proposals ({proposals.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {proposals.map((proposal, index) => (
                        <Card
                            key={proposal.id}
                            className={`relative ${index === 0 ? 'ring-2 ring-green-500' : ''}`}
                        >
                            {index === 0 && (
                                <div className="absolute -top-3 -right-3 bg-success-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    Best Match
                                </div>
                            )}

                            <div className="space-y-4">
                                {/* Vendor Info */}
                                <div>
                                    <h3 className="text-xl font-bold text-typography-900">{proposal.vendor_name}</h3>
                                    <p className="text-typography-600">{proposal.vendor_company}</p>
                                </div>

                                {/* Score */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-typography-700">Overall Score</span>
                                        <span className="text-2xl font-bold text-primary-600">{proposal.calculatedScore}/100</span>
                                    </div>
                                    <div className="w-full bg-background-200 rounded-full h-3">
                                        <div
                                            className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 rounded-full transition-all duration-500"
                                            style={{ width: `${proposal.calculatedScore}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-200">
                                    <div>
                                        <p className="text-sm text-typography-600">Total Price</p>
                                        <p className="font-semibold text-typography-900">{formatCurrency(proposal.total_price, rfp?.budget)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-typography-600">Delivery Time</p>
                                        <p className="font-semibold text-typography-900">{proposal.delivery_time || 'N/A'}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-typography-600">Terms</p>
                                        <p className="font-semibold text-typography-900">{proposal.terms || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Score Breakdown */}
                                {proposal.scoreFactors && (
                                    <div className="pt-4 border-t border-outline-200">
                                        <p className="text-sm font-medium text-typography-700 mb-2">Score Breakdown</p>
                                        <div className="space-y-1 text-sm">
                                            {proposal.scoreFactors.price !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-typography-600">Price (40%)</span>
                                                    <span className="font-medium">{proposal.scoreFactors.price.toFixed(1)}</span>
                                                </div>
                                            )}
                                            {proposal.scoreFactors.delivery !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-typography-600">Delivery (25%)</span>
                                                    <span className="font-medium">{proposal.scoreFactors.delivery.toFixed(1)}</span>
                                                </div>
                                            )}
                                            {proposal.scoreFactors.completeness !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-typography-600">Completeness (20%)</span>
                                                    <span className="font-medium">{proposal.scoreFactors.completeness.toFixed(1)}</span>
                                                </div>
                                            )}
                                            {proposal.scoreFactors.terms !== undefined && (
                                                <div className="flex justify-between">
                                                    <span className="text-typography-600">Terms (20%)</span>
                                                    <span className="font-medium">{proposal.scoreFactors.terms.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProposalComparison;
