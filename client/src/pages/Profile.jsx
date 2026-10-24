import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../utils/api';

const Profile = () => {
  const { user, refreshUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [profileMsg, setProfileMsg]   = useState({ text: '', type: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors]   = useState({});

  const [passForm, setPassForm]   = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [passMsg, setPassMsg]     = useState({ text: '', type: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passErrors, setPassErrors]   = useState({});

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  // Profile update
  const validateProfile = () => {
    const e = {};
    if (!profileForm.name.trim() || profileForm.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (profileForm.bio.length > 200) e.bio = 'Bio cannot exceed 200 characters.';
    return e;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    setProfileMsg({ text: '', type: '' });
    try {
      await updateProfile(profileForm);
      await refreshUser();
      setProfileMsg({ text: 'Profile updated successfully.', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.response?.data?.message || 'Update failed.', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  // Password change
  const validatePass = () => {
    const e = {};
    if (!passForm.currentPassword) e.currentPassword = 'Enter your current password.';
    if (passForm.newPassword.length < 6) e.newPassword = 'New password must be at least 6 characters.';
    if (passForm.newPassword !== passForm.confirmNew) e.confirmNew = 'Passwords do not match.';
    return e;
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePass();
    if (Object.keys(errs).length) { setPassErrors(errs); return; }

    setPassLoading(true);
    setPassMsg({ text: '', type: '' });
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassMsg({ text: 'Password changed successfully.', type: 'success' });
      setPassForm({ currentPassword: '', newPassword: '', confirmNew: '' });
    } catch (err) {
      setPassMsg({ text: err.response?.data?.message || 'Password change failed.', type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Your profile</h1>

      <div className="profile-layout">
        {/* Left — avatar + info */}
        <div className="profile-sidebar">
          <div className="profile-avatar-large">{initials}</div>
          <p className="profile-name">{user?.name}</p>
          <p className="profile-email">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          <p className="profile-joined">
            Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Right — forms */}
        <div className="profile-forms">
          {/* Edit profile */}
          <div className="form-card">
            <h2>Edit profile</h2>
            {profileMsg.text && (
              <div className={`alert alert-${profileMsg.type}`}>{profileMsg.text}</div>
            )}
            <form onSubmit={handleProfileSubmit} noValidate>
              <div className={`form-group ${profileErrors.name ? 'has-error' : ''}`}>
                <label>Full name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => { setProfileForm({ ...profileForm, name: e.target.value }); setProfileErrors({ ...profileErrors, name: '' }); }}
                  placeholder="Your full name"
                />
                {profileErrors.name && <span className="error-msg">{profileErrors.name}</span>}
              </div>
              <div className={`form-group ${profileErrors.bio ? 'has-error' : ''}`}>
                <label>Bio <span className="field-hint">({profileForm.bio.length}/200)</span></label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => { setProfileForm({ ...profileForm, bio: e.target.value }); setProfileErrors({ ...profileErrors, bio: '' }); }}
                  placeholder="Tell us a little about yourself…"
                  rows={3}
                />
                {profileErrors.bio && <span className="error-msg">{profileErrors.bio}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={profileLoading}>
                {profileLoading ? <span className="btn-spinner" /> : 'Save changes'}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="form-card">
            <h2>Change password</h2>
            {passMsg.text && (
              <div className={`alert alert-${passMsg.type}`}>{passMsg.text}</div>
            )}
            <form onSubmit={handlePassSubmit} noValidate>
              <div className={`form-group ${passErrors.currentPassword ? 'has-error' : ''}`}>
                <label>Current password</label>
                <input
                  type="password"
                  value={passForm.currentPassword}
                  onChange={(e) => { setPassForm({ ...passForm, currentPassword: e.target.value }); setPassErrors({ ...passErrors, currentPassword: '' }); }}
                  placeholder="Enter current password"
                />
                {passErrors.currentPassword && <span className="error-msg">{passErrors.currentPassword}</span>}
              </div>
              <div className={`form-group ${passErrors.newPassword ? 'has-error' : ''}`}>
                <label>New password</label>
                <input
                  type="password"
                  value={passForm.newPassword}
                  onChange={(e) => { setPassForm({ ...passForm, newPassword: e.target.value }); setPassErrors({ ...passErrors, newPassword: '' }); }}
                  placeholder="At least 6 characters"
                />
                {passErrors.newPassword && <span className="error-msg">{passErrors.newPassword}</span>}
              </div>
              <div className={`form-group ${passErrors.confirmNew ? 'has-error' : ''}`}>
                <label>Confirm new password</label>
                <input
                  type="password"
                  value={passForm.confirmNew}
                  onChange={(e) => { setPassForm({ ...passForm, confirmNew: e.target.value }); setPassErrors({ ...passErrors, confirmNew: '' }); }}
                  placeholder="Repeat new password"
                />
                {passErrors.confirmNew && <span className="error-msg">{passErrors.confirmNew}</span>}
              </div>
              <button type="submit" className="btn btn-primary" disabled={passLoading}>
                {passLoading ? <span className="btn-spinner" /> : 'Change password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
