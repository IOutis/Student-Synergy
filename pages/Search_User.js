"use client";
import React from 'react';
import UserProfile from '../components/UserProfileComp';
import { useSession } from 'next-auth/react';

export default function SearchUserProfilePage() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <p>Loading...</p>; // Or a loading spinner
    }

    if (!session) {
        return <p>You are not logged in.</p>; // Redirect to login page if needed
    }

    return (
        <div>
            <UserProfile email={session.user.email} name={session.user.name} />

        </div>
    );
}
