import React from 'react'
import './card.css'
function Card() {
  return (
    <div>
       <div class="activities">
            <h1>Activities</h1>
            <div class="activity-container">
              <div class="image-container img-one">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/467cf682-03fb-4fae-b129-5d4f5db304dd" alt="tennis" />
                <div class="overlay">
                  <h3>Tennis</h3>
                </div>
              </div>

              <div class="image-container img-two">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/3bab6a71-c842-4a50-9fed-b4ce650cb478" alt="hiking" />
                <div class="overlay">
                  <h3>Hiking</h3>
                </div>
              </div>

              <div class="image-container img-three">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/c8e88356-8df5-4ac5-9e1f-5b9e99685021" alt="running" />
                <div class="overlay">
                  <h3>Running</h3>
                </div>
              </div>

              <div class="image-container img-four">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/69437d08-f203-4905-8cf5-05411cc28c19" alt="cycling" />
                <div class="overlay">
                  <h3>Cycling</h3>
                </div>
              </div>

              <div class="image-container img-five">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/e1a66078-1927-4828-b793-15c403d06411" alt="yoga" />
                <div class="overlay">
                  <h3>Yoga</h3>
                </div>
              </div>

              <div class="image-container img-six">
                <img src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/7568e0ff-edb5-43dd-bff5-aed405fc32d9" alt="swimming" />
                <div class="overlay">
                  <h3>Swimming</h3>
                </div>
              </div>
            </div>
          </div>

    </div>
  )
}

export default Card