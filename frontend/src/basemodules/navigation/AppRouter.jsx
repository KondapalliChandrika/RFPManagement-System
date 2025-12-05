import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Dashboard from '../../appmodules/dashboard/view/Dashboard';
import CreateRFP from '../../appmodules/rfp/view/CreateRFP';
import SendRFP from '../../appmodules/rfp/view/SendRFP';
import VendorManagement from '../../appmodules/vendor/view/VendorManagement';
import ProposalComparison from '../../appmodules/proposal/view/ProposalComparison';

const AppRouter = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/create-rfp" element={<CreateRFP />} />
                    <Route path="/send-rfp" element={<SendRFP />} />
                    <Route path="/vendors" element={<VendorManagement />} />
                    <Route path="/proposals/:rfpId" element={<ProposalComparison />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default AppRouter;
