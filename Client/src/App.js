import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  HashRouter as BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Login/SignUp";
import MainBanner from "./Components/Main Banner/MainBanner";
import AdvertiseBanner from "./Components/AdvertiseBanner/AdvertiseBanner";
import PopupBanner from "./Components/PopupBanner/PopupBanner";
import TrendingAndNewsBanner from "./Components/TrendingAndNewsBanner/TrendingAndNewsBanner";
import TodayAndTomorrowCategory from "./Components/TodayAndTomorrow/TodayAndTomorrowCategory";
import CanvaEditor from "./Components/CustomeDynamicSection/CanvaEditor";
import CustomeDynamicSectionCategory from "./Components/CustomeDynamicSection/CustomeDynamicSectionCategory";
import CustomeDynamicBanner from "./Components/CustomeDynamicSection/CustomeDynamicBanner";
import AddBusinessType from "./Components/My Business/AddBusinessType";
import AddBusinessCategory from "./Components/My Business/AddBusinessCategory";
import AddMyBusinessData from "./Components/My Business/AddMyBusinessData";
import TodayAndTomorrow from "./Components/TodayAndTomorrow/TodayAndTomorrow";
import DynamicSection_Title from "./Components/Dynamic Section/DynamicSection_Title";
import DynamicSection_Data from "./Components/Dynamic Section/DynamicSection_Data";
import TrendingAndNews_Category from "./Components/TrendingAndNewsBanner/TrendingAndNews_Category";
import TrendingAndNews_Data from "./Components/TrendingAndNewsBanner/TrendingAndNews_Data";
// import Polotno from "./Components/Polotno";
// import OwnCanva from "./Components/OwnCanva";
import CustomeDynamicSection from "./Components/CustomeDynamicSection/CustomeDynamicSection";
import CanvaForCustome from "./Components/Frame/CanvaForCustome";
import ViewCreatedFrame from "./Components/CreateFrame/CanvaForFrame";
import CanvaUserRequestForFrame from "./Components/CreateFrame/CanvaUserRequestForFrame";
import AddLanguage from "./Components/AddLanguage/AddLanguage";
import ViewCanvaFrame from "./Components/CreateFrame/ViewCanvaFrame";
import TreeDisplay from "./Components/TreeDisplay/TreeDisplay";
import BusinessNotification from "./Components/Notification/BusinessNotification";
// import PaymentApprove from "./Components/PaymentApproveHistory/PaymentApprove"
import PaymentHistory from "./Components/PaymentApproveHistory/PaymentHistory";
import WithdrawalRequest from "./Components/Withdrawal History/WithdrawalRequest";
import Cookies from "universal-cookie";
import FrameRequest from "./Components/FrameRequest/FrameRequest";
import CompanyWalletHistory from "./Components/CompanyWalletHistory/CompanyWalletHistory";
import NormalUsers from "./Components/Users/NormalUsers";
import TotalMlmJoinUser from "./Components/MlmUser/TotalMlmJoinUser";
import AddDefaultDaysForCategory from "./Components/AddDefaultDaysForCategory/AddDefaultDaysForCategory";
import Dashboard from "./Components/Dashboard/Dashboard";
import CreditTransactions from "./Components/Transactions/CreditTransactions";
import TodayCreditTransactions from "./Components/Transactions/TodayCreditTransactions";
import TodayDebitransaction from "./Components/Transactions/TodayDebitransaction";
import DebitTransactions from "./Components/Transactions/DebitTransactions";
import TodayMlmJoinUser from "./Components/MlmUser/TodayMlmJoinUser";

import AddClippingCount from "./Components/AddClippingCount/AddClippingCount";
import UserTreeView from "./Components/TreeDisplay/UserTreeView";
import UserTransactionHistory from "./Components/Transactions/UserTransactionHistory";
import AddBusinessBanner from "./Components/My Business/AddBusinessBanner";
import SplashScreen from "./Components/SplashScreen/SplashScreen";
import AccessTable from "./Components/AccessTable/AccessTable";
import MyComponent from "./Components/Not Found/MyComponent";
import jwt_decode from "jwt-decode";
import FrameRequestResponce from "./Components/FrameRequest/FrameRequestResponce";
import KycDetails from "./Components/Kyc/Kyc";
import KycComplete from "./Components/Kyc/KycCompele"
import KycReject from "./Components/Kyc/KycReject"
import ReKyc from "./Components/Kyc/ReKyc"
import RewordPrize from "./Components/Transactions/RewordPrize";
import BinaryPrize from "./Components/Transactions/BinaryPrize";
import RoyaltyPrize from "./Components/Transactions/RoyaltyPrize"
import SponcorPrize from "./Components/Transactions/SponcorPrize"
import AllHistory from "./Components/Transactions/AllHistory"
import GlobalRoyalty from "./Components/Transactions/GlobalRoyalty"
import WithdrawalReject from "./Components/Withdrawal History/WithdrawalReject"
import WithdrawalSuccess from "./Components/Withdrawal History/WithdrawalSuccess"
import WithdrawalAllHistory from "./Components/Withdrawal History/WithdrawalAllHistory"
import WithdrawalProgress from "./Components/Withdrawal History/WithdrawalProgress"
import UserWallet from "./Components/Transactions/UserWallet"
import UserWalletHistory from "./Components/Transactions/UserWalletHistory"
import DebitTransactionsDetails from "./Components/Transactions/DebitTransactionsDetails"
import BinaryPrizeDebitDetails from "./Components/Transactions/BinaryPrizeDebitDetails"
import SponcorPrizeDebitDetails from "./Components/Transactions/SponcorPrizeDebitDetails"
import RoyaltyPrizeDebitDetails from "./Components/Transactions/RoyaltyPrizeDebitDetails"
import GlobalRoyaltyDebitHistory from "./Components/Transactions/GlobalRoyaltyDebitHistory"
import Passbook from "./Components/Passbook/Passbook"
import MlmRegister from "./Components/PaymentApproveHistory/MlmRegister"
import MlmReject from "./Components/PaymentApproveHistory/MlmReject"
import MlmComplete from "./Components/PaymentApproveHistory/MlmComplete"
import CompleteFrameRequest from "./Components/FrameRequest/CompleteFrameRequest"

import PaymentFail from "./Components/PhonePePayment/PaymentFail"
import PaymentSuccess from "./Components/PhonePePayment/PaymentSuccess"

// function MainLayout() {
//   const cookies = new Cookies();
//   const isSignedIn = cookies.get("token");
//   if (!isSignedIn) {
//     return <Navigate to="/login" />;
//   }
//   return (
//     <>
//       <div id="main">
//         {/* <Header /> */}
//         <div className="content">
//           <Outlet />
//         </div>
//       </div>
//     </>
//   );
// }

// function Public({ children }) {
//   const cookies = new Cookies();
//   const isSignedIn = cookies.get("token");
//   if (isSignedIn) {
//     return <Navigate to="/" replace />;
//   }
//   return <>{children || <Outlet />}</>;
// }

function App() {
  let cookies = new Cookies();
  const [accessType, setAccessType] = React.useState([]);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwt_decode(cookies.get("token"));
      setAccessType(jwt.accessType);
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route element={<Public />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Route> */}
          {/* <Route element={<MainLayout />}> */}
          {/* <Route path="/kyc" element={<KycDetails />} />
          <Route
            path="/framerequest-responce"
            element={<FrameRequestResponce />}
          />
          <Route path="/error-page" element={<MyComponent />} />
          <Route path="*" element={<MyComponent />} />
          <Route path="/todaymlm-user" element={<TodayMlmJoinUser />} />
          <Route path="/mlm-user" element={<TotalMlmJoinUser />} />
          <Route path="/users" element={<NormalUsers />} />
          <Route
            path="/todaydebit-history"
            element={<TodayDebitransaction />}
          />
          <Route path="/debit-history" element={<DebitTransactions />} />
          <Route
            path="/todaycredit-history"
            element={<TodayCreditTransactions />}
          />
          <Route path="/credit-history" element={<CreditTransactions />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/canva-frame" element={<ViewCreatedFrame />} />
          <Route path="/frame" element={<CanvaForCustome />} />
          <Route path="/frame/:id" element={<CanvaForCustome />} />

          <Route path="/trending" element={<TrendingAndNewsBanner />} />

          <Route path="/canva_editor/:canvasId" element={<CanvaEditor />} />
          <Route path="/canva_editor" element={<CanvaEditor />} />

          <Route path="/business_banner" element={<AddBusinessBanner />} />
          <Route path="/user-tree/:referralId" element={<UserTreeView />} />
          <Route path="/company-wallet" element={<CompanyWalletHistory />} />
          <Route
            path="/user-transaction/:mobileNumber"
            element={<UserTransactionHistory />}
          />

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Add Clipping")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/clipping" element={<AddClippingCount />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Main Banner")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return <Route path="/mainbanner" element={<MainBanner />} />;
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Frame")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/viewCanvaFrame" element={<ViewCanvaFrame />} />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Advertise Banner")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/advertise_banner"
                    element={<AdvertiseBanner />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Popup Banner")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return <Route path="/popup_banner" element={<PopupBanner />} />;
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Trending & News")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/trending_category"
                    element={<TrendingAndNews_Category />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Trending & News")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/trending_section"
                    element={<TrendingAndNews_Data />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Today & Tomorrow")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/today_category"
                    element={<TodayAndTomorrowCategory />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Today & Tomorrow")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/todayandtomorrow"
                    element={<TodayAndTomorrow />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Custome Banner")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/cd_banner" element={<CustomeDynamicBanner />} />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Custome Dynamic Section")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/cds_category"
                    element={<CustomeDynamicSectionCategory />}
                  />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Custome Dynamic Section")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/cds" element={<CustomeDynamicSection />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("My Business")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/business_type" element={<AddBusinessType />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("My Business")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/my_business" element={<AddMyBusinessData />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("My Business")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/business_category"
                    element={<AddBusinessCategory />}
                  />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Dynamic Section")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/dynamic_category"
                    element={<DynamicSection_Title />}
                  />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Dynamic Section")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/dynamic_section"
                    element={<DynamicSection_Data />}
                  />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Payment History")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/paymenthistory" element={<PaymentHistory />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Withdrawal Request")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/withdrawal" element={<WithdrawalRequest />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Add Language")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return <Route path="/language" element={<AddLanguage />} />;
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Tree")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return <Route path="/tree" element={<TreeDisplay />} />;
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Notification")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route
                    path="/notification"
                    element={<BusinessNotification />}
                  />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Frame Request")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/framerequest" element={<FrameRequest />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Category Days")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/days" element={<AddDefaultDaysForCategory />} />
                );
              })()}
          </>
          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Splash Screen")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return (
                  <Route path="/splashscreen" element={<SplashScreen />} />
                );
              })()}
          </>

          <>
            {accessType &&
              (() => {
                if (!accessType.includes("Access")) {
                  return (
                    <Route
                      path="/error-page"
                      element={<Navigate to="/error-page" />}
                    />
                  );
                }
                return <Route path="/access" element={<AccessTable />} />;
              })()}
          </> */}
          {/* </Route> */}
          {/* -------------Before Routes-------------------------------------------------------------------------------------------------- */}
          <Route path="/kyc" element={<KycDetails />} />
          <Route path="/kyc-approval" element={<KycComplete />} />
          <Route path="/kyc-reject" element={<KycReject />} />
          <Route path="/re-kyc" element={<ReKyc />} />
          <Route path="/access" element={<AccessTable />} />
          <Route
            path="/framerequest-responce"
            element={<FrameRequestResponce />}
          />
          <Route path="/splashscreen" element={<SplashScreen />} />
          <Route path="/error-page" element={<MyComponent />} />
          <Route path="*" element={<MyComponent />} />
          <Route path="/todaymlm-user" element={<TodayMlmJoinUser />} />
          <Route path="/mlm-user" element={<TotalMlmJoinUser />} />
          <Route path="/users" element={<NormalUsers />} />
          <Route
            path="/todaydebit-history"
            element={<TodayDebitransaction />}
          />
          <Route path="/debit-history" element={<DebitTransactions />} />
          <Route path="/alldebit-history/:number/:name" element={<DebitTransactionsDetails />} />
          <Route
            path="/todaycredit-history"
            element={<TodayCreditTransactions />}
          />
          <Route path="/credit-history" element={<CreditTransactions />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/mainbanner" element={<MainBanner />} />
          <Route path="/viewCanvaFrame" element={<ViewCanvaFrame />} />
          <Route path="/canva-frame" element={<ViewCreatedFrame />} />
          <Route path="/canva-userframe" element={<CanvaUserRequestForFrame />} />
          <Route path="/frame" element={<CanvaForCustome />} />
          <Route path="/frame/:id" element={<CanvaForCustome />} />
          <Route path="/advertise_banner" element={<AdvertiseBanner />} />`
          <Route path="/popup_banner" element={<PopupBanner />} />
          <Route path="/trending" element={<TrendingAndNewsBanner />} />
          <Route
            path="/trending_category"
            element={<TrendingAndNews_Category />}
          />
          <Route path="/trending_section" element={<TrendingAndNews_Data />} />
          <Route
            path="/today_category"
            element={<TodayAndTomorrowCategory />}
          />
          <Route path="/todayandtomorrow" element={<TodayAndTomorrow />} />
          <Route
            path="/cds_category"
            element={<CustomeDynamicSectionCategory />}
          />
          <Route path="/canva_editor/:canvasId" element={<CanvaEditor />} />
          <Route path="/canva_editor" element={<CanvaEditor />} />
          <Route path="/cd_banner" element={<CustomeDynamicBanner />} />
          <Route path="/cds" element={<CustomeDynamicSection />} />
          <Route path="/business_banner" element={<AddBusinessBanner />} />
          <Route path="/business_type" element={<AddBusinessType />} />
          <Route path="/my_business" element={<AddMyBusinessData />} />
          <Route path="/business_category" element={<AddBusinessCategory />} />
          <Route path="/dynamic_category" element={<DynamicSection_Title />} />
          <Route path="/dynamic_section" element={<DynamicSection_Data />} />
          <Route path="/language" element={<AddLanguage />} />
          <Route path="/tree" element={<TreeDisplay />} />
          <Route path="/user-tree/:number" element={<UserTreeView />} />
          <Route path="/notification" element={<BusinessNotification />} />
          <Route path="/paymenthistory" element={<PaymentHistory />} />
          <Route path="/withdrawal" element={<WithdrawalRequest />} />
          <Route path="/framerequest" element={<FrameRequest />} />
          <Route path="/company-wallet" element={<CompanyWalletHistory />} />
          <Route path="/days" element={<AddDefaultDaysForCategory />} />
          <Route path="/clipping" element={<AddClippingCount />} />
          <Route
            path="/user-transaction/:mobileNumber"
            element={<UserTransactionHistory />}
          />
          <Route path="/reward" element={<RewordPrize />} />
          <Route path="/binary" element={<BinaryPrize />} />
          <Route path="/allbinary_debit/:number/:name" element={<BinaryPrizeDebitDetails />} />
          <Route path="/royalty" element={<RoyaltyPrize />} />
          <Route path="/royalty_detail/:number/:name" element={<RoyaltyPrizeDebitDetails />} />
          <Route path="/sponcor" element={<SponcorPrize />} />
          <Route path="/sponcor-details/:number/:name" element={<SponcorPrizeDebitDetails />} />
          <Route path="/all-history" element={<AllHistory />} />
          <Route path="/global-royalty" element={<GlobalRoyalty />} />
          <Route path="/global_royalty_history/:number/:name" element={<GlobalRoyaltyDebitHistory />} />
          <Route path="/withdrawal-reject" element={<WithdrawalReject />} />
          <Route path="/withdrawal-success" element={<WithdrawalSuccess />} />
          <Route path="/withdrawal-allhistory" element={<WithdrawalAllHistory />} />
          <Route path="/withdrawal-progress" element={<WithdrawalProgress />} />
          <Route path="/wallet" element={<UserWallet />} />
          <Route path="/wallet-history/:number" element={<UserWalletHistory />} />
          <Route path="/passbook" element={<Passbook />} />

          <Route path="/mlm-pending" element={<MlmRegister />} />
          <Route path="/mlm-reject" element={<MlmReject />} />
          <Route path="/mlm-complete" element={<MlmComplete />} />
          <Route path="/complete-framereq" element={<CompleteFrameRequest />} />
          <Route path="/payment-fail" element={<PaymentFail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
