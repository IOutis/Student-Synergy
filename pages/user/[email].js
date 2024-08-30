// pages/user/[email].js
import React from 'react';
import UserProfile from '../../components/UserProfileComp';
export default function Profile({ email }) {
  return (
    <div>
      <UserProfile email = {email}></UserProfile>
    </div>
  );
}

// Fetch data on the server side
export async function getServerSideProps(context) {
  const { email } = context.params;

  // Here you can fetch more data if needed, for now we just return the email
  return {
    props: {
      email,
    },
  };
}
