// Class representing the Rubik's Cube logic
class RubiksCube {
  constructor() {
    this.reset(); // Initialize cube faces
    this.colors = ["white", "yellow", "red", "orange", "blue", "green"]; // Face colors
  }

  // Reset the cube to solved state
  reset() {
    this.faces = {
      top: Array(9).fill(0),
      bottom: Array(9).fill(1),
      front: Array(9).fill(2),
      back: Array(9).fill(3),
      right: Array(9).fill(4),
      left: Array(9).fill(5),
    };
  }

  // Save cube state (for step-by-step tracking)
  saveState() {
    return JSON.parse(JSON.stringify(this.faces));
  }

  // Restore cube to a previously saved state
  restoreState(state) {
    this.faces = JSON.parse(JSON.stringify(state));
  }

  // Rotate a 3x3 face clockwise
  rotateFace(face) {
    const f = this.faces[face];
    const t = [...f];
    f[0] = t[6]; f[1] = t[3]; f[2] = t[0];
    f[3] = t[7]; f[4] = t[4]; f[5] = t[1];
    f[6] = t[8]; f[7] = t[5]; f[8] = t[2];
  }

  // Move functions: Rotate face and adjacent edges
  R() {
    this.rotateFace("right");
    const t = [this.faces.top[2], this.faces.top[5], this.faces.top[8]];
    this.faces.top[2] = this.faces.front[2];
    this.faces.top[5] = this.faces.front[5];
    this.faces.top[8] = this.faces.front[8];
    this.faces.front[2] = this.faces.bottom[2];
    this.faces.front[5] = this.faces.bottom[5];
    this.faces.front[8] = this.faces.bottom[8];
    this.faces.bottom[2] = this.faces.back[6];
    this.faces.bottom[5] = this.faces.back[3];
    this.faces.bottom[8] = this.faces.back[0];
    this.faces.back[6] = t[0];
    this.faces.back[3] = t[1];
    this.faces.back[0] = t[2];
  }

  RPrime() { this.R(); this.R(); this.R(); }

  L() {
    this.rotateFace("left");
    const t = [this.faces.top[0], this.faces.top[3], this.faces.top[6]];
    this.faces.top[0] = this.faces.back[8];
    this.faces.top[3] = this.faces.back[5];
    this.faces.top[6] = this.faces.back[2];
    this.faces.back[8] = this.faces.bottom[0];
    this.faces.back[5] = this.faces.bottom[3];
    this.faces.back[2] = this.faces.bottom[6];
    this.faces.bottom[0] = this.faces.front[0];
    this.faces.bottom[3] = this.faces.front[3];
    this.faces.bottom[6] = this.faces.front[6];
    this.faces.front[0] = t[0];
    this.faces.front[3] = t[1];
    this.faces.front[6] = t[2];
  }

  LPrime() { this.L(); this.L(); this.L(); }

  U() {
    this.rotateFace("top");
    const t = this.faces.front.slice(0, 3);
    this.faces.front.splice(0, 3, ...this.faces.right.slice(0, 3));
    this.faces.right.splice(0, 3, ...this.faces.back.slice(0, 3));
    this.faces.back.splice(0, 3, ...this.faces.left.slice(0, 3));
    this.faces.left.splice(0, 3, ...t);
  }

  UPrime() { this.U(); this.U(); this.U(); }

  D() {
    this.rotateFace("bottom");
    const t = this.faces.front.slice(6);
    this.faces.front.splice(6, 3, ...this.faces.left.slice(6));
    this.faces.left.splice(6, 3, ...this.faces.back.slice(6));
    this.faces.back.splice(6, 3, ...this.faces.right.slice(6));
    this.faces.right.splice(6, 3, ...t);
  }

  DPrime() { this.D(); this.D(); this.D(); }

  F() {
    this.rotateFace("front");
    const t = [this.faces.top[6], this.faces.top[7], this.faces.top[8]];
    this.faces.top[6] = this.faces.left[8];
    this.faces.top[7] = this.faces.left[5];
    this.faces.top[8] = this.faces.left[2];
    this.faces.left[8] = this.faces.bottom[2];
    this.faces.left[5] = this.faces.bottom[1];
    this.faces.left[2] = this.faces.bottom[0];
    this.faces.bottom[2] = this.faces.right[0];
    this.faces.bottom[1] = this.faces.right[3];
    this.faces.bottom[0] = this.faces.right[6];
    this.faces.right[0] = t[0];
    this.faces.right[3] = t[1];
    this.faces.right[6] = t[2];
  }

  FPrime() { this.F(); this.F(); this.F(); }

  B() {
    this.rotateFace("back");
    const t = [this.faces.top[0], this.faces.top[1], this.faces.top[2]];
    this.faces.top[0] = this.faces.right[2];
    this.faces.top[1] = this.faces.right[5];
    this.faces.top[2] = this.faces.right[8];
    this.faces.right[2] = this.faces.bottom[8];
    this.faces.right[5] = this.faces.bottom[7];
    this.faces.right[8] = this.faces.bottom[6];
    this.faces.bottom[8] = this.faces.left[6];
    this.faces.bottom[7] = this.faces.left[3];
    this.faces.bottom[6] = this.faces.left[0];
    this.faces.left[6] = t[0];
    this.faces.left[3] = t[1];
    this.faces.left[0] = t[2];
  }

  BPrime() { this.B(); this.B(); this.B(); }

  // Maps moves to their function
  moveMap = {
    "R": this.R.bind(this), "R'": this.RPrime.bind(this),
    "L": this.L.bind(this), "L'": this.LPrime.bind(this),
    "U": this.U.bind(this), "U'": this.UPrime.bind(this),
    "D": this.D.bind(this), "D'": this.DPrime.bind(this),
    "F": this.F.bind(this), "F'": this.FPrime.bind(this),
    "B": this.B.bind(this), "B'": this.BPrime.bind(this),
  };

  // Execute a move on the cube
  executeMove(move) {
    this.moveMap[move]();
  }

  // Get reverse of a move (for solution generation)
  reverseMove(move) {
    return move.includes("'") ? move.replace("'", "") : move + "'";
  }

  // Given a scramble, return the reversed moves (naive solver)
  getSolution(scramble) {
    return scramble.slice().reverse().map(this.reverseMove);
  }
}

// Class to handle UI rendering and interaction
class CubeUI {
  constructor() {
    this.cube = new RubiksCube();

    // Predefined scrambles
    this.scrambles = [
      ["R", "U", "R'", "U'"], // Easy
      ["L'", "U'", "L", "U", "F", "U", "F'"], // Medium
      ["B", "U", "L", "U'", "B'", "U'", "L'", "F", "U", "R", "U'", "F'", "R'", "D", "R", "D'", "R'", "U'"] // Hard
    ];
    this.scrambleNames = ["Easy", "Medium", "Hard"];
    this.currentScrambleIndex = -1;
    this.currentMoveIndex = -1;
    this.solutionStates = [];

    this.initDOM();     // Cache HTML elements
    this.bindEvents();  // Attach event listeners
    this.renderCube();  // Initial render
  }

  // Cache DOM elements
  initDOM() {
    this.cubeEl = document.getElementById("cube");
    this.loadBtn = document.getElementById("generateBtn");
    this.resetBtn = document.getElementById("resetBtn");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.statusEl = document.getElementById("status");
    this.moveInfo = document.getElementById("moveInfo");
    this.scrambleButtons = document.getElementById("scrambleButtons");
    this.scrambleSelector = document.getElementById("scrambleSelector");
  }

  // Attach event listeners to buttons
  bindEvents() {
    this.loadBtn.onclick = () => this.loadScrambles();
    this.resetBtn.onclick = () => this.reset();
    this.prevBtn.onclick = () => this.showMove(-1);
    this.nextBtn.onclick = () => this.showMove(1);
  }

  // Render cube faces on screen using 2D layout
  renderCube() {
    const layout = [
      ["empty", "empty", "empty", "top", "top", "top", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "top", "top", "top", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "top", "top", "top", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["left", "left", "left", "front", "front", "front", "right", "right", "right", "back", "back", "back"],
      ["left", "left", "left", "front", "front", "front", "right", "right", "right", "back", "back", "back"],
      ["left", "left", "left", "front", "front", "front", "right", "right", "right", "back", "back", "back"],
      ["empty", "empty", "empty", "bottom", "bottom", "bottom", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "bottom", "bottom", "bottom", "empty", "empty", "empty", "empty", "empty", "empty"],
      ["empty", "empty", "empty", "bottom", "bottom", "bottom", "empty", "empty", "empty", "empty", "empty", "empty"],
    ];

    const faces = this.cube.faces;
    const colors = this.cube.colors;
    const count = { top: 0, bottom: 0, front: 0, back: 0, right: 0, left: 0 };
    this.cubeEl.innerHTML = "";

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 12; c++) {
        const div = document.createElement("div");
        const face = layout[r][c];
        div.className = face === "empty" ? "face empty" : `face ${colors[faces[face][count[face]++]]}`;
        this.cubeEl.appendChild(div);
      }
    }
  }

  // Load scramble buttons
  loadScrambles() {
    this.scrambleButtons.innerHTML = "";
    this.scrambleNames.forEach((name, i) => {
      const btn = document.createElement("button");
      btn.textContent = name;
      btn.className = "scramble-btn";
      btn.onclick = () => this.selectScramble(i);
      this.scrambleButtons.appendChild(btn);
    });
    this.scrambleSelector.style.display = "block";
  }

  // Apply a scramble and compute solution
  selectScramble(i) {
    this.cube.reset();
    this.scrambleIndex = i;
    this.scramble = this.scrambles[i];
    this.solution = this.cube.getSolution(this.scramble);

    for (const move of this.scramble) this.cube.executeMove(move);
    this.scrambleState = this.cube.saveState();
    this.solutionStates = [this.scrambleState];

    this.cube.restoreState(this.scrambleState);
    for (const move of this.solution) {
      this.cube.executeMove(move);
      this.solutionStates.push(this.cube.saveState());
    }

    this.currentMoveIndex = 0;
    this.showMove(0);
  }

  // Show a specific move in the solution
  showMove(direction) {
    if (typeof direction === "number") this.currentMoveIndex += direction;
    this.currentMoveIndex = Math.max(0, Math.min(this.solutionStates.length - 1, this.currentMoveIndex));

    this.cube.restoreState(this.solutionStates[this.currentMoveIndex]);
    this.renderCube();
    this.updateInfo();
  }

  // Update move information in UI
  updateInfo() {
    const moveText = this.currentMoveIndex === 0 ? "Start" :
      this.solution[this.currentMoveIndex - 1];
    const nextMove = this.currentMoveIndex < this.solution.length ? this.solution[this.currentMoveIndex] : "Complete";

    this.statusEl.textContent = `Solving ${this.scrambleNames[this.scrambleIndex]}`;
    this.moveInfo.innerHTML = `
      <div class="scramble-moves"><strong>Scramble:</strong> ${this.scramble.join(" ")}</div>
      <div class="solution-progress">
        <strong>Progress:</strong> ${this.currentMoveIndex} / ${this.solution.length}<br>
        <strong>Last Move:</strong> ${moveText} | <strong>Next:</strong> ${nextMove}
      </div>`;
    this.prevBtn.disabled = this.currentMoveIndex === 0;
    this.nextBtn.disabled = this.currentMoveIndex >= this.solution.length;
  }

  // Reset everything to initial state
  reset() {
    this.cube.reset();
    this.scrambleIndex = -1;
    this.currentMoveIndex = -1;
    this.renderCube();
    this.scrambleSelector.style.display = "none";
    this.moveInfo.innerHTML = "";
    this.statusEl.textContent = 'Click "Load Scrambles" to start';
  }
}

// Initialize UI when document is ready
document.addEventListener("DOMContentLoaded", () => new CubeUI());
