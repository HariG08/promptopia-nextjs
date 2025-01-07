"use client"
import {useEffect, useState} from 'react'
import PromptCard from './PromptCard'

const PromptCardList = ({data,handleTagClick}) =>{
  return(
    <div className="mt-16 prompt_layout">
      {data.map((post)=>(
        <PromptCard
        key={post._id}
        post = {post}
        handleTagClick = {handleTagClick}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([])
  const [posts, setPosts] = useState([])
  
  const handleSearchChange = (e) =>{
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)
    
    setSearchTimeout(
      setTimeout(()=>{
        const searchResult = filteredPrompts(e.target.value);
        setSearchedResults(searchResult)
      },500)
    )
  }
  useEffect(()=>{
    const fetchPosts = async () =>{
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data)
    }
    fetchPosts();
  },[])

  const filteredPrompts = (searchText) =>{
    const regex = new RegExp(searchText,"i")
    return posts.filter((item)=>(
      regex.test(item.creator?.username) || regex.test(item.tag) || regex.test(item.prompt)
    ))
  }

  
    const handleTagClick = (tagName) => {
      setSearchText(tagName);

      const searchResult = filteredPrompts(tagName);
      setSearchedResults(searchResult);
    };
  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input type="text" placeholder='Search for a tag or a username'
        value={searchText}
        onChange={handleSearchChange}
        requiredk = "true"
        className='search_input peer'
        />
      </form>

      <PromptCardList
      data = {searchText?searchedResults:posts}
      handleTagClick={handleTagClick}
      />

    </section>
  )
}

export default Feed
