import React from 'react'
import './date.css'
function Date() {
    return (
        <div>
            <div class="main-container-wrapper">
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
    )
}

export default Date