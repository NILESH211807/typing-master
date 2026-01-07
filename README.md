# ⌨️ Typing Master - Advanced Typing Speed Test

![Typing Master Overview](./public/overview.png)

## 📝 Description

**Typing Master** is a modern, feature-rich typing speed test application built with Next.js and React. It helps users improve their typing skills by providing real-time feedback, detailed statistics, and an engaging user interface. Whether you're a beginner or an advanced typist, this application offers customizable typing tests to track your progress and enhance your typing speed and accuracy.

---

## ✨ Features

### 🎯 Core Testing Features

- **Two Testing Modes**
  - **Time Mode**: Type as many words as possible within a set time duration (default: 120 seconds)
  - **Words Mode**: Type a specific number of words as fast as possible (default: 50 words)

- **Real-time Typing Feedback**
  - Live character-by-character validation
  - Cursor that follows your typing position
  - Visual indication of correct characters (light gray for typed, dark gray for upcoming)
  - Animated error display showing incorrect characters in red

- **Backspace Support**
  - Fully functional backspace handling
  - Ability to correct mistakes by going back and retyping
  - Automatic tracking of backspace keystrokes

- **Word Management**
  - Automatic word generation using random word lists
  - Dynamic word addition as you approach the end
  - Line-based word locking to prevent jumping between lines
  - Smooth scrolling text display

### 🔊 Sound Effects

- **Correct Keystroke Sound**
  - Plays when you type a correct character
  - Randomized playback rate (0.95x - 1.05x) for natural variation
  - Toggleable via settings

- **Wrong Keystroke Sound**
  - Plays when you type an incorrect character
  - Distinguishable feedback for errors
  - Toggleable via settings

- **Sound Control**
  - Enable/disable sound effects in settings
  - Saves your preference to local storage
  - Non-intrusive notification of typing accuracy

### 📊 Comprehensive Results Dashboard

The typing test generates detailed statistics shown in a modal after completion:

- **WPM (Words Per Minute)** - Your typing speed
- **Time Taken** - Total duration of the test
- **CPM (Characters Per Minute)** - Character typing speed
- **KPM (Keystrokes Per Minute)** - Total keystroke speed
- **Accuracy** - Percentage of correct characters typed
- **Correct Characters** - Total number of correctly typed characters
- **Errors** - Total number of incorrect characters
- **Backspaces** - Number of times backspace was used

### ⚙️ Customizable Settings

Access the settings menu to customize your typing experience:

- **Mode Selection**
  - Switch between "Time" and "Words" modes
  - Instant preview of mode-specific requirements

- **Time Duration** (Time Mode)
  - Choose from preset durations: 15s, 30s, 60s, 120s seconds
  - Test durations match various difficulty levels

- **Word Count** (Words Mode)
  - Choose from preset counts: 10, 25, 50, 100 words
  - Scale your challenge based on skill level

- **Sound Toggle**
  - Enable or disable all sound effects
  - Instant feedback when toggling

- **Persistent Settings**
  - All settings are saved to browser's local storage
  - Your preferences persist across sessions
  - Automatic loading of saved settings on app startup

### 💾 State Management

- **TypingProvider Context**
  - Centralized state management for typing settings
  - Local storage integration for data persistence
  - Easy access to settings throughout the application

### 🎨 UI/UX Features

- **Responsive Design**
  - Fully responsive layout for desktop and mobile devices
  - Optimized for all screen sizes
  - Mobile-friendly touch interactions

- **Dark Theme**
  - Modern dark color scheme for comfortable typing
  - Reduced eye strain during long typing sessions
  - Tailwind CSS for consistent styling

- **Visual Indicators**
  - Animated cursor that blinks when idle
  - Real-time word and character count display
  - Timer display for time-based tests
  - Color-coded statistics (green for correct, red for errors)

- **Interactive Elements**
  - Collapsible settings sidebar
  - Modal-based result display
  - Smooth animations and transitions
  - Icon-based navigation (FaKeyboard, RiTimerLine, etc.)

### 🔄 Test Management

- **Repeat Test**
  - Repeat the same test with the current settings
  - Reset all typing progress and statistics

- **Next Test**
  - Generate a new set of random words
  - Start fresh with a new typing challenge
  - Maintains current settings

- **Auto-focus Input**
  - Click anywhere on the text area to refocus the input
  - Prevents accidental blur during typing

---

## 🛠️ Technical Stack

- **Framework**: Next.js 16.1.1
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons 5.5.0
- **Random Words**: random-words 2.0.1
- **Linting**: ESLint 9
- **Bundling**: Next.js built-in bundler

---

## 📁 Project Structure
