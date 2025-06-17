import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/styles.css';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user} = useAuth();
  const [progress, setProgress] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [tasks, setTasks] = useState({
    day1: { task1: false, task2: false },
    day2: { task1: false, task2: false },
    day3: { task1: false, task2: false },
    day4: { task1: false, task2: false },
    day5: { task1: false, task2: false },
    day6: { task1: false, task2: false },
    day7: { task1: false, task2: false }
  });

  const maxDay = Object.keys(tasks).length;

  // Animated progress state
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const animationRef = useRef();

  // Refs for day cards
  const dayRefs = useRef(Array.from({ length: maxDay }, () => React.createRef()));

  // Animate the progress ring
  useEffect(() => {
    let current = animatedProgress;
    if (progress > current) {
      animationRef.current = setInterval(() => {
        current++;
        setAnimatedProgress(current);
        if (current >= progress) clearInterval(animationRef.current);
      }, 10);
    } else if (progress < current) {
      animationRef.current = setInterval(() => {
        current--;
        setAnimatedProgress(current);
        if (current <= progress) clearInterval(animationRef.current);
      }, 10);
    }
    return () => clearInterval(animationRef.current);
  }, [progress]);

  // Cap currentDay and show journey complete
  useEffect(() => {
    if (currentDay > maxDay) {
      setCurrentDay(maxDay + 1); // Sentinel value for completion
    }
  }, [currentDay, maxDay]);

  // Scroll to the current day card when currentDay changes
  useEffect(() => {
    if (currentDay >= 2 && currentDay <= maxDay) {
      const ref = dayRefs.current[currentDay - 1];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentDay, maxDay]);

  const checkTasks = (day) => {
    const dayKey = `day${day}`;
    if (!tasks[dayKey]) return;
    const allTasksCompleted = Object.values(tasks[dayKey]).every(task => task);
    if (allTasksCompleted) {
      setProgress(prev => Math.min(prev + 100 / maxDay, 100));
      if (day === currentDay && currentDay < maxDay) {
        setCurrentDay(prev => prev + 1);
      } else if (day === currentDay && currentDay === maxDay) {
        setCurrentDay(maxDay + 1); // Mark as complete
      }
    }
  };

  const handleTaskChange = (day, task) => {
    setTasks(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [task]: !prev[day][task]
      }
    }));
  };

  useEffect(() => {
    checkTasks(currentDay);
  }, [tasks, currentDay]);

  return (
    <div>
      <header>
        <div className="logo">Empower+</div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/community">Community</Link>
          <Link to="/challenges">Challenges</Link>
          <Link to="/profile">Profile</Link>
        </nav>
      </header>

      <main className="dashboard">
        <div className="dashboard-container">
          <div className="top-row">
            {/* Health Journey Card */}
            <div className="health-journey-card">
              <div className="journey-header">
                <h2>Your Health Journey</h2>
                <p>A 7-day personalized health journey</p>
              </div>

              <div className="timeline-track">
                {/* Day 1 */}
                <div className="day-card" data-day="1" ref={dayRefs.current[0]}>
                  <h3>Day 1</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day1.task1}
                        onChange={() => handleTaskChange('day1', 'task1')}
                      /> 
                      Learn about free screenings
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day1.task2}
                        onChange={() => handleTaskChange('day1', 'task2')}
                      /> 
                      Watch myth-busting video
                    </li>
                  </ul>
                </div>

                {/* Day 2 */}
                <div className={`day-card ${currentDay >= 2 ? '' : 'hidden'}`} data-day="2" ref={dayRefs.current[1]}>
                  <h3>Day 2</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day2.task1}
                        onChange={() => handleTaskChange('day2', 'task1')}
                      /> 
                      Do 3-min self-reflection
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day2.task2}
                        onChange={() => handleTaskChange('day2', 'task2')}
                      /> 
                      Mark why screening matters
                    </li>
                  </ul>
                </div>

                {/* Day 3 */}
                <div className={`day-card ${currentDay >= 3 ? '' : 'hidden'}`} data-day="3" ref={dayRefs.current[2]}>
                  <h3>Day 3</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day3.task1}
                        onChange={() => handleTaskChange('day3', 'task1')}
                      /> 
                      Do 3-min self-reflection
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day3.task2}
                        onChange={() => handleTaskChange('day3', 'task2')}
                      /> 
                      Mark why screening matters
                    </li>
                  </ul>
                </div>

                {/* Day 4 */}
                <div className={`day-card ${currentDay >= 4 ? '' : 'hidden'}`} data-day="4" ref={dayRefs.current[3]}>
                  <h3>Day 4</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day4.task1}
                        onChange={() => handleTaskChange('day4', 'task1')}
                      /> 
                      Placeholder task 1
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day4.task2}
                        onChange={() => handleTaskChange('day4', 'task2')}
                      /> 
                      Placeholder task 2
                    </li>
                  </ul>
                </div>

                {/* Day 5 */}
                <div className={`day-card ${currentDay >= 5 ? '' : 'hidden'}`} data-day="5" ref={dayRefs.current[4]}>
                  <h3>Day 5</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day5.task1}
                        onChange={() => handleTaskChange('day5', 'task1')}
                      /> 
                      Placeholder task 1
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day5.task2}
                        onChange={() => handleTaskChange('day5', 'task2')}
                      /> 
                      Placeholder task 2
                    </li>
                  </ul>
                </div>

                {/* Day 6 */}
                <div className={`day-card ${currentDay >= 6 ? '' : 'hidden'}`} data-day="6" ref={dayRefs.current[5]}>
                  <h3>Day 6</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day6.task1}
                        onChange={() => handleTaskChange('day6', 'task1')}
                      /> 
                      Placeholder task 1
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day6.task2}
                        onChange={() => handleTaskChange('day6', 'task2')}
                      /> 
                      Placeholder task 2
                    </li>
                  </ul>
                </div>

                {/* Day 7 */}
                <div className={`day-card ${currentDay >= 7 ? '' : 'hidden'}`} data-day="7" ref={dayRefs.current[6]}>
                  <h3>Day 7</h3>
                  <ul>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day7.task1}
                        onChange={() => handleTaskChange('day7', 'task1')}
                      /> 
                      Placeholder task 1
                    </li>
                    <li>
                      <input 
                        type="checkbox" 
                        checked={tasks.day7.task2}
                        onChange={() => handleTaskChange('day7', 'task2')}
                      /> 
                      Placeholder task 2
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="progress-card">
              <h2 className="progress-title">Journey Progress</h2>
              <div className="circle-wrapper">
                <svg width="160" height="160" viewBox="0 0 120 120">
                  <circle
                    cx="60" cy="60" r="54"
                    stroke="#eee" strokeWidth="12" fill="none"
                  />
                  <circle
                    cx="60" cy="60" r="54"
                    stroke="#b0004e"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 - (animatedProgress / 100) * 339.292}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.3s', transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
                  />
                  <text
                    x="60" y="68"
                    textAnchor="middle"
                    fontSize="32"
                    fill="#b0004e"
                    fontWeight="bold"
                  >
                    {animatedProgress}%
                  </text>
                </svg>
              </div>
            </div>
          </div>

          <div className="bottom-row">
            {/* Today's Challenge */}
            <div className="box challenge-box">
              <h2 className="box-title">Today's Challenge</h2>
              <ul className="task-list">
                <li><input type="checkbox" /> Eat 2 servings of fruits 🍎</li>
                <li><input type="checkbox" /> Walk 30 minutes 🚶‍♂️</li>
              </ul>
              <div className="streak-tracker">
                <p className="streak-label">🔥 4-day streak</p>
                <div className="streak-bar">
                  <div className="dot done"></div>
                  <div className="dot done"></div>
                  <div className="dot done"></div>
                  <div className="dot current" title="Keep it up!"></div>
                  <div className="dot upcoming"></div>
                  <div className="dot upcoming"></div>
                  <div className="dot upcoming"></div>
                </div>
              </div>
            </div>

            {/* Wellness Duo */}
            <div className="box duo-box">
              <div className="duo-header">
                <h2 className="box-title">
                  Wellness Duo with
                  <span className="duo-profile">
                    <img src="/assets/duo-profile.png" alt="Duo" />
                    <div className="duo-name">Jamie</div>
                  </span>
                </h2>
              </div>
              <div className="duo-stats">
                <p>🔥 <strong>Duo Streak:</strong> 3 days</p>
                <p>🏆 <strong>Shared Goal:</strong> "7-Day Water Challenge"</p>
                <p><strong>Progress:</strong> ▓▓▓░░░░ (3/7)</p>
              </div>
              <div className="duo-actions">
                <button className="btn-duo">Send Nudge</button>
                <button className="btn-duo outline">View Duo Progress Details</button>
              </div>
              <div className="duo-badge">
                <p>🪪 <strong>Community Builder Badge:</strong> 60%</p>
                <div className="duo-progress-bar">
                  <div className="duo-progress-fill" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>

            {/* Reminders */}
            <div className="box reminders-box">
              <h2 className="box-title">Reminders</h2>
              <ul className="reminder-list">
                <li>📅 Your screening is scheduled for <strong>18 June</strong></li>
                <li>💧 2 days left to complete the Hydration Challenge</li>
                <li>🧠 Mental Wellness Webinar this Friday at 4 PM</li>
                <li>🔔 Don't forget to log your breakfast today</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 