import NetworkHelper from '../../../basemodules/network/NetworkHelper';
import API_URLS from '../../../basemodules/network/urls';

const VendorController = {
    createVendor: async (vendorData) => {
        return await NetworkHelper.post(API_URLS.VENDOR.CREATE, vendorData);
    },

    fetchVendors: async () => {
        return await NetworkHelper.get(API_URLS.VENDOR.LIST);
    },

    updateVendor: async (id, vendorData) => {
        return await NetworkHelper.put(API_URLS.VENDOR.UPDATE(id), vendorData);
    },

    deleteVendor: async (id) => {
        return await NetworkHelper.delete(API_URLS.VENDOR.DELETE(id));
    },
};

export default VendorController;
