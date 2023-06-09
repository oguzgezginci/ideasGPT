import React, { useState, useEffect, useRef } from 'react'
import TinderCard from 'react-tinder-card'
import { Card } from 'react-bootstrap'
import styles from './HomeScreen.module.css'
import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import LoginButton from '../components/LoginButton'

export default function HomeScreen() {
  const [idea, setIdea] = useState(null)
  const [cardKey, setCardKey] = useState(0)
  const [loading, setLoading] = useState(false)
  const isSwiping = useRef(false)
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  const [openAIError, setOpenAIError] = useState(false)
  const errorCardRef = useRef()

  useEffect(() => {
    if (isAuthenticated) {
      fetchIdea()
    }
  }, [isAuthenticated])

  async function fetchIdea() {
    if (loading) {
      return
    }
    setLoading(true)
    try {
      const token = await getAccessTokenSilently()
      const response = await axios.get('/ideas/random', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.data
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        )
      }

      setIdea(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
      if (
        (error.response &&
          error.response.data.message.includes('OpenAI API')) ||
        error.response.data.message.includes('Error fetching idea')
      ) {
        setOpenAIError(true)
      } else {
        alert(error.message)
      }
    }
  }

  const onSwipe = async (direction) => {
    console.log('You swiped: ' + direction)

    try {
      // Get the access token
      const token = await getAccessTokenSilently()

      // Send a POST request to the backend with the idea ID and the action (like/dislike)
      const response = await axios.post(
        '/users/swipe',
        {
          ideaId: idea.id,
          action: direction,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // Check the response status
      if (response.status !== 200) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      // Fetch a new idea
      fetchIdea()
      setCardKey((prevKey) => prevKey + 1)
    } catch (error) {
      console.error(error)
      alert(error.message)
    } finally {
      isSwiping.current = false
    }
  }

  const onCardLeftScreen = () => {
    console.log('You swiped the card off the screen.')
    isSwiping.current = false
  }

  const onSwipeErrorCard = () => {
    if (errorCardRef.current) {
      errorCardRef.current.reset()
    }
  }

  return (
    <div>
      <main>
        <div className={styles.textContainer}>
          <p className={styles.descriptionTitle}>Welcome to Ideas-for-you!</p>
          <p className={styles.description}>
            This app helps people with programming skills spark their creativity
            in starting a business.
          </p>
          <p className={styles.description}>
            We use OpenAI to show different ideas, encouraging you to get
            inspired and find your own idea. You can like or dislike the ideas
            shown.
          </p>
          <p className={styles.description}>
            You can revisit the ideas you liked before on your profile.
          </p>
          {!isAuthenticated && (
            <p className={styles.description}>Please sign up first.</p>
          )}
        </div>
        {!isAuthenticated && <LoginButton />}
        <div className={styles.cardAndButtonsContainer}>
          {!loading && (
            <div className={styles.cardWrapper}>
              {openAIError ? (
                // Error card
                <TinderCard
                  key='error'
                  ref={errorCardRef}
                  onSwipe={onSwipeErrorCard}
                  onCardLeftScreen={() => {}}
                  preventSwipe={[]}
                >
                  <Card className={`text-center ${styles.errorCardStyle}`}>
                    <Card.Body>
                      <Card.Title className={styles.unselectable}>
                        Service is currently down
                      </Card.Title>
                      <Card.Text className={styles.unselectable}>
                        Please try again later.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </TinderCard>
              ) : (
                idea && (
                  // Idea card
                  <TinderCard
                    key={cardKey}
                    onSwipe={onSwipe}
                    onCardLeftScreen={onCardLeftScreen}
                    preventSwipe={['up', 'down']}
                  >
                    <Card
                      id='new-idea'
                      className={`text-center ${styles.cardStyle}`}
                    >
                      <Card.Body>
                        <Card.Text className={styles.unselectable}>
                          {idea.text}
                        </Card.Text>
                        <Card.Text className={styles.likes}>
                          Likes: {idea.likes}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </TinderCard>
                )
              )}
            </div>
          )}
          {!loading && idea && (
            <div className={styles.buttonsContainer}>
              <button
                className={styles.dislikeButton}
                onClick={() => onSwipe('left')}
              >
                Dislike
              </button>
              <button
                className={styles.likeButton}
                onClick={() => onSwipe('right')}
              >
                Like
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
