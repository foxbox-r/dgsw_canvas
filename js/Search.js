let NUMBER_OF_ROW = 30;
let NUMBER_OF_COLUMN = NUMBER_OF_ROW * 2;
const BOX_MARGIN = 1;
let DEBUG_MODE = false;
let DELAY_TIME = 20;
let SEARCH_TYPE = "DFS";
const X_Direction = [0, 0, -1, 1];
const Y_Direction = [-1, 1, 0, 0];
let requestAnimationID;
let app;

const rowInput = document.getElementById("rowInput");
const columnInput = document.getElementById("columnInput");
const delayInput = document.getElementById("delayInput");
const searchSelect = document.getElementById("searchSelect");
const debugCheck = document.getElementById("debugCheck");
const resetButton = document.getElementById("resetButton");

inputInit();
rowInput.addEventListener("change", changeOption);
columnInput.addEventListener("change", changeOption);
delayInput.addEventListener("change", _changeOption);
debugCheck.addEventListener("change", toggleDebug);
searchSelect.addEventListener("change", _changeOption);
resetButton.addEventListener("click", reset);

function reset() {
  app.closeRender();
  app = new App();
}

function inputInit() {
  rowInput.value = NUMBER_OF_ROW;
  columnInput.value = NUMBER_OF_COLUMN;
  delayInput.value = DELAY_TIME;
  debugCheck.checked = DEBUG_MODE;
}

function toggleDebug() {
  console.log("toggleDebug");
  DEBUG_MODE = !DEBUG_MODE;
}

function _changeOption() {
  console.log("_change");
  DELAY_TIME = Number(delayInput.value);
  SEARCH_TYPE = searchSelect.value;
}

function changeOption(e) {
  console.log("change");
  NUMBER_OF_ROW = Number(rowInput.value);
  NUMBER_OF_COLUMN = Number(columnInput.value);

  app.closeRender();
  app = new App();
}

function showType() {
  console.log(Box.Types);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function BFS(mapArr, startRow, startColumn) {
  const startBox = mapArr[startRow][startColumn];
  startBox.status = Box.Types.VISITED_STATUS;
  const queue = new Queue();

  queue.enqueue(startBox);
  while (!queue.isEmpty) {
    let currentBox = queue.dequeue();

    for (let i = 0; i < 4; i++) {
      const nextRow = currentBox.row + Y_Direction[i];
      const nextColumn = currentBox.column + X_Direction[i];
      if (isCanVisit(nextRow, nextColumn)) {
        await sleep(DELAY_TIME).then(() => {
          const nextBox = mapArr[nextRow][nextColumn];
          nextBox.status = Box.Types.VISITED_STATUS;
          queue.enqueue(nextBox);
        });
      }
    }
  }

  function isCanVisit(nextRow, nextColumn) {
    return (
      0 <= nextRow &&
      nextRow < NUMBER_OF_ROW &&
      0 <= nextColumn &&
      nextColumn < NUMBER_OF_COLUMN &&
      mapArr[nextRow][nextColumn].status == Box.Types.EMPTY_STATUS
    );
  }
}

async function DFS(mapArr, startRow, startColumn) {
  const startBox = mapArr[startRow][startColumn];

  startBox.status = Box.Types.VISITED_STATUS;

  if (DEBUG_MODE) {
    // console.log(startBox.row, startBox.column);
  }

  await a(0);
  await a(1);
  await a(2);
  await a(3);

  async function a(i) {
    const nextRow = startBox.row + Y_Direction[i];
    const nextColumn = startBox.column + X_Direction[i];
    if (isCanVisit(nextRow, nextColumn)) {
      await sleep(DELAY_TIME).then(() => DFS(mapArr, nextRow, nextColumn));
    }
  }

  function isCanVisit(nextRow, nextColumn) {
    return (
      0 <= nextRow &&
      nextRow < NUMBER_OF_ROW &&
      0 <= nextColumn &&
      nextColumn < NUMBER_OF_COLUMN &&
      mapArr[nextRow][nextColumn].status == Box.Types.EMPTY_STATUS
    );
  }
}

class Box {
  static Types = {
    EMPTY_STATUS: 0,
    BLOCK_STATUS: 1,
    VISITED_STATUS: 2,
    SEARCH_STATUS: 3,
  };

  static width = 0;
  static height = 0;
  static margin = BOX_MARGIN;

  constructor(x = 0, y = 0, status = Box.Types.EMPTY_STATUS) {
    this._row;
    this._column;
    this._x = x;
    this._y = y;
    this._status = status;
    this._startX;
    this._endX;
    this._startY;
    this._endY;
  }

  update(ctx) {
    const computedX = this.startX;
    const computedY = this.startY;
    const computedWidth = this.endX - this.startX;
    const computedHeight = this.endY - this.startY;
    const centerOfWidth = computedX + computedWidth / 2;
    const centerOfHeight = computedY + computedHeight / 2;

    if (DEBUG_MODE) {
      if (this.status === Box.Types.VISITED_STATUS) {
        ctx.fillStyle = "gray";
      } else if (this.status === Box.Types.BLOCK_STATUS) {
        ctx.fillStyle = "red";
      }
    } else {
      if (this.status === Box.Types.EMPTY_STATUS) {
        ctx.fillStyle = "white";
      } else if (this.status === Box.Types.BLOCK_STATUS) {
        ctx.fillStyle = "white";
      } else if (this.status === Box.Types.VISITED_STATUS) {
        ctx.fillStyle = "Black";
      }
    }

    ctx.fillRect(computedX, computedY, computedWidth, computedHeight);
    if (DEBUG_MODE) {
      ctx.fillStyle = "white";
      ctx.font = `${this.fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const text = `x:${this.column}, y:${this.row}, s:${this.status}`;
      ctx.fillText(text, centerOfWidth, centerOfHeight);
    }
    ctx.fillStyle = "black";
  }

  get fontSize() {
    return Box.width * 0.1;
  }

  isClick(clickedPositionX, clickedPositionY) {
    return (
      this.startX <= clickedPositionX &&
      clickedPositionX <= this.endX &&
      this.startY <= clickedPositionY &&
      clickedPositionY <= this.endY
    );
  }

  onClickWithOutKey(mapArr) {
    this.status = Box.Types.SEARCH_STATUS;
    if (SEARCH_TYPE === "DFS") {
      DFS(mapArr, this.row, this.column);
    } else {
      BFS(mapArr, this.row, this.column);
    }
  }
  onClickWithShiftKey() {
    if (this.status !== Box.Types.BLOCK_STATUS) {
      this.status = Box.Types.BLOCK_STATUS;
    } else {
      this.status = Box.Types.EMPTY_STATUS;
    }
  }
  get row() {
    return this._row;
  }
  set row(row) {
    this._row = row;
  }
  get column() {
    return this._column;
  }
  set column(column) {
    this._column = column;
  }
  get x() {
    return this._x;
  }
  set x(x) {
    this._x = x;
  }
  get y() {
    return this._y;
  }
  set y(y) {
    this._y = y;
  }
  get status() {
    return this._status;
  }
  set status(status) {
    this._status = status;
  }
  get startX() {
    return this._startX;
  }
  set startX(startX) {
    this._startX = startX;
  }
  get startY() {
    return this._startY;
  }
  set startY(startY) {
    this._startY = startY;
  }
  get endX() {
    return this._endX;
  }
  set endX(endX) {
    this._endX = endX;
  }
  get endY() {
    return this._endY;
  }
  set endY(endY) {
    this._endY = endY;
  }
}

class Map {
  constructor(data) {
    this._arr = [];
    this._ctx = data.ctx;
    this._canvas = data.canvas;
    this._numberOfRow = data.numberOfRow;
    this._numberOfColumn = data.numberOfColumn;

    this.init();
  }

  getBlockBoxPosition() {
    const result = [];
    this.arr.map((row) => {
      row.map((box) => {
        if (box.status === Box.Types.BLOCK_STATUS) {
          result.push({ row: box.row, column: box.column });
        }
      });
    });
    return JSON.stringify(result);
  }

  init() {
    for (let i = 0; i < this.numberOfRow; i++) {
      let row = [];
      this.arr.push(row);
      for (let j = 0; j < this.numberOfColumn; j++) {
        let newBox = new Box();
        newBox.row = i;
        newBox.column = j;
        row.push(newBox);
      }
    }

    this.canvas.addEventListener("click", this.onClick.bind(this));
  }

  resize() {
    this.setBoxSize();
    this.setBoxPositionXY();
  }

  setBoxSize() {
    const boxWidth = this.canvas.width / this.numberOfColumn;
    const boxHeight = this.canvas.height / this.numberOfRow;

    Box.width = boxWidth;
    Box.height = boxHeight;
  }
  setBoxPositionXY() {
    this.arr.map((row, rowIndex) => {
      row.map((box, columnIndex) => {
        const boxX = columnIndex * Box.width;
        const boxY = rowIndex * Box.height;
        const boxStartX = boxX + Box.margin;
        const boxStartY = boxY + Box.margin;
        const boxEndX = boxX + Box.width - Box.margin * 2;
        const boxEndY = boxY + Box.height - Box.margin * 2;

        box.x = boxX;
        box.y = boxY;
        box.startX = boxStartX;
        box.startY = boxStartY;
        box.endX = boxEndX;
        box.endY = boxEndY;
      });
    });
  }

  update() {
    this.arr.map((row) => {
      row.map((box) => {
        box.update(this.ctx);
      });
    });
  }

  getBoxByClickPosition(clickedPositionX, clickedPositionY) {
    let result = false;
    this.arr.map((row) => {
      row.map((box) => {
        if (box.isClick(clickedPositionX, clickedPositionY)) {
          result = box;
        }
      });
    });

    return result;
  }

  onClick(e) {
    const SHIFT = e.shiftKey;
    const clickedPositionX = e.clientX * App.pixelRatio;
    const clickedPositionY = e.clientY * App.pixelRatio;
    const clickedBox = this.getBoxByClickPosition(
      clickedPositionX,
      clickedPositionY
    );

    if (clickedBox) {
      const mapArr = this.arr;
      if (SHIFT) {
        clickedBox.onClickWithShiftKey(mapArr);
      } else {
        clickedBox.onClickWithOutKey(mapArr);
      }
    }
  }

  get arr() {
    return this._arr;
  }
  set arr(arr) {
    this._arr = arr;
  }
  get ctx() {
    return this._ctx;
  }
  get canvas() {
    return this._canvas;
  }
  set canvas(canvas) {
    this._canvas = canvas;
  }
  get numberOfRow() {
    return this._numberOfRow;
  }
  set numberOfRow(numberOfRow) {
    this._numberOfRow = numberOfRow;
  }
  get numberOfColumn() {
    return this._numberOfColumn;
  }
  set numberOfColumn(numberOfColumn) {
    this._numberOfColumn = numberOfColumn;
  }
}

class App {
  static pixelRatio = 0;

  constructor() {
    this.init();
    this.render();
  }

  init() {
    this.canvasInit();
    this.mapInit();
    this.resizeInit();
  }

  canvasInit() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    App.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }
  mapInit() {
    this.map = new Map({
      ctx: this.ctx,
      canvas: this.canvas,
      numberOfRow: NUMBER_OF_ROW,
      numberOfColumn: NUMBER_OF_COLUMN,
    });
  }
  resizeInit() {
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
  }

  update() {
    this.map.update();
  }

  resize() {
    console.log("resize");
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * App.pixelRatio;
    this.canvas.height = this.stageHeight * App.pixelRatio;

    this.map.resize();
  }

  render() {
    // console.log("render");
    requestAnimationID = window.requestAnimationFrame(this.render.bind(this));

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.update();
  }

  closeRender() {
    console.log("closeRender");
    window.cancelAnimationFrame(requestAnimationID);
  }
}

window.onload = () => {
  app = new App();
  HI_FOXBOX.map((position) => {
    app.map._arr[position.row][position.column].status = Box.Types.BLOCK_STATUS;
  });
  console.log(app);
};
