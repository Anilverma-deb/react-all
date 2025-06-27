
import React, { useEffect, useRef } from 'react';
import './calendar.css'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Pagination, Mousewheel, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

function Calendar() {
 const slides = [
    {
      date: "26 December 2019",
      title: "Empowering Education",
      text: "Unlock the power of digital learning in your classroom. Inspire students with interactive tools and engaging content.",
      image: "https://source.unsplash.com/random/800x600/?education,student"
    },
    {
      date: "26 December 2019",
      title: "Modern Campus Life",
      text: "Experience the future of college life with integrated smart services and digital administration.",
      image: "https://source.unsplash.com/random/800x600/?college,technology"
    },
    {
      date: "26 December 2019",
      title: "Innovative Learning",
      text: "Redefine classroom boundaries with virtual labs, AI assistance, and immersive experiences.",
      image: "https://source.unsplash.com/random/800x600/?classroom,innovation"
    }
  ];

  return (
    <div>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-full md:w-7/12 px-2">
      <div className="left-side">
        <Swiper
          modules={[EffectFade, Pagination, Mousewheel, Autoplay]}
          effect="fade"
          loop={true}
          speed={800}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          mousewheel={{ 
            invert: false,
            sensitivity: 0.5
          }}
          pagination={{ 
            el: '.blog-slider__pagination',
            clickable: true,
            dynamicBullets: true,
          }}
          className="blog-slider"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="blog-slider__item">
                {/* Content (Left Side) */}
                <div className="blog-slider__content">
                  <span className="blog-slider__code">{slide.date}</span>
                  <div className="blog-slider__title">{slide.title}</div>
                  <div className="blog-slider__text">{slide.text}</div>
                  <a href="#" className="blog-slider__button">READ MORE</a>
                </div>

                {/* Image (Right Side) */}
                <div className="blog-slider__img">
                  <img src={slide.image} alt={slide.title} />
                </div>
              </div>
            </SwiperSlide>
          ))}
          
          {/* Pagination (Below Content) */}
          <div className="blog-slider__pagination"></div>
        </Swiper>
      </div>
    </div>

        <div className="w-full sm:w-full md:w-5/12 px-2">
          {/* right side */}
          <div className="right-side">
            <div class="main-container-wrapper">
              <header>
                <button class="header__btn header__btn--left" title="Menu">
                  <svg class="icon" width="20px" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#fff" d="M0 0h20v2H0zM0 7h20v2H0zM0 14h20v2H0z" />
                  </svg>
                </button>
                <button class="header__btn header__btn--right" title="Add event">
                  <svg class="icon" width="26px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="#fff" d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z" />
                  </svg>
                </button>
              </header>
              <main>
                <div class="calendar-container">
                  <div class="calendar-container__header">
                    <button class="calendar-container__btn calendar-container__btn--left" title="Previous">
                      <i class="icon ion-ios-arrow-back"></i>
                    </button>
                    <h2 class="calendar-container__title">October 2018</h2>
                    <button class="calendar-container__btn calendar-container__btn--right" title="Next">
                      <i class="icon ion-ios-arrow-forward"></i>
                    </button>
                  </div>
                  <div class="calendar-container__body">
                    <div class="calendar-table">
                      <div class="calendar-table__header">
                        <div class="calendar-table__row">
                          <div class="calendar-table__col">S</div>
                          <div class="calendar-table__col">M</div>
                          <div class="calendar-table__col">T</div>
                          <div class="calendar-table__col">W</div>
                          <div class="calendar-table__col">T</div>
                          <div class="calendar-table__col">F</div>
                          <div class="calendar-table__col">S</div>
                        </div>
                      </div>
                      <div class="calendar-table__body">
                        <div class="calendar-table__row">
                          <div class="calendar-table__col calendar-table__inactive">
                            <div class="calendar-table__item">
                              <span>30</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__today">
                            <div class="calendar-table__item">
                              <span>1</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>2</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>3</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>4</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event">
                            <div class="calendar-table__item">
                              <span>5</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>6</span>
                            </div>
                          </div>
                        </div>
                        <div class="calendar-table__row">
                          <div class="calendar-table__col calendar-table__event">
                            <div class="calendar-table__item">
                              <span>7</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>8</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>9</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>10</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>11</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>12</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>13</span>
                            </div>
                          </div>
                        </div>
                        <div class="calendar-table__row">
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>14</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>15</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--start">
                            <div class="calendar-table__item">
                              <span>16</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event calendar-table__event--long">
                            <div class="calendar-table__item">
                              <span>17</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--end">
                            <div class="calendar-table__item">
                              <span>18</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>19</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>20</span>
                            </div>
                          </div>
                        </div>
                        <div class="calendar-table__row">
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>21</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>22</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>23</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>24</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>25</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>26</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--start">
                            <div class="calendar-table__item">
                              <span>27</span>
                            </div>
                          </div>
                        </div>
                        <div class="calendar-table__row">
                          <div class="calendar-table__col calendar-table__event calendar-table__event--long calendar-table__event--end">
                            <div class="calendar-table__item">
                              <span>28</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>29</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>30</span>
                            </div>
                          </div>
                          <div class="calendar-table__col">
                            <div class="calendar-table__item">
                              <span>31</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__event calendar-table__inactive">
                            <div class="calendar-table__item">
                              <span>1</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__inactive">
                            <div class="calendar-table__item">
                              <span>2</span>
                            </div>
                          </div>
                          <div class="calendar-table__col calendar-table__inactive">
                            <div class="calendar-table__item">
                              <span>3</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="events-container">
                  <span class="events__title">Upcoming events this month</span>
                  <ul class="events__list">
                    <li class="events__item">
                      <div class="events__item--left">
                        <span class="events__name">Town hall meeting</span>
                        <span class="events__date">Oct 5</span>
                      </div>
                      <span class="events__tag">16:00</span>
                    </li>
                    <li class="events__item">
                      <div class="events__item--left">
                        <span class="events__name">Meet with George</span>
                        <span class="events__date">Oct 7</span>
                      </div>
                      <span class="events__tag">10:00</span>
                    </li>
                    <li class="events__item">
                      <div class="events__item--left">
                        <span class="events__name">Vacation!!!</span>
                        <span class="events__date">Oct 16 - Oct 18</span>
                      </div>
                      <span class="events__tag events__tag--highlighted">All day</span>
                    </li>
                    <li class="events__item">
                      <div class="events__item--left">
                        <span class="events__name">Visit Grandma</span>
                        <span class="events__date">Oct 27 - Oct 28</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>



    </div>
  )
}

export default Calendar;
