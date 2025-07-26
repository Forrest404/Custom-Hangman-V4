# Custom Image Hangman Game

A unique twist on the classic hangman game where you can upload your own image and watch as a noose is progressively drawn around it with each wrong guess!

## Features

- **Custom Image Upload**: Upload any image to be your "hanging person"
- **Progressive Noose Drawing**: Watch as the noose is built piece by piece with each wrong guess
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Word Categories**: Programming and computer science themed words
- **Game Statistics**: Track lives remaining and used letters
- **Mobile Friendly**: Works on desktop and mobile devices

## How to Play

1. **Upload Your Image**: Click the file input to select an image from your device
2. **Start Game**: Click "Start Game" to begin with a random word
3. **Guess Letters**: Type letters to guess the word
4. **Watch the Noose**: Each wrong guess adds a piece of the noose around your image
5. **Win or Lose**: Complete the word before the noose is finished!

## Game Rules

- You have 6 lives (wrong guesses)
- Each wrong guess adds a piece of the noose:
  - 1st wrong guess: Vertical pole
  - 2nd wrong guess: Top horizontal beam
  - 3rd wrong guess: Rope from beam
  - 4th wrong guess: Noose loop
  - 5th wrong guess: Rope to neck
  - 6th wrong guess: Final tightening (red rope)
- Win by guessing all letters in the word
- Lose when the noose is complete

## Technical Details

- **Frontend**: Pure HTML5, CSS3, and JavaScript
- **Canvas Drawing**: HTML5 Canvas for noose rendering
- **Image Processing**: Client-side image scaling and positioning
- **No Dependencies**: No external libraries required
- **File Handling**: Local file upload and processing

## Getting Started

1. Download all files to a folder
2. Open `index.html` in a modern web browser
3. Upload an image and start playing!

## File Structure

```
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # Game logic and canvas drawing
└── README.md       # This file
```

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

You can easily customize the game by:
- Adding more words to the `words` array in `script.js`
- Changing the noose drawing style in the `drawNoose()` method
- Modifying colors and styling in `styles.css`
- Adjusting the canvas size in `index.html`

## License

This project is open source and available under the MIT License. 