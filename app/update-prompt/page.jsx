'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Dynamically import the Form component, ensuring it's only used client-side
const Form = dynamic(() => import('@components/Form'), { ssr: false })

const EditPrompt = () => {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false)
    const [post, setPost] = useState({
        prompt: '',
        tag: ''
    })
    const [promptId, setPromptId] = useState(null) // Track promptId in state

    useEffect(() => {
        // Ensure the code runs only on the client-side
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search)
            const id = searchParams.get('id')
            setPromptId(id) // Set the promptId from the URL query parameters

            if (id) {
                // Fetch prompt details based on the promptId
                const getPromptDetails = async () => {
                    const response = await fetch(`/api/prompt/${id}`)
                    const data = await response.json()
                    setPost({
                        prompt: data.prompt,
                        tag: data.tag
                    })
                }
                getPromptDetails()
            }
        }
    }, []) // Empty dependency array ensures this runs only once on mount

    const updatePrompt = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        if (!promptId) return alert("Prompt ID not found")

        try {
            const response = await fetch(`/api/prompt/${promptId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: post.prompt,
                    tag: post.tag
                })
            })
            console.log("Response: ", response)

            if (response.ok) {
                router.push('/')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div>
            <Form
                type="Edit"
                post={post}
                setPost={setPost}
                submitting={submitting}
                handleSubmit={updatePrompt}
            />
        </div>
    )
}

export default EditPrompt
