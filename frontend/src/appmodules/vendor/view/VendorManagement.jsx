import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchVendorsRequest,
    createVendorRequest,
    updateVendorRequest,
    deleteVendorRequest,
} from '../redux/vendor.actions';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const VendorManagement = () => {
    const dispatch = useDispatch();
    const { vendors, loading } = useSelector(state => state.vendor);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        specialization: '',
    });

    useEffect(() => {
        dispatch(fetchVendorsRequest());
    }, [dispatch]);

    const handleOpenModal = (vendor = null) => {
        if (vendor) {
            setEditingVendor(vendor);
            setFormData(vendor);
        } else {
            setEditingVendor(null);
            setFormData({ name: '', email: '', phone: '', company: '', specialization: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVendor(null);
        setFormData({ name: '', email: '', phone: '', company: '', specialization: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingVendor) {
            dispatch(updateVendorRequest(editingVendor.id, formData));
        } else {
            dispatch(createVendorRequest(formData));
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            dispatch(deleteVendorRequest(id));
        }
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-typography-900 mb-2">Vendor Management</h1>
                    <p className="text-typography-600">Manage your vendor database</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    Add Vendor
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendors.length === 0 ? (
                    <Card className="col-span-2">
                        <p className="text-center text-typography-500 py-8">
                            No vendors yet. Add your first vendor to get started!
                        </p>
                    </Card>
                ) : (
                    vendors.map((vendor) => (
                        <Card key={vendor.id} className="hover:shadow-2xl transition-shadow duration-300">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-typography-900 mb-1">{vendor.name}</h3>
                                    <p className="text-typography-600 mb-2">{vendor.company}</p>
                                    <div className="space-y-1 text-sm text-typography-600">
                                        <p>📧 {vendor.email}</p>
                                        {vendor.phone && <p>📞 {vendor.phone}</p>}
                                        {vendor.specialization && <p>🏷️ {vendor.specialization}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(vendor)}
                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vendor.id)}
                                        className="text-error-600 hover:text-error-700 font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Vendor Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingVendor ? 'Edit Vendor' : 'Add Vendor'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Vendor Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Email *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <Input
                        label="Company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                    <Input
                        label="Specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    />
                    <div className="flex gap-3 pt-4">
                        <Button type="submit">
                            {editingVendor ? 'Update' : 'Create'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VendorManagement;
