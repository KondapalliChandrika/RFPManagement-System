import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRFPsRequest, sendRFPRequest } from '../redux/rfp.actions';
import { fetchVendorsRequest } from '../../vendor/redux/vendor.actions';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import { formatCurrency } from '../../../basemodules/utils/format';

const SendRFP = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { rfps, loading: rfpLoading, sendSuccess } = useSelector(state => state.rfp);
    const { vendors, loading: vendorLoading } = useSelector(state => state.vendor);

    const [selectedRFP, setSelectedRFP] = useState('');
    const [selectedVendors, setSelectedVendors] = useState([]);

    useEffect(() => {
        dispatch(fetchRFPsRequest());
        dispatch(fetchVendorsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (sendSuccess) {
            alert('RFP sent successfully to selected vendors!');
            navigate('/');
        }
    }, [sendSuccess, navigate]);

    const handleVendorToggle = (vendorId) => {
        setSelectedVendors(prev =>
            prev.includes(vendorId)
                ? prev.filter(id => id !== vendorId)
                : [...prev, vendorId]
        );
    };

    const handleSend = () => {
        if (selectedRFP && selectedVendors.length > 0) {
            dispatch(sendRFPRequest(selectedRFP, selectedVendors));
        }
    };

    const availableRFPs = rfps.filter(r => r.status === 'draft' || r.status === 'sent');
    const rfp = rfps.find(r => r.id === parseInt(selectedRFP));

    if (rfpLoading || vendorLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-typography-900 mb-2">Send RFP</h1>
                <p className="text-typography-600">Select an RFP and vendors to send it to</p>
            </div>

            <Card>
                <div className="space-y-6">
                    {/* Select RFP */}
                    <div>
                        <label className="block text-sm font-medium text-typography-700 mb-2">
                            Select RFP
                        </label>
                        {availableRFPs.length === 0 ? (
                            <p className="text-typography-500">No RFPs available. Create one first!</p>
                        ) : (
                            <select
                                value={selectedRFP}
                                onChange={(e) => {
                                    setSelectedRFP(e.target.value);
                                    setSelectedVendors([]); // Reset selection when RFP changes
                                }}
                                className="input-field"
                            >
                                <option value="">-- Select an RFP --</option>
                                {availableRFPs.map((rfp) => (
                                    <option key={rfp.id} value={rfp.id}>
                                        {rfp.title} ({formatCurrency(rfp.budget)}) 
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* RFP Preview */}
                    {rfp && (
                        <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                            <h3 className="font-bold text-typography-900 mb-2">{rfp.title}</h3>
                            <p className="text-typography-700 text-sm mb-2">{rfp.description}</p>
                            <div className="flex gap-4 text-sm text-typography-600">
                                <span>Budget: {formatCurrency(rfp.budget)}</span>
                                <span>Items: {rfp.items?.length || 0}</span>
                            </div>
                        </div>
                    )}

                    {/* Select Vendors */}
                    <div>
                        <label className="block text-sm font-medium text-typography-700 mb-2">
                            Select Vendors ({selectedVendors.length} selected)
                        </label>
                        {vendors.length === 0 ? (
                            <p className="text-typography-500">No vendors available. Add vendors first!</p>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {vendors.map((vendor) => {
                                    const isSent = rfp?.sent_vendor_ids?.includes(vendor.id);
                                    return (
                                        <label
                                            key={vendor.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border border-outline-200 transition-colors ${isSent ? 'bg-gray-50 opacity-75 cursor-not-allowed' : 'hover:bg-background-50 cursor-pointer'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedVendors.includes(vendor.id) || isSent}
                                                onChange={() => !isSent && handleVendorToggle(vendor.id)}
                                                disabled={isSent}
                                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 disabled:text-gray-400"
                                            />
                                            <div className="flex-1 flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-typography-900">{vendor.name}</p>
                                                    <p className="text-sm text-typography-600">{vendor.email} • {vendor.company}</p>
                                                </div>
                                                {isSent && (
                                                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                        Already Sent
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-outline-200">
                        <Button
                            onClick={handleSend}
                            disabled={!selectedRFP || selectedVendors.length === 0 || rfpLoading}
                        >
                            {rfpLoading ? 'Sending...' : `Send to ${selectedVendors.length} Vendor(s)`}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SendRFP;
