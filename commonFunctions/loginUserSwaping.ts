export const handleBackToAdmin = () => {
  const get_loginToken: any = localStorage.getItem(
    "Admin_for_Cusromer_QIS_loginToken"
  );
  const login_user: any = localStorage.getItem("Admin_for_Cusromer_QIS_User");
  localStorage.setItem("QIS_loginToken", get_loginToken);
  localStorage.setItem("QIS_User", login_user);
  localStorage.removeItem("Admin_for_Cusromer_QIS_loginToken");
  localStorage.removeItem("Admin_for_Cusromer_QIS_User");
  localStorage.setItem("user", "admin");
  window.location.replace("/admin/customer/customerslist");
};
