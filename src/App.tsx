import { Route, Routes } from "react-router";
import RootLayout from "./layouts/RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  HomePage, 
  CarsPage,
  CarDetailsPage,
  CreateCarPage,
  EditCarPage,
  NotFoundPage,
  LoginPage,
  ConfirmEmailPage,
  ResetPasswordPage,
  ForgotPasswordPage,
  RegisterPage } from "./pages";

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="confirm-email" element={<ConfirmEmailPage />} />

        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} /> 

        <Route element={<ProtectedRoute />}>
          <Route path="cars">
            <Route index element={<CarsPage />} />
            <Route path="new" element={<CreateCarPage />} />
            <Route path=":id" element={<CarDetailsPage />} />
            <Route path=":id/edit" element={<EditCarPage />} />
          </Route>
        </Route>
      
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}