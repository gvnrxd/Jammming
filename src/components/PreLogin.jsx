function PreLogin({ userProfile, onLogout }) {
  return (
    <>
      <div className={"logOutBar"}>
        {userProfile
          ? `Connected as ${userProfile.display_name} | Ready to search`
          : `Connecting...`}
        <button onClick={onLogout} className={"logOutButton"}>
          Logout
        </button>
      </div>
    </>
  );
}

export default PreLogin;
