# 🎯 Custom Image Hangman Game

A unique twist on the classic hangman game where you can upload your own image and watch as a noose is progressively drawn around it with each wrong guess!

## 🌐 **Live Demo**

**Play the game online:** [customhangman.netlify.app](https://customhangman.netlify.app)

## ✨ Features

- **🎨 Custom Character Editor**: Manually crop faces and draw stick figure bodies
- **📱 Mobile Optimized**: Touch-friendly interface for smartphones and tablets
- **🎮 Three Difficulty Levels**: Easy, Medium, and Hard word categories
- **🖼️ Image Processing**: Background removal and face detection
- **🎯 Progressive Noose Drawing**: Watch as the noose builds with each wrong guess
- **💫 Modern UI**: Beautiful, responsive design with smooth animations
- **📊 Game Statistics**: Track lives, difficulty, and progress
- **🎨 Visual Feedback**: Green pop-ups for correct guesses
- **🔄 Real-time Updates**: Instant feedback and smooth gameplay

## 🎮 How to Play

1. **Choose Difficulty**: Select Easy, Medium, or Hard
2. **Upload Your Image**: Click to upload any image from your device
3. **Edit Your Character**: 
   - Crop your face with a circular mask
   - Draw a stick figure body underneath
4. **Start Game**: Begin guessing letters
5. **Watch the Noose**: Each wrong guess adds a piece of the noose
6. **Win or Lose**: Complete the word before the noose is finished!

## 🎯 Game Rules

- **6 Lives**: You have 6 wrong guesses before losing
- **Progressive Noose**: Each wrong guess adds a piece:
  - 1st: Vertical pole
  - 2nd: Top horizontal beam  
  - 3rd: Rope from beam
  - 4th: Noose loop
  - 5th: Rope to neck
  - 6th: Final tightening (red rope)
- **Win Condition**: Guess all letters in the word
- **Lose Condition**: Complete the noose

## 📱 Mobile Features

- **Touch Support**: Full touch interaction for drawing and cropping
- **iPhone Optimized**: Perfect fit for iPhone-sized displays
- **Responsive Design**: Adapts to any screen size
- **Touch-Accurate**: Precise touch coordinate handling

## 🛠️ Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript
- **Canvas Drawing**: HTML5 Canvas for noose and character rendering
- **Image Processing**: Client-side background removal and face detection
- **Touch Events**: Comprehensive mobile touch support
- **No Dependencies**: No external libraries required
- **File Handling**: Local file upload and processing

## 🚀 Getting Started

### Option 1: Play Online
Visit [customhangman.netlify.app](https://customhangman.netlify.app) to play immediately!

### Option 2: Run Locally
1. Download all files to a folder
2. Open `index.html` in a modern web browser
3. Or run a local server: `python3 -m http.server 8000`
4. Upload an image and start playing!

## 📁 File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling and responsive design
├── script.js           # Game logic, canvas drawing, and touch handling
├── package.json        # Project metadata and scripts
├── .gitignore          # Git ignore rules
├── DEPLOYMENT.md       # Deployment instructions
└── README.md           # This file
```

## 🎨 Character Editor

The game features a powerful character editor:
- **Face Cropping**: Circular mask for precise face selection
- **Body Drawing**: Pen tool to draw stick figure bodies
- **Real-time Preview**: See changes instantly
- **Touch Support**: Works perfectly on mobile devices

## 🌟 Word Categories

- **Easy**: Simple 4-6 letter nouns (cat, house, tree)
- **Medium**: Common 7-9 letter nouns (computer, mountain, elephant)  
- **Hard**: Challenging 10+ letter nouns (adventure, celebration, technology)

## 🎯 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

You can easily customize the game by:
- Adding more words to the `words` object in `script.js`
- Changing the noose drawing style in the `drawNoose()` method
- Modifying colors and styling in `styles.css`
- Adjusting the canvas size in `index.html`
- Adding new difficulty levels

## 🚀 Deployment

The game is deployed on Netlify and available at [customhangman.netlify.app](https://customhangman.netlify.app)

For deployment instructions, see `DEPLOYMENT.md`

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy playing Custom Image Hangman! 🎮✨** 