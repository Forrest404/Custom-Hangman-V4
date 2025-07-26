class HangmanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = null;
        this.word = '';
        this.guessedLetters = new Set();
        this.wrongGuesses = 0;
        this.maxWrongGuesses = 6;
        this.gameActive = false;
        
        // Image positioning properties
        this.imageX = 0;
        this.imageY = 0;
        this.imageScale = 1;
        this.backgroundRemoved = false;
        this.faceDetected = false;
        this.faceData = null;
        this.stickFigureMode = false;
        
        // Character editor properties
        this.characterCanvas = null;
        this.characterCtx = null;
        this.cropCircle = { x: 200, y: 150, radius: 100 };
        this.isDrawing = false;
        this.isMovingCrop = false;
        this.currentTool = 'pen';
        this.brushSize = 5;
        this.brushColor = '#000000';
        this.croppedFace = null;
        this.currentStep = 1; // 1 = cropping, 2 = drawing
        this.originalImage = null;
        this.scaledImage = null;
        
        this.words = {
            easy: [
                'CAT', 'DOG', 'HAT', 'SUN', 'MOON', 'STAR', 'TREE', 'BOOK', 'BALL', 'FISH',
                'BIRD', 'HOUSE', 'CAR', 'DOOR', 'WINDOW', 'TABLE', 'CHAIR', 'PHONE', 'KEY', 'PEN',
                'CUP', 'MAP', 'BAG', 'BOX', 'BED', 'EGG', 'EYE', 'EAR', 'ARM', 'LEG',
                'HAND', 'FOOT', 'HEAD', 'NOSE', 'MOUTH', 'HAIR', 'FACE', 'NECK', 'BACK', 'HAND',
                'CAKE', 'MILK', 'BREAD', 'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'PIZZA', 'BURGER', 'CHIPS'
            ],
            medium: [
                'COMPUTER', 'ELEPHANT', 'MOUNTAIN', 'OCEAN', 'BUTTERFLY', 'RAINBOW', 'DINOSAUR', 'BICYCLE', 'UMBRELLA', 'DRAGON',
                'CASTLE', 'DIAMOND', 'VOLCANO', 'TELESCOPE', 'WATERFALL', 'SKYSCRAPER', 'SUBMARINE', 'HELICOPTER', 'TORNADO', 'AIRPLANE',
                'BASKETBALL', 'FOOTBALL', 'BASEBALL', 'TENNIS', 'SOCCER', 'SWIMMING', 'RUNNING', 'JUMPING', 'DANCING', 'SINGING',
                'PAINTING', 'DRAWING', 'WRITING', 'READING', 'COOKING', 'BAKING', 'CLEANING', 'SHOPPING', 'WORKING', 'SLEEPING'
            ],
            hard: [
                'ASTRONAUT', 'ROCKETSHIP', 'SPACESHIP', 'TELESCOPE', 'MICROSCOPE', 'LABORATORY', 'EXPERIMENT', 'DISCOVERY', 'INVENTION', 'TECHNOLOGY',
                'ADVENTURE', 'EXPLORATION', 'EXPEDITION', 'JOURNEY', 'VOYAGE', 'PILGRIMAGE', 'QUEST', 'MISSION', 'CHALLENGE', 'ACHIEVEMENT',
                'CELEBRATION', 'FESTIVAL', 'CARNIVAL', 'PARADE', 'CONCERT', 'PERFORMANCE', 'ENTERTAINMENT', 'AMUSEMENT', 'RECREATION', 'LEISURE'
            ]
        };
        
        this.currentDifficulty = 'medium';

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(e.target.closest('.difficulty-btn').dataset.difficulty);
            });
        });

        // Image upload
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e);
        });

        // Upload area click
        document.getElementById('uploadArea').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        // Start game button
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.openCharacterEditor();
        });

        // Character editor buttons
        document.getElementById('backToUploadBtn').addEventListener('click', () => {
            this.closeCharacterEditor();
        });

        document.getElementById('finishCharacterBtn').addEventListener('click', () => {
            this.finishCharacterAndStartGame();
        });

        // Character editor controls
        document.getElementById('circleSizeSlider').addEventListener('input', (e) => {
            this.updateCropCircle(parseInt(e.target.value));
        });

        document.getElementById('resetCropBtn').addEventListener('click', () => {
            this.resetCrop();
        });

        document.getElementById('applyCropBtn').addEventListener('click', () => {
            this.applyCrop();
        });

        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.closest('.tool-btn').dataset.tool);
            });
        });

        document.getElementById('brushSizeSlider').addEventListener('input', (e) => {
            this.updateBrushSize(parseInt(e.target.value));
        });

        document.getElementById('colorPicker').addEventListener('change', (e) => {
            this.updateBrushColor(e.target.value);
        });

        document.getElementById('clearTool').addEventListener('click', () => {
            this.clearDrawing();
        });

        // Letter input
        document.getElementById('letterInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });

        document.getElementById('guessBtn').addEventListener('click', () => {
            this.makeGuess();
        });

        // Game controls
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('resetImageBtn').addEventListener('click', () => {
            this.resetImage();
        });

        document.getElementById('toggleControlsBtn').addEventListener('click', () => {
            this.toggleImageControls();
        });

        document.getElementById('closeControlsBtn').addEventListener('click', () => {
            this.closeImageControls();
        });

        document.getElementById('toggleStickFigureBtn').addEventListener('click', () => {
            this.toggleStickFigureMode();
        });

        // Image positioning controls
        document.getElementById('xSlider').addEventListener('input', (e) => {
            this.imageX = parseInt(e.target.value);
            document.getElementById('xPos').textContent = this.imageX;
            this.drawCanvas();
        });

        document.getElementById('ySlider').addEventListener('input', (e) => {
            this.imageY = parseInt(e.target.value);
            document.getElementById('yPos').textContent = this.imageY;
            this.drawCanvas();
        });

        document.getElementById('sizeSlider').addEventListener('input', (e) => {
            this.imageScale = parseInt(e.target.value) / 100;
            document.getElementById('sizePos').textContent = Math.round(this.imageScale * 100);
            this.drawCanvas();
        });

        document.getElementById('removeBackgroundBtn').addEventListener('click', () => {
            this.removeBackground();
        });

        document.getElementById('detectFaceBtn').addEventListener('click', () => {
            this.detectFaceAndAddStickFigure();
        });

        document.getElementById('manualFaceBtn').addEventListener('click', () => {
            this.enableManualFaceSelection();
        });

        document.getElementById('resetPositionBtn').addEventListener('click', () => {
            this.resetImagePosition();
        });

        // Modal
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideModal();
            this.newGame();
        });

        document.getElementById('changeImageBtn').addEventListener('click', () => {
            this.hideModal();
            this.resetImage();
        });
    }

    selectDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        
        // Update UI
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        
        // Update difficulty display
        const difficultyNames = {
            easy: 'Easy',
            medium: 'Medium',
            hard: 'Hard'
        };
        document.getElementById('difficultyDisplay').textContent = difficultyNames[difficulty];
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.image = new Image();
                this.image.onload = () => {
                    document.getElementById('startGameBtn').disabled = false;
                };
                this.image.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    openCharacterEditor() {
        if (!this.image) return;
        
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('characterEditor').style.display = 'block';
        
        this.initializeCharacterEditor();
    }

    closeCharacterEditor() {
        document.getElementById('characterEditor').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';
        this.resetCharacterEditor();
    }

    initializeCharacterEditor() {
        // Initialize character canvas
        this.characterCanvas = document.getElementById('characterCanvas');
        this.characterCtx = this.characterCanvas.getContext('2d');
        
        // Store original image and create scaled version
        this.originalImage = this.image;
        this.createScaledImage();
        
        // Setup step 1 (face cropping)
        this.setupCropStep();
        
        // Add canvas events
        this.setupCanvasEvents();
    }

    createScaledImage() {
        const scale = Math.min(
            this.characterCanvas.width / this.originalImage.width,
            this.characterCanvas.height / this.originalImage.height
        );
        
        const scaledWidth = this.originalImage.width * scale;
        const scaledHeight = this.originalImage.height * scale;
        const x = (this.characterCanvas.width - scaledWidth) / 2;
        const y = 0;
        
        // Create scaled image on temporary canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.characterCanvas.width;
        tempCanvas.height = this.characterCanvas.height;
        
        tempCtx.drawImage(this.originalImage, x, y, scaledWidth, scaledHeight);
        this.scaledImage = tempCanvas;
    }

    setupCanvasEvents() {
        // Mouse events for desktop
        this.characterCanvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.characterCanvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.characterCanvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.characterCanvas.addEventListener('mouseout', this.handleMouseUp.bind(this));
        
        // Touch events for mobile devices
        this.characterCanvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.characterCanvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.characterCanvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.characterCanvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
    }

    handleMouseDown(e) {
        if (this.currentStep === 1) {
            this.startCropMove(e);
        } else if (this.currentStep === 2) {
            this.startDrawing(e);
        }
    }

    handleMouseMove(e) {
        if (this.currentStep === 1) {
            this.moveCropCircle(e);
        } else if (this.currentStep === 2) {
            this.draw(e);
        }
    }

    handleMouseUp(e) {
        if (this.currentStep === 1) {
            this.stopCropMove();
        } else if (this.currentStep === 2) {
            this.stopDrawing();
        }
    }

    // Touch event handlers for mobile devices
    handleTouchStart(e) {
        e.preventDefault(); // Prevent default touch behavior
        const touch = e.touches[0];
        const rect = this.characterCanvas.getBoundingClientRect();
        
        // Create a custom event with the correct coordinates
        const customEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            rect: rect
        };
        
        this.handleMouseDown(customEvent);
    }

    handleTouchMove(e) {
        e.preventDefault(); // Prevent default touch behavior
        const touch = e.touches[0];
        const rect = this.characterCanvas.getBoundingClientRect();
        
        // Create a custom event with the correct coordinates
        const customEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            rect: rect
        };
        
        this.handleMouseMove(customEvent);
    }

    handleTouchEnd(e) {
        e.preventDefault(); // Prevent default touch behavior
        this.handleMouseUp({});
    }

    setupCropStep() {
        this.currentStep = 1;
        this.updateStepIndicator();
        this.drawCharacterCanvas();
        
        // Show crop controls, hide drawing controls
        document.getElementById('cropControls').style.display = 'block';
        document.getElementById('drawingControls').style.display = 'none';
    }

    setupDrawingStep() {
        this.currentStep = 2;
        this.updateStepIndicator();
        this.drawCharacterCanvas();
        
        // Hide crop controls, show drawing controls
        document.getElementById('cropControls').style.display = 'none';
        document.getElementById('drawingControls').style.display = 'block';
    }

    updateStepIndicator() {
        document.getElementById('step1Indicator').classList.toggle('active', this.currentStep === 1);
        document.getElementById('step2Indicator').classList.toggle('active', this.currentStep === 2);
    }

    drawCharacterCanvas() {
        // Clear canvas
        this.characterCtx.clearRect(0, 0, this.characterCanvas.width, this.characterCanvas.height);
        
        if (this.currentStep === 1) {
            // Draw original image for cropping
            this.characterCtx.drawImage(this.scaledImage, 0, 0);
            this.drawCropCircle();
        } else if (this.currentStep === 2) {
            // Draw cropped face and allow drawing underneath
            if (this.croppedFace) {
                // Draw face at top
                const faceSize = 120;
                const faceX = (this.characterCanvas.width - faceSize) / 2;
                const faceY = 20;
                
                this.characterCtx.save();
                this.characterCtx.beginPath();
                this.characterCtx.arc(faceX + faceSize/2, faceY + faceSize/2, faceSize/2, 0, 2 * Math.PI);
                this.characterCtx.clip();
                this.characterCtx.drawImage(this.croppedFace, faceX, faceY, faceSize, faceSize);
                this.characterCtx.restore();
            }
        }
    }

    drawCropCircle() {
        this.characterCtx.save();
        this.characterCtx.globalCompositeOperation = 'destination-over';
        this.characterCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.characterCtx.fillRect(0, 0, this.characterCanvas.width, this.characterCanvas.height);
        
        this.characterCtx.globalCompositeOperation = 'destination-out';
        this.characterCtx.beginPath();
        this.characterCtx.arc(this.cropCircle.x, this.cropCircle.y, this.cropCircle.radius, 0, 2 * Math.PI);
        this.characterCtx.fill();
        
        this.characterCtx.restore();
        
        // Draw circle border
        this.characterCtx.strokeStyle = '#fff';
        this.characterCtx.lineWidth = 3;
        this.characterCtx.beginPath();
        this.characterCtx.arc(this.cropCircle.x, this.cropCircle.y, this.cropCircle.radius, 0, 2 * Math.PI);
        this.characterCtx.stroke();
    }

    updateCropCircle(size) {
        this.cropCircle.radius = size;
        document.getElementById('circleSize').textContent = size;
        this.drawCharacterCanvas();
    }

    startCropMove(e) {
        const rect = e.rect || this.characterCanvas.getBoundingClientRect();
        const scaleX = this.characterCanvas.width / rect.width;
        const scaleY = this.characterCanvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        console.log('Touch coordinates:', {
            clientX: e.clientX,
            clientY: e.clientY,
            rect: rect,
            scaleX: scaleX,
            scaleY: scaleY,
            canvasX: x,
            canvasY: y,
            cropCircle: this.cropCircle
        });
        
        const distance = Math.sqrt(
            Math.pow(x - this.cropCircle.x, 2) + 
            Math.pow(y - this.cropCircle.y, 2)
        );
        
        if (distance <= this.cropCircle.radius) {
            this.isMovingCrop = true;
            console.log('Starting crop move');
        }
    }

    moveCropCircle(e) {
        if (!this.isMovingCrop) return;
        
        const rect = e.rect || this.characterCanvas.getBoundingClientRect();
        const scaleX = this.characterCanvas.width / rect.width;
        const scaleY = this.characterCanvas.height / rect.height;
        
        this.cropCircle.x = (e.clientX - rect.left) * scaleX;
        this.cropCircle.y = (e.clientY - rect.top) * scaleY;
        
        // Keep circle within canvas bounds
        this.cropCircle.x = Math.max(this.cropCircle.radius, Math.min(this.characterCanvas.width - this.cropCircle.radius, this.cropCircle.x));
        this.cropCircle.y = Math.max(this.cropCircle.radius, Math.min(this.characterCanvas.height - this.cropCircle.radius, this.cropCircle.y));
        
        console.log('Moving crop circle to:', this.cropCircle.x, this.cropCircle.y);
        this.drawCharacterCanvas();
    }

    stopCropMove() {
        this.isMovingCrop = false;
    }

    resetCrop() {
        this.cropCircle = { x: 200, y: 150, radius: 100 };
        document.getElementById('circleSizeSlider').value = 100;
        document.getElementById('circleSize').textContent = '100';
        this.drawCharacterCanvas();
    }

    applyCrop() {
        // Create a temporary canvas to extract the face
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        tempCanvas.width = this.cropCircle.radius * 2;
        tempCanvas.height = this.cropCircle.radius * 2;
        
        // Create circular clipping path
        tempCtx.beginPath();
        tempCtx.arc(this.cropCircle.radius, this.cropCircle.radius, this.cropCircle.radius, 0, 2 * Math.PI);
        tempCtx.clip();
        
        // Draw the cropped face
        tempCtx.drawImage(
            this.scaledImage,
            this.cropCircle.x - this.cropCircle.radius,
            this.cropCircle.y - this.cropCircle.radius,
            this.cropCircle.radius * 2,
            this.cropCircle.radius * 2,
            0, 0,
            this.cropCircle.radius * 2,
            this.cropCircle.radius * 2
        );
        
        // Save the cropped face
        this.croppedFace = new Image();
        this.croppedFace.onload = () => {
            // Move to drawing step
            this.setupDrawingStep();
        };
        this.croppedFace.src = tempCanvas.toDataURL();
    }

    checkCharacterComplete() {
        // Enable finish button if face is cropped and some drawing is done
        if (this.croppedFace) {
            document.getElementById('finishCharacterBtn').disabled = false;
        }
    }

    selectTool(tool) {
        if (tool === 'clear') {
            this.clearDrawing();
            return;
        }
        
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
    }

    updateBrushSize(size) {
        this.brushSize = size;
        document.getElementById('brushSize').textContent = size;
    }

    updateBrushColor(color) {
        this.brushColor = color;
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.draw(e);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const rect = e.rect || this.characterCanvas.getBoundingClientRect();
        const scaleX = this.characterCanvas.width / rect.width;
        const scaleY = this.characterCanvas.height / rect.height;
        
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        
        this.characterCtx.lineWidth = this.brushSize;
        this.characterCtx.lineCap = 'round';
        this.characterCtx.lineJoin = 'round';
        
        if (this.currentTool === 'pen') {
            this.characterCtx.strokeStyle = this.brushColor;
        } else if (this.currentTool === 'eraser') {
            this.characterCtx.strokeStyle = '#f8f8f8';
        }
        
        this.characterCtx.lineTo(x, y);
        this.characterCtx.stroke();
        this.characterCtx.beginPath();
        this.characterCtx.moveTo(x, y);
        
        // Check if character is complete after drawing
        this.checkCharacterComplete();
    }

    stopDrawing() {
        this.isDrawing = false;
        this.characterCtx.beginPath();
    }

    clearDrawing() {
        // Clear only the drawing area (below the face)
        this.characterCtx.clearRect(0, 150, this.characterCanvas.width, this.characterCanvas.height - 150);
    }

    finishCharacterAndStartGame() {
        if (!this.croppedFace) {
            alert('Please crop your face first!');
            return;
        }
        
        // Save the entire character canvas
        this.customCharacter = this.characterCanvas.toDataURL();
        
        // Start the game with custom character
        this.startGameWithCustomCharacter();
    }

    startGameWithCustomCharacter() {
        this.gameActive = true;
        this.word = this.getRandomWord();
        this.guessedLetters.clear();
        this.wrongGuesses = 0;
        this.stickFigureMode = true;
        this.faceDetected = true;

        document.getElementById('characterEditor').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        document.getElementById('letterInput').focus();

        this.updateDisplay();
        this.drawCanvas();
        
        // Add touch support for main game canvas
        this.setupGameCanvasTouch();
    }

    resetCharacterEditor() {
        this.currentStep = 1;
        this.croppedFace = null;
        this.customCharacter = null;
        this.cropCircle = { x: 200, y: 150, radius: 100 };
        this.isDrawing = false;
        this.isMovingCrop = false;
        this.currentTool = 'pen';
        this.brushSize = 5;
        this.brushColor = '#000000';
        
        // Reset UI
        document.getElementById('finishCharacterBtn').disabled = true;
        document.getElementById('circleSizeSlider').value = 100;
        document.getElementById('circleSize').textContent = '100';
        document.getElementById('brushSizeSlider').value = 5;
        document.getElementById('brushSize').textContent = '5';
        document.getElementById('colorPicker').value = '#000000';
    }

    startGame() {
        if (!this.image) return;

        this.gameActive = true;
        this.word = this.getRandomWord();
        this.guessedLetters.clear();
        this.wrongGuesses = 0;

        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('gameScreen').style.display = 'block';
        document.getElementById('letterInput').focus();

        this.updateDisplay();
        this.drawCanvas();
        
        // Add touch support for main game canvas
        this.setupGameCanvasTouch();
    }

    setupGameCanvasTouch() {
        // Add touch events to main game canvas for image positioning
        this.canvas.addEventListener('touchstart', this.handleGameTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleGameTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleGameTouchEnd.bind(this), { passive: false });
    }

    handleGameTouchStart(e) {
        e.preventDefault();
        // Could be used for touch-based image positioning in the future
    }

    handleGameTouchMove(e) {
        e.preventDefault();
        // Could be used for touch-based image positioning in the future
    }

    handleGameTouchEnd(e) {
        e.preventDefault();
        // Could be used for touch-based image positioning in the future
    }

    toggleImageControls() {
        const panel = document.getElementById('controlsPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }

    closeImageControls() {
        document.getElementById('controlsPanel').style.display = 'none';
    }

    toggleStickFigureMode() {
        if (this.faceDetected) {
            this.stickFigureMode = !this.stickFigureMode;
            this.drawCanvas();
        }
    }

    resetImagePosition() {
        this.imageX = 0;
        this.imageY = 0;
        this.imageScale = 1;
        
        document.getElementById('xSlider').value = 0;
        document.getElementById('ySlider').value = 0;
        document.getElementById('sizeSlider').value = 100;
        document.getElementById('xPos').textContent = '0';
        document.getElementById('yPos').textContent = '0';
        document.getElementById('sizePos').textContent = '100';
        
        this.drawCanvas();
    }

    async removeBackground() {
        if (!this.image) return;
        
        try {
            // Create a temporary canvas to process the image
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCanvas.width = this.image.width;
            tempCanvas.height = this.image.height;
            
            // Draw the original image
            tempCtx.drawImage(this.image, 0, 0);
            
            // Get image data for processing
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            // Improved background removal
            const width = tempCanvas.width;
            const height = tempCanvas.height;
            
            // Sample edge colors to determine background
            const edgeColors = this.sampleEdgeColors(data, width, height);
            const backgroundThreshold = this.calculateBackgroundThreshold(edgeColors);
            
            console.log('Background threshold:', backgroundThreshold);
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                const x = (i / 4) % width;
                const y = Math.floor((i / 4) / width);
                
                // Check if pixel is background-like
                const isBackground = this.isBackgroundPixel(r, g, b, edgeColors, backgroundThreshold, x, y, width, height);
                
                if (isBackground) {
                    // Make background transparent
                    data[i + 3] = 0; // Alpha channel
                }
            }
            
            tempCtx.putImageData(imageData, 0, 0);
            
            // Create new image with processed data
            const processedImage = new Image();
            processedImage.onload = () => {
                this.image = processedImage;
                this.backgroundRemoved = true;
                this.drawCanvas();
                alert('Background removal completed! Check console for details.');
            };
            processedImage.src = tempCanvas.toDataURL();
            
        } catch (error) {
            console.error('Background removal failed:', error);
            alert('Background removal failed. Try a different image or use an image with a clear subject.');
        }
    }

    sampleEdgeColors(data, width, height) {
        const edgeColors = [];
        const sampleSize = 20;
        
        // Sample top edge
        for (let x = 0; x < width; x += sampleSize) {
            const index = (0 * width + x) * 4;
            edgeColors.push({
                r: data[index],
                g: data[index + 1],
                b: data[index + 2]
            });
        }
        
        // Sample bottom edge
        for (let x = 0; x < width; x += sampleSize) {
            const index = ((height - 1) * width + x) * 4;
            edgeColors.push({
                r: data[index],
                g: data[index + 1],
                b: data[index + 2]
            });
        }
        
        // Sample left edge
        for (let y = 0; y < height; y += sampleSize) {
            const index = (y * width + 0) * 4;
            edgeColors.push({
                r: data[index],
                g: data[index + 1],
                b: data[index + 2]
            });
        }
        
        // Sample right edge
        for (let y = 0; y < height; y += sampleSize) {
            const index = (y * width + (width - 1)) * 4;
            edgeColors.push({
                r: data[index],
                g: data[index + 1],
                b: data[index + 2]
            });
        }
        
        return edgeColors;
    }

    calculateBackgroundThreshold(edgeColors) {
        // Calculate average color and variance
        let avgR = 0, avgG = 0, avgB = 0;
        edgeColors.forEach(color => {
            avgR += color.r;
            avgG += color.g;
            avgB += color.b;
        });
        
        avgR /= edgeColors.length;
        avgG /= edgeColors.length;
        avgB /= edgeColors.length;
        
        // Calculate variance
        let variance = 0;
        edgeColors.forEach(color => {
            const diff = Math.sqrt(
                Math.pow(color.r - avgR, 2) +
                Math.pow(color.g - avgG, 2) +
                Math.pow(color.b - avgB, 2)
            );
            variance += diff;
        });
        variance /= edgeColors.length;
        
        return {
            avgR, avgG, avgB,
            variance,
            threshold: variance * 1.5 // Adjustable threshold
        };
    }

    isBackgroundPixel(r, g, b, edgeColors, threshold, x, y, width, height) {
        // Check if pixel is near edges
        const isNearEdge = x < 10 || x > width - 10 || y < 10 || y > height - 10;
        
        // Check if pixel is very light (white background)
        const isVeryLight = r > 240 && g > 240 && b > 240;
        
        // Check if pixel is very dark (black background)
        const isVeryDark = r < 30 && g < 30 && b < 30;
        
        // Check if pixel is similar to edge colors
        const colorDistance = Math.sqrt(
            Math.pow(r - threshold.avgR, 2) +
            Math.pow(g - threshold.avgG, 2) +
            Math.pow(b - threshold.avgB, 2)
        );
        const isSimilarToEdge = colorDistance < threshold.threshold;
        
        return isNearEdge || isVeryLight || isVeryDark || isSimilarToEdge;
    }

    async detectFaceAndAddStickFigure() {
        if (!this.image) return;
        
        try {
            // Create a temporary canvas to process the image
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCanvas.width = this.image.width;
            tempCanvas.height = this.image.height;
            
            // Draw the original image
            tempCtx.drawImage(this.image, 0, 0);
            
            // Get image data for face detection
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const data = imageData.data;
            
            // Simple face detection based on skin tone and shape
            const faceData = this.detectFaceSimple(imageData);
            
            if (faceData) {
                this.faceData = faceData;
                this.faceDetected = true;
                this.stickFigureMode = true;
                document.getElementById('toggleStickFigureBtn').style.display = 'inline-block';
                this.drawCanvas();
                alert('Face detected! Stick figure mode activated. Use "Toggle Stick Figure" to switch between modes.');
            } else {
                alert('No face detected automatically. Try:\n1. A clearer image with a visible face\n2. Use "Manual Face Selection" button\n3. Check browser console for debugging info');
            }
            
        } catch (error) {
            console.error('Face detection failed:', error);
            alert('Face detection failed. Try a different image.');
        }
    }

    detectFaceSimple(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        console.log('Starting face detection on image:', width, 'x', height);
        
        // Look for skin tone regions with multiple detection methods
        const skinToneRegions = [];
        const faceCandidates = [];
        
        // Method 1: Skin tone detection
        for (let y = 0; y < height; y += 3) { // Increased sampling for better detection
            for (let x = 0; x < width; x += 3) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Enhanced skin tone detection
                if (this.isSkinTone(r, g, b)) {
                    skinToneRegions.push({ x, y, r, g, b });
                }
            }
        }
        
        console.log('Found', skinToneRegions.length, 'skin tone pixels');
        
        if (skinToneRegions.length > 0) {
            // Find the largest connected skin tone region (likely the face)
            const faceRegion = this.findLargestRegion(skinToneRegions, width, height);
            
            if (faceRegion) {
                console.log('Face region found:', faceRegion);
                return {
                    x: faceRegion.centerX,
                    y: faceRegion.centerY,
                    width: faceRegion.width,
                    height: faceRegion.height
                };
            }
        }
        
        // Method 2: Center region detection (fallback)
        console.log('Trying center region detection...');
        const centerRegion = this.detectCenterRegion(data, width, height);
        if (centerRegion) {
            console.log('Center region detected:', centerRegion);
            return centerRegion;
        }
        
        console.log('No face detected');
        return null;
    }

    isSkinTone(r, g, b) {
        // Enhanced skin tone detection with multiple rules
        const rules = [
            // Rule 1: Basic skin tone range
            r > 95 && g > 40 && b > 20 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
            r > g && r > b && r - g > 15 && r - b > 15,
            
            // Rule 2: Lighter skin tones
            r > 180 && g > 120 && b > 80 &&
            r > g && g > b && r - g < 60 && g - b < 60,
            
            // Rule 3: Darker skin tones
            r > 60 && g > 30 && b > 15 &&
            r > g && g > b && r - g > 10 && g - b > 10,
            
            // Rule 4: Very light skin
            r > 200 && g > 150 && b > 120 &&
            r > g && g > b && r - g < 80 && g - b < 80
        ];
        
        return rules.some(rule => rule);
    }

    detectCenterRegion(data, width, height) {
        // Fallback: detect the main subject in the center of the image
        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const regionSize = Math.min(width, height) * 0.3; // 30% of smaller dimension
        
        // Find the most prominent color in the center region
        const centerColors = [];
        const startX = Math.max(0, centerX - regionSize / 2);
        const endX = Math.min(width, centerX + regionSize / 2);
        const startY = Math.max(0, centerY - regionSize / 2);
        const endY = Math.min(height, centerY + regionSize / 2);
        
        for (let y = startY; y < endY; y += 5) {
            for (let x = startX; x < endX; x += 5) {
                const index = (y * width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                
                // Skip very light or very dark pixels
                if (!(r > 240 && g > 240 && b > 240) && !(r < 30 && g < 30 && b < 30)) {
                    centerColors.push({ x, y, r, g, b });
                }
            }
        }
        
        if (centerColors.length > 0) {
            // Calculate bounding box of center region
            const minX = Math.min(...centerColors.map(p => p.x));
            const maxX = Math.max(...centerColors.map(p => p.x));
            const minY = Math.min(...centerColors.map(p => p.y));
            const maxY = Math.max(...centerColors.map(p => p.y));
            
            return {
                x: (minX + maxX) / 2,
                y: (minY + maxY) / 2,
                width: maxX - minX,
                height: maxY - minY
            };
        }
        
        return null;
    }

    findLargestRegion(skinToneRegions, width, height) {
        if (skinToneRegions.length === 0) return null;
        
        // Simple clustering to find the largest connected region
        const clusters = [];
        const visited = new Set();
        
        for (const point of skinToneRegions) {
            if (visited.has(`${point.x},${point.y}`)) continue;
            
            const cluster = this.floodFill(skinToneRegions, point, visited);
            if (cluster.length > 10) { // Minimum cluster size
                clusters.push(cluster);
            }
        }
        
        if (clusters.length === 0) return null;
        
        // Find the largest cluster
        const largestCluster = clusters.reduce((largest, current) => 
            current.length > largest.length ? current : largest
        );
        
        // Calculate bounding box
        const minX = Math.min(...largestCluster.map(p => p.x));
        const maxX = Math.max(...largestCluster.map(p => p.x));
        const minY = Math.min(...largestCluster.map(p => p.y));
        const maxY = Math.max(...largestCluster.map(p => p.y));
        
        return {
            centerX: (minX + maxX) / 2,
            centerY: (minY + maxY) / 2,
            width: maxX - minX,
            height: maxY - minY
        };
    }

    floodFill(points, startPoint, visited) {
        const cluster = [];
        const queue = [startPoint];
        const key = `${startPoint.x},${startPoint.y}`;
        visited.add(key);
        
        while (queue.length > 0) {
            const point = queue.shift();
            cluster.push(point);
            
            // Check neighboring points
            for (const neighbor of points) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                if (visited.has(neighborKey)) continue;
                
                const distance = Math.sqrt(
                    Math.pow(point.x - neighbor.x, 2) + 
                    Math.pow(point.y - neighbor.y, 2)
                );
                
                if (distance < 20) { // Connected if within 20 pixels
                    visited.add(neighborKey);
                    queue.push(neighbor);
                }
            }
        }
        
        return cluster;
    }

    drawStickFigureWithFace(imageX, imageY, imageWidth, imageHeight) {
        if (!this.faceData) return;
        
        // Calculate face position relative to canvas
        const baseScale = Math.min(
            (this.canvas.width - 40) / this.image.width,
            (this.canvas.height - 100) / this.image.height
        );
        
        const faceX = imageX + (this.faceData.x * baseScale * this.imageScale);
        const faceY = imageY + (this.faceData.y * baseScale * this.imageScale);
        const faceWidth = this.faceData.width * baseScale * this.imageScale;
        const faceHeight = this.faceData.height * baseScale * this.imageScale;
        
        // Draw stick figure body
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        // Head circle (where face will be placed)
        this.ctx.beginPath();
        this.ctx.arc(faceX, faceY, faceWidth / 2, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Neck
        const neckY = faceY + faceHeight / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(faceX, neckY);
        this.ctx.lineTo(faceX, neckY + 20);
        this.ctx.stroke();
        
        // Torso
        const torsoY = neckY + 20;
        this.ctx.beginPath();
        this.ctx.moveTo(faceX, torsoY);
        this.ctx.lineTo(faceX, torsoY + 40);
        this.ctx.stroke();
        
        // Arms
        const armY = torsoY + 10;
        this.ctx.beginPath();
        this.ctx.moveTo(faceX - 25, armY);
        this.ctx.lineTo(faceX + 25, armY);
        this.ctx.stroke();
        
        // Hands
        this.ctx.beginPath();
        this.ctx.arc(faceX - 25, armY, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(faceX + 25, armY, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Legs
        const legY = torsoY + 40;
        this.ctx.beginPath();
        this.ctx.moveTo(faceX, legY);
        this.ctx.lineTo(faceX - 15, legY + 30);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.moveTo(faceX, legY);
        this.ctx.lineTo(faceX + 15, legY + 30);
        this.ctx.stroke();
        
        // Feet
        this.ctx.beginPath();
        this.ctx.arc(faceX - 15, legY + 30, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(faceX + 15, legY + 30, 5, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw the face image in the head circle
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(faceX, faceY, faceWidth / 2, 0, 2 * Math.PI);
        this.ctx.clip();
        
        // Calculate face image position to center it in the circle
        const faceImageX = faceX - faceWidth / 2;
        const faceImageY = faceY - faceHeight / 2;
        
        this.ctx.drawImage(this.image, faceImageX, faceImageY, faceWidth, faceHeight);
        this.ctx.restore();
    }

    getRandomWord() {
        const wordList = this.words[this.currentDifficulty];
        return wordList[Math.floor(Math.random() * wordList.length)];
    }

    makeGuess() {
        if (!this.gameActive) return;

        const input = document.getElementById('letterInput');
        const letter = input.value.toUpperCase();

        if (!letter || !/^[A-Z]$/.test(letter)) {
            alert('Please enter a valid letter (A-Z)');
            return;
        }

        if (this.guessedLetters.has(letter)) {
            alert('You already guessed that letter!');
            return;
        }

        this.guessedLetters.add(letter);
        
        // Check if letter is correct
        const isCorrect = this.word.includes(letter);
        
        if (isCorrect) {
            // Correct letter - show green feedback
            this.showCorrectFeedback(letter);
        } else {
            // Wrong letter - add to wrong guesses and draw noose
            this.wrongGuesses++;
            this.drawNoose();
            this.addUsedLetter(letter, false);
        }

        input.value = '';
        this.updateDisplay();

        if (this.checkGameEnd()) {
            this.endGame();
        }
    }

    addUsedLetter(letter, isCorrect = false) {
        const usedLettersDiv = document.getElementById('usedLetters');
        const letterSpan = document.createElement('span');
        letterSpan.className = isCorrect ? 'correct-letter' : 'used-letter';
        letterSpan.textContent = letter;
        usedLettersDiv.appendChild(letterSpan);
    }

    showCorrectFeedback(letter) {
        // Add letter to used letters with green styling
        this.addUsedLetter(letter, true);
        
        // Show visual feedback
        this.showCorrectAnimation();
        
        // Optional: Play a success sound or add more visual effects
        console.log(`Correct! Letter "${letter}" found in the word.`);
    }

    showCorrectAnimation() {
        // Create a temporary success message
        const successMsg = document.createElement('div');
        successMsg.className = 'correct-feedback';
        successMsg.innerHTML = `
            <div class="correct-icon">✅</div>
            <div class="correct-text">Correct!</div>
        `;
        
        // Add to the game screen
        const gameScreen = document.getElementById('gameScreen');
        gameScreen.appendChild(successMsg);
        
        // Remove after animation
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 1500);
    }

    updateDisplay() {
        document.getElementById('lives').textContent = this.maxWrongGuesses - this.wrongGuesses;
        
        const wordDisplay = this.word
            .split('')
            .map(letter => this.guessedLetters.has(letter) ? letter : '_')
            .join(' ');
        document.getElementById('wordDisplay').textContent = wordDisplay;
        
        // Update progress
        const guessedCount = this.word.split('').filter(letter => this.guessedLetters.has(letter)).length;
        document.getElementById('progress').textContent = `${guessedCount}/${this.word.length}`;
    }

    drawCanvas() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.customCharacter) {
            // Draw custom character
            this.drawCustomCharacter();
        } else if (this.image) {
            // Calculate base image dimensions to fit in canvas
            const maxWidth = this.canvas.width - 40;
            const maxHeight = this.canvas.height - 100;
            
            let imgWidth = this.image.width;
            let imgHeight = this.image.height;
            
            // Scale image to fit
            const baseScale = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            imgWidth *= baseScale * this.imageScale;
            imgHeight *= baseScale * this.imageScale;
            
            // Calculate position with offset
            const baseX = (this.canvas.width - imgWidth) / 2;
            const baseY = 50;
            const x = baseX + (this.imageX * 2); // Multiply by 2 for more movement range
            const y = baseY + (this.imageY * 2);
            
            if (this.stickFigureMode && this.faceDetected) {
                // Draw stick figure with face
                this.drawStickFigureWithFace(x, y, imgWidth, imgHeight);
            } else {
                // Draw original image
                this.ctx.drawImage(this.image, x, y, imgWidth, imgHeight);
            }
        }

        // Draw noose based on wrong guesses
        this.drawNoose();
    }

    drawCustomCharacter() {
        // Calculate position with offset
        const baseX = (this.canvas.width - 400) / 2;
        const baseY = 50;
        const x = baseX + (this.imageX * 2);
        const y = baseY + (this.imageY * 2);
        
        // Draw the custom character
        const characterImg = new Image();
        characterImg.onload = () => {
            this.ctx.drawImage(characterImg, x, y, 400, 500);
        };
        characterImg.src = this.customCharacter;
    }

    drawNoose() {
        // Enhanced noose drawing with better visibility
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';

        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Base platform (always visible)
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 8;
        this.ctx.beginPath();
        this.ctx.moveTo(30, canvasHeight - 30);
        this.ctx.lineTo(370, canvasHeight - 30);
        this.ctx.stroke();

        // Add shadow effect
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;

        // Vertical pole
        if (this.wrongGuesses >= 1) {
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 12;
            this.ctx.beginPath();
            this.ctx.moveTo(120, canvasHeight - 30);
            this.ctx.lineTo(120, 80);
            this.ctx.stroke();
        }

        // Top horizontal beam
        if (this.wrongGuesses >= 2) {
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 12;
            this.ctx.beginPath();
            this.ctx.moveTo(120, 80);
            this.ctx.lineTo(320, 80);
            this.ctx.stroke();
        }

        // Rope from beam
        if (this.wrongGuesses >= 3) {
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(320, 80);
            this.ctx.lineTo(320, 120);
            this.ctx.stroke();
        }

        // Noose loop
        if (this.wrongGuesses >= 4) {
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.arc(320, 140, 25, 0, 2 * Math.PI);
            this.ctx.stroke();
            
            // Add rope texture
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI) / 4;
                this.ctx.beginPath();
                this.ctx.moveTo(320 + Math.cos(angle) * 20, 140 + Math.sin(angle) * 20);
                this.ctx.lineTo(320 + Math.cos(angle) * 25, 140 + Math.sin(angle) * 25);
                this.ctx.stroke();
            }
        }

        // Rope to neck area
        if (this.wrongGuesses >= 5) {
            this.ctx.strokeStyle = '#654321';
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(320, 115);
            this.ctx.lineTo(320, 165);
            this.ctx.stroke();
        }

        // Final tightening (red rope)
        if (this.wrongGuesses >= 6) {
            this.ctx.strokeStyle = '#FF0000';
            this.ctx.lineWidth = 8;
            this.ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.moveTo(320, 115);
            this.ctx.lineTo(320, 165);
            this.ctx.stroke();
            
            // Add warning effect
            this.ctx.strokeStyle = '#FF4444';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(320, 115);
            this.ctx.lineTo(320, 165);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        // Reset shadow
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
    }

    enableManualFaceSelection() {
        if (!this.image) return;
        
        // Create a simple manual face selection
        const faceSize = Math.min(this.image.width, this.image.height) * 0.3;
        const centerX = this.image.width / 2;
        const centerY = this.image.height / 2;
        
        this.faceData = {
            x: centerX,
            y: centerY,
            width: faceSize,
            height: faceSize
        };
        
        this.faceDetected = true;
        this.stickFigureMode = true;
        document.getElementById('toggleStickFigureBtn').style.display = 'inline-block';
        this.drawCanvas();
        
        alert('Manual face selection activated! Face placed in center. Use positioning controls to adjust.');
    }

    checkGameEnd() {
        // Check if word is complete
        const wordComplete = this.word
            .split('')
            .every(letter => this.guessedLetters.has(letter));

        if (wordComplete) {
            return 'win';
        }

        if (this.wrongGuesses >= this.maxWrongGuesses) {
            return 'lose';
        }

        return false;
    }

    endGame() {
        this.gameActive = false;
        const result = this.checkGameEnd();
        
        const modal = document.getElementById('gameOverModal');
        const resultText = document.getElementById('gameResult');
        const messageText = document.getElementById('gameMessage');
        const modalIcon = document.getElementById('modalIcon');

        if (result === 'win') {
            modalIcon.textContent = '🎉';
            resultText.textContent = 'Congratulations! You Won!';
            resultText.style.color = '#4CAF50';
            messageText.textContent = `You correctly guessed: ${this.word}`;
        } else {
            modalIcon.textContent = '💀';
            resultText.textContent = 'Game Over! You Lost!';
            resultText.style.color = '#f44336';
            messageText.textContent = `The word was: ${this.word}`;
        }

        modal.style.display = 'flex';
    }

    hideModal() {
        document.getElementById('gameOverModal').style.display = 'none';
    }

    newGame() {
        this.word = this.getRandomWord();
        this.guessedLetters.clear();
        this.wrongGuesses = 0;
        this.gameActive = true;

        document.getElementById('usedLetters').innerHTML = '';
        document.getElementById('letterInput').value = '';
        document.getElementById('letterInput').focus();

        this.updateDisplay();
        this.drawCanvas();
    }

    resetImage() {
        this.gameActive = false;
        this.image = null;
        this.faceDetected = false;
        this.faceData = null;
        this.stickFigureMode = false;
        document.getElementById('imageInput').value = '';
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('welcomeScreen').style.display = 'block';
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('usedLetters').innerHTML = '';
        document.getElementById('toggleStickFigureBtn').style.display = 'none';
        document.getElementById('controlsPanel').style.display = 'none';
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
}); 