import React, { useEffect, useState, useRef } from 'react'
import styles from '../styles/Terminal.module.css'

const Terminal = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])
  const [typingInProgress, setTypingInProgress] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const terminalRef = useRef(null)

  const commandList = [
    'help',
    'about',
    'projects',
    'skills',
    'experience',
    'contact',
    'education',
    'certifications',
    'leadership',
    'clear'
  ]

  const commandOutputs = {
    help: `Available commands:
about       - Learn about me
projects    - View my projects
skills      - See my technical skills
experience  - My work experience
contact     - How to reach me
education   - My educational background
certifications - View my certifications
leadership  - Leadership and community involvement
clear       - Clear the terminal

Type any command to continue...`,
about: `Hi, I'm Surya Teja Devi, a Developer & Cybersecurity Enthusiast.  

I specialize in:  
• Full-Stack Development (Java, React, Node.js)  
• Cybersecurity & Bug Bounty Hunting  
• Cloud Infrastructure & Automation  
• AI/ML Applications in Security  

I'm passionate about building secure, scalable systems and solving real-world problems through technology.`,

projects: `Recent Projects:  

• AI-Powered Ambulance Traffic System – Built with OpenCV & TensorFlow to detect ambulances and optimize traffic signals.  
• Tractor Rental Platform – End-to-end rental solution with authentication, booking, and real-time tracking using Flutter & Firebase.  
• CyberRecon – Automated reconnaissance & dorking tool for bug bounty hunters with stylized reporting.  
• Automated Cyber Threat Detection – Hybrid OSSEC + Isolation Forest ML system for enterprise threat monitoring.  
• Network Performance Benchmarking – Full-stack project with React.js frontend & Node.js backend.  

Each project highlights my focus on innovation, security, and scalability.`,

skills: `Technical Skills:  

Languages:  
• Java, JavaScript, Python, C++  

Frameworks & Technologies:  
• React.js, Node.js, Express  
• Tailwind CSS, Material UI  
• Firebase, MySQL, MongoDB  

Cybersecurity Tools:  
• Burp Suite, Nmap, Wireshark, OSSEC  
• Recon & Dorking (Google, GitHub)  
• Vulnerability Assessment & Penetration Testing`,

experience: `Professional Experience:  

Cybersecurity Intern – AICTE Palo Alto Networks (Jul 2024 – Sep 2024)  
• Hands-on with firewalls, IDS/IPS, and security policies.  
• Implemented real-world security best practices.  
• Learned cloud security, threat intelligence, and ethical hacking.  

Projects (2024–2025)  
• Built AI-powered security & full-stack systems.  
• Focused on bridging development with cybersecurity principles.`,

contact: `Contact Information:  

📧 Email: surya.teja.devi@email.com  
💼 LinkedIn: linkedin.com/in/suryatejadevi  
🐙 GitHub: github.com/SuryaTejaDevi  

Feel free to reach out for collaborations, security consulting, or tech discussions!`,

education: `Educational Background:  

🎓 Bachelor of Engineering in Computer Science – CMR College of Engineering & Technology (2021–2025)  

📚 Continuous Learning:  
• Bug Bounty Hunting & Pentesting  
• Java Full-Stack Development  
• Cloud Security & AI/ML in Cybersecurity`,

certifications: `Certifications:  

🏆 AICTE – Palo Alto Networks Cybersecurity Virtual Internship  
🏆 Ethical Hacking & Penetration Testing (self-learning)  `,

leadership: `Leadership & Community:  

🎯 Department Coordinator – Azura Event, CMRCET (2025)  
• Organized & coordinated student activities across 2nd–4th year.  

👥 Student Council Member – CMR College of Engineering (2022–Present)  
• Led technical workshops & hackathons with 200+ participants.  
• Represented students in academic decision-making.  

🌍 Community Involvement:  
• Contributor to security awareness initiatives.  
• Active in bug bounty & open-source communities.`

  }

  const prompt = "surya@portfolio:~$ "

  // Typing effect
  const typeEffect = (text, callback) => {
    setTypingInProgress(true)
    let i = 0
    let currentLine = ''

    const interval = setInterval(() => {
      currentLine += text.charAt(i)
      setOutput((prev) => {
        const lines = [...prev]
        lines[lines.length - 1] = currentLine
        return lines
      })
      i++
      if (i >= text.length) {
        clearInterval(interval)
        setTypingInProgress(false)
        if (callback) callback()
      }
    }, 20)
  }

  // Print command and response
  const printCommandWithResponse = (cmd, response) => {
    setOutput((prev) => [...prev, `${prompt}${cmd}`])
    if (response) {
      setOutput((prev) => [...prev, ""])
      typeEffect(response, () => {
        setOutput((prev) => [...prev, " "])
      })
    }
  }

  // Process command input
  const processCommand = (cmd) => {
    cmd = cmd.trim().toLowerCase()
    if (cmd === "clear") {
      setOutput([])
      setFailedAttempts(0)
      setCommandHistory([])
      setHistoryIndex(-1)
      return
    }

    if (commandOutputs[cmd]) {
      printCommandWithResponse(cmd, commandOutputs[cmd])
      setFailedAttempts(0)
      setCommandHistory((prev) => [...prev, cmd])
      setHistoryIndex(-1)
    } else if (cmd) {
      setFailedAttempts((prev) => prev + 1)
      if (failedAttempts + 1 >= 5) {
        setOutput([])
        setFailedAttempts(0)
        setCommandHistory([])
        setHistoryIndex(-1)
        return
      }
      printCommandWithResponse(
        cmd,
        `bash: ${cmd}: command not found\n\nType 'help' for available commands`
      )
    }
  }

  // Handle navigation click
  const handleNavigationClick = (command) => {
    if (typingInProgress) return // prevent interrupting typing
    setInput(command)
    processCommand(command)
  }

  // Keyboard input handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (typingInProgress) {
        e.preventDefault()
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        if (input.trim() !== "") {
          processCommand(input)
          setInput("")
        }
        setHistoryIndex(-1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        if (commandHistory.length === 0) return
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setInput(commandHistory[newIndex])
      } else if (e.key === "ArrowDown") {
        e.preventDefault()
        if (commandHistory.length === 0) return
        const newIndex = historyIndex + 1
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex)
          setInput(commandHistory[newIndex])
        } else {
          setHistoryIndex(-1)
          setInput("")
        }
      } else if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1))
      } else if (e.key.length === 1 && !e.ctrlKey) {
        setInput((prev) => prev + e.key)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [input, typingInProgress, failedAttempts, historyIndex, commandHistory])

  // Welcome message on load
  useEffect(() => {
    setOutput([`${prompt}welcome`, ""])
    typeEffect(
      "Hi, I'm Surya Teja Devi, a Developer & Cyber Security Professional.\n\nWelcome to my interactive portfolio terminal!\nType 'help' to see available commands."
    )
  }, [])

  // Auto scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  return (
    <div className={styles.container}>
      {/* Navigation Bar */}
      <div className={styles.navigation}>
        <div className={styles.navCommands}>
          {commandList.map((command, index) => (
            <React.Fragment key={command}>
              <span
                className={styles.navCommand}
                onClick={() => handleNavigationClick(command)}
              >
                {command}
              </span>
              {index < commandList.length - 1 && (
                <span className={styles.separator}> | </span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className={styles.navUnderline}></div>
      </div>

      {/* Terminal Output */}
      <div className={styles.output} ref={terminalRef}>
        {output.map((line, index) => {
          if (line.startsWith(prompt)) {
            const command = line.slice(prompt.length)
            return (
              <div key={index} className={styles.line}>
                <span className={styles.prompt}>{prompt}</span>
                <span className={styles.input}>{command}</span>
              </div>
            )
          }
          return (
            <div key={index} className={`${styles.line} ${styles.output_text}`}>
              {line}
            </div>
          )
        })}


        {/* Input Line */}
        <div className={styles.line}>
          <span className={styles.prompt}>{prompt}</span>
          <span className={styles.input}>{input}</span>
          <span className={styles.cursor}>_</span>
        </div>
      </div>
    </div>
  )
}

export default Terminal
 