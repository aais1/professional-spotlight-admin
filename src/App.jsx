import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader/index.tsx';
import PageTitle from './components/PageTitle.tsx';
import SignIn from './pages/Authentication/SignIn.jsx';
import SignUp from './pages/Authentication/SignUp.tsx';
import Calendar from './pages/Calendar.tsx';
import Chart from './pages/Chart.tsx';
import ECommerce from './pages/Dashboard/ECommerce.tsx';
import FormElements from './pages/Form/FormElements.tsx';
import FormLayout from './pages/Form/FormLayout.tsx';
// import Profile from './pages/Profile';
import Settings from './pages/Settings.jsx';
import Tables from './pages/Tables.tsx';
import Alerts from './pages/UiElements/Alerts.tsx';
import Buttons from './pages/UiElements/Buttons.tsx';
import DefaultLayout from './layout/DefaultLayout.tsx';
import Reviews from './pages/Reviews/index.jsx';
import Portfolio from './pages/Portfolio/index.jsx';
import ApproveReviews from './pages/ApproveReviews/index.jsx';
import Biographies from './pages/Biographies/index.jsx';
// import TestBiography from './pages/Biographies/TestBiography.jsx';
import TestBiography from './pages/Biographies/TestBiography.jsx';
import { useAuthStore } from './Zustand/AuthStore.jsx';

const Dashboard = () => (
  <>
    Welcome to Admin Dashboard!
  </>
);

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  const isLoggedin = useAuthStore((state) => state.isAuthenticated);
  console.log('isLoggedin', isLoggedin);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
    <Routes>
    {/* <Route
            path="/biography/:slug"
            element={
              <>
                <PageTitle title="Test biography" />
                <TestBiography />
              </>
            }
          /> */}
    </Routes>
      {!isLoggedin ? (
        <Routes>
            <Route
            path="/biography/:slug"
            element={
              <>
                <PageTitle title="Test biography" />
                <TestBiography />
              </>
            }
          />
          <Route
            path="/auth/signin"
            element={
              <>
                <PageTitle title="Signin" />
                <SignIn />
              </>
            }
          />
          <Route path="*" element={<Navigate to="/auth/signin" />} />
        </Routes>
      ) : (
        <DefaultLayout>
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/settings" />}
            />
            <Route
              path="/settings"
              element={
                <>
                  <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <Settings />
                </>
              }
            />
            <Route
              path="/portfolio"
              element={
                <>
                  <PageTitle title="Portfolio " />
                  <Portfolio />
                </>
              }
            />
            {/* route  to send  a testing biography to user  and its initial domain will be change*/}
          
            <Route
              path="/review"
              element={
                <>
                  <PageTitle title="Reviews " />
                  <Reviews />
                </>
              }
            />
            
            <Route
              path="/approve-reviews"
              element={
                <>
                  <PageTitle title="Approve Reviews " />
                  <ApproveReviews />
                </>
              }
            />
            <Route
              path="/biographies"
              element={
                <>
                  <PageTitle title="Biographies " />
                  <Biographies />
                </>
              }
            />
            {/* Uncomment the SignUp route if needed */}
            {/* <Route
              path="/auth/signup"
              element={
                <>
                  <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                  <SignUp />
                </>
              }
            /> */}
          </Routes>
        </DefaultLayout>
      )}
    </>
  );
}

export default App;