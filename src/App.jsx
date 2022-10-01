import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SUPER_ADMIN } from "./redux/constants/userContants";
import { verifyToken } from "./redux/actions/userAction";
import { HomePage } from "./Components/Layout/HomePage/HomePage";
import { LoginSignup } from "./Components/Layout/LoginSignUp/LoginSignup";
import { LoginPage } from "./Components/Layout/LoginSignUp/LoginPage";
import { SignupPage } from "./Components/Layout/LoginSignUp/SignupPage";
import { ResetPassword } from "./Components/Layout/LoginSignUp/ResetPassword";
import MainLayout from "./Components/Layout/MainLayout";
import DashBoard from "./Components/Dashboard/DashBoard";
import { AdminDashboard } from "./Components/SuperAdmin/AdminDashboard";
import { LoginLoading } from "./Components/Loaders/LoginLoading";
import { TemplateTasks } from "./Components/Templates/Tasks/TemplateTasks";
import TaskPage from "./Components/Tasks/TaskPage";
import { IssueCategory } from "./Components/Issues/components/IssueCategory";
export const App = () => {
	const dispatch = useDispatch();
	const { isAuthenticated, user, loading } = useSelector((state) => state.user);

	useEffect(() => {
		try {
			if (!isAuthenticated && localStorage.getItem("token"))
				dispatch(verifyToken())
		} catch (e) {
			console.log(e);
		}
	}, [isAuthenticated, user.id, dispatch]);

	return (
		<Routes>
			{!isAuthenticated ? (<>
				<Route path="user" element={<LoginSignup isAuthenticated={isAuthenticated} />}>
					<Route path="login" element={<LoginPage />} />
					<Route path="signup" element={<SignupPage />} />
					<Route path="reset-password" element={<ResetPassword />} />
				</Route>
				<Route path="*" element={loading ? <LoginLoading /> : (!localStorage.getItem("token") && <Navigate to="/user/login" />)} />
			</>) :
				(<>
					<Route element={<MainLayout />}>
						{user.roleData?.name === SUPER_ADMIN && <Route path="admin" element={<AdminDashboard />} />}
						<Route path="dashboard" element={<DashBoard />} />
						<Route path="chats" element={<HomePage />} />
						{user.roleData?.name === SUPER_ADMIN && <Route path="template/tasks" element={<TemplateTasks />} />}
						<Route path="tasks" element={<TaskPage />} />
						<Route path="issues" element={<IssueCategory />} />
						<Route path="*" element={<Navigate to="dashboard" />} />
					</Route>
				</>)}
		</Routes>
	);
};
