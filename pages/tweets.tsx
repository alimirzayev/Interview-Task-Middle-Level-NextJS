import type { NextApiRequest, NextApiResponse } from 'next'
import { RootObject } from '../types/tweet'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Layout from '../components/layout'
import AccessDenied from '../components/access-denied'
import { connectWallet, createSpace, findPost, postTweet } from '../subsocial'

export default function Page(props: any) {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const [content, setContent] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected')
      const json = await res.json()
      if (json.content) { setContent(json.content) }
    }
    fetchData()
  }, [session])


  // Choose Functionality For Backup
  const [tweets, setTweets] = useState<any>([]);

  const addTweet = (e: RootObject) => {
    if (tweets) {
      if (tweets.filter((i: RootObject) => i.id == e.id).length == 0) {
        setTweets([...tweets, e])
      }
      else {
        alert("Already Added")
      }
    } else {
      setTweets(e)
    }
  }

  // Save Tweets To SubSocial

  const handleSubmit = () => {

  }

  // When rendering client side don't display anything until loading is complete
  // if (typeof window !== 'undefined' && loading) return null
  // If no session exists, display access denied message
  // if (!session) { return <Layout> <AccessDenied /></Layout> }

  if (typeof window !== 'undefined' && loading) {
    return null
  } else if(!session) {
    return <Layout> <AccessDenied /> </Layout>
  }

  // If session exists, display content
  
  return (
    <Layout>
      <h1>User Tweets</h1>
      <section className='card-section'>
        <div className="card-section-container">
          {props
            ?
            props.statuses.map((e: RootObject) => {
              return (
                <div className='card' key={e.created_at}>
                  <button name={e.text} onClick={(event) => {
                    addTweet(e)
                  }}>Choose Tweet</button>
                  <p>{e.text}</p>
                  <p>@{e.user.screen_name}</p>
                  <span>Tweet Date: {e.created_at}</span>
                </div>
              )
            })
            :
            null}
        </div>
        <div className="card-section-btn">
          <button onClick={connectWallet}>Connect Wallet</button>
          <button onClick={createSpace}>Create Space</button>
          <button onClick={() => {
            postTweet('Hello Everyone How Are You')
          }}>Post Tweet</button>
          <button onClick={() => findPost(1)}>Find Post</button>
        </div>
      </section>
    </Layout>
  )
}


export async function getStaticProps(req: NextApiRequest, res: NextApiResponse) {

  const request = await fetch('http://localhost:3000/api/tweet');
  const data = await request.json();

  return {
    props: data,
  }
}