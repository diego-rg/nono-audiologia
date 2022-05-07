function confirmPassword() {
  if (
    document.getElementById("newPassword").value ==
    document.getElementById("confirmNewPassword").value
  ) {
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("submit").disabled = true;
  }
}

module.exports = confirmPassword;
