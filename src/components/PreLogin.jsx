function PreLogin({ userProfile, onLogout }) {
  return (
    <>
      {userProfile
        ? `Connected as ${userProfile.display_name} ! Ready to search`
        : `Connecting...`}
      <button onClick={onLogout}>Logout</button>
    </>
  );
}

export default PreLogin;
