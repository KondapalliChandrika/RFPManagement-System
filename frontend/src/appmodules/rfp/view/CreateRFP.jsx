import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRFPRequest } from '../redux/rfp.actions';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../../basemodules/utils/format';

const CreateRFP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, createSuccess, selectedRFP, error } = useSelector(state => state.rfp);

    const [input, setInput] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (createSuccess && selectedRFP) {
            setShowPreview(true);
        }
    }, [createSuccess, selectedRFP]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            dispatch(createRFPRequest(input));
        }
    };

    const handleDone = () => {
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-typography-900 mb-2">Create RFP</h1>
                <p className="text-typography-600">Describe what you want to procure in natural language</p>
            </div>

            {!showPreview ? (
                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-typography-700 mb-2">
                                Describe your procurement needs
                            </label>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Example: I need to procure laptops and monitors for our new office. Budget is $50,000 total. Need delivery within 30 days. We need 20 laptops with 16GB RAM and 15 monitors 27-inch. Payment terms should be net 30, and we need at least 1 year warranty."
                                rows={8}
                                className="w-full px-4 py-3 rounded-lg border border-outline-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 outline-none bg-typography-white resize-none"
                                disabled={loading}
                            />
                            <p className="text-sm text-typography-500 mt-2">
                                Include details like budget, deadline, items needed, quantities, specifications, payment terms, and warranty requirements.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-error-50 border border-red-200 text-error-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit" disabled={loading || !input.trim()}>
                                {loading ? 'Processing with AI...' : 'Generate RFP'}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
                                Cancel
                            </Button>
                        </div>

                        {loading && (
                            <div className="flex items-center gap-3 text-primary-600">
                                <LoadingSpinner size="sm" />
                                <span>AI is analyzing your request...</span>
                            </div>
                        )}
                    </form>
                </Card>
            ) : (
                <Card>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-success-600 mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <h2 className="text-2xl font-bold">RFP Created Successfully!</h2>
                        </div>

                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg border border-primary-200">
                            <h3 className="text-xl font-bold text-typography-900 mb-4">{selectedRFP.title}</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-typography-600">Budget</p>
                                    <p className="font-semibold text-typography-900">{formatCurrency(selectedRFP.budget)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-typography-600">Deadline</p>
                                    <p className="font-semibold text-typography-900">{formatDate(selectedRFP.deadline) || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-typography-600">Payment Terms</p>
                                    <p className="font-semibold text-typography-900">{selectedRFP.payment_terms || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-typography-600">Warranty</p>
                                    <p className="font-semibold text-typography-900">{selectedRFP.warranty || 'Not specified'}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-typography-600 mb-2">Description</p>
                                <p className="text-typography-900">{selectedRFP.description}</p>
                            </div>

                            {selectedRFP.items && selectedRFP.items.length > 0 && (
                                <div>
                                    <p className="text-sm text-typography-600 mb-2">Items</p>
                                    <ul className="space-y-2">
                                        {selectedRFP.items.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-primary-600">•</span>
                                                <span className="text-typography-900">
                                                    {item.quantity}x {item.name}
                                                    {item.specifications && ` (${item.specifications})`}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleDone}>
                                Go to Dashboard
                            </Button>
                            <Button variant="outline" onClick={() => navigate('/send-rfp')}>
                                Send to Vendors
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default CreateRFP;
