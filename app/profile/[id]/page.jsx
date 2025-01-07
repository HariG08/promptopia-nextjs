"use client"
import React from 'react'
import { useState, useEffect } from 'react'
import { useSession } from '@node_modules/next-auth/react'
import { useRouter, useSearchParams } from '@node_modules/next/navigation'
import Profile from '@components/Profile'

const UserProfile = ({ params }) => {
    const [posts, setPosts] = useState([]);
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const username = searchParams.get('name');

    // Unwrap params using React.use
    const unwrappedParams = React.use(params);
    const userId = unwrappedParams?.id; // Access the id after unwrapping

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${userId}/posts`);
            const data = await response.json();
            setPosts(data);
        }
        fetchPosts();
    }, [userId]); // Ensure userId is included in the dependency array

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: "DELETE"
                });
                const filteredPosts = posts.filter((p) => p._id !== post._id);
                setPosts(filteredPosts);
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <Profile
            name={`${username}'s`}
            desc={`Welcome to ${username}'s personalized profile page. Explore ${username}'s exceptional prompts and be inspired by the power of their imagination`}
            data={posts}
        />
    )
}

export default UserProfile;
